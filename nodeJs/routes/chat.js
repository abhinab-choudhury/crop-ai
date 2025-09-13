const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

const { uploadImage, removeImage } = require('../helpers/cloudinary');
const multer = require('multer');
const predict = require('./cropRotationRoute');

const router = express.Router();

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const conversations = {};

const getConversationState = (sessionId) => {
    if (!conversations[sessionId]) {
        conversations[sessionId] = {
            data: {},
            history: []
        };
    }
    return conversations[sessionId];
};


router.post('/chat', upload.single('image'), async (req, res) => {
    const { sessionId, message } = req.body;
    const image = req.file;

    if (!sessionId || (!message && !image)) {
        return res.status(400).json({ success: false, message: "Session ID and either a message or image are required." });
    }

    const session = getConversationState(sessionId);

    if (message) {
        session.history.push({ role: "user", parts: [{ text: message }] });
    }
    if (image) {
        session.history.push({
            role: "user",
            parts: [{
                inlineData: {
                    data: image.buffer.toString("base64"),
                    mimeType: image.mimetype
                }
            }]
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: session.history,
            generationConfig: { temperature: 0.8 },
            systemInstruction: {
                parts: [{
                    text: `
You are an agricultural assistant. The user can ask for:
1. Crop rotation planning → requires N, P, K, pH, country, state, city.
2. Crop disease detection → requires an image of the plant.

Rules:
- At first, always detect intent. And also talk with the user and ONLY return JSON of the form: { "Message":"The llm response in friendly chatting way","intent": "rotation" | "disease" | "unknown" }
- If intent = "rotation": continue conversation to collect N, P, K, pH, country, state, city. If user can give the soil features then collect otherwise if user says he doesn't have information then for N, P, K, pH make these values as 0 and return json with location and these values as 0.
- When you have collected all required information (N, P, K, pH, country, state, city), return JSON with "status": "complete":
  { "status": "complete", "N": number, "P": number, "K": number, "pH": number, "country": string, "state": string, "city": string, "Message": "Got all information, processing...", Language: the language user used }
- If still collecting information, return:
  { "status": "collecting", "Message": "your response asking for missing info", "intent": "rotation" }
- If intent = "disease":
   - If no image uploaded yet, ask user to upload one (text only).
   - If image uploaded, validate if it looks like a crop → if valid, acknowledge with text, else politely ask for a clearer image.
- Do not mix intent JSON and rotation data JSON in the same message.
- Respond in the same language as the user.
                    `
                }]
            }
        });

        const result = await chat.sendMessage(message || "[image uploaded]");
        const modelResponse = result.response.text();
        session.history.push({ role: "model", parts: [{ text: modelResponse }] });

        console.log("Model Response:", modelResponse);

        let parsedData = null;

        try {
            parsedData = JSON.parse(modelResponse);
        } catch {
            const jsonMatch = modelResponse.match(/```json\s*({[\s\S]*?})\s*```/) ||
                modelResponse.match(/({[\s\S]*?})/);
            if (jsonMatch) {
                try {
                    parsedData = JSON.parse(jsonMatch[1]);
                } catch (err) {
                    console.error("JSON parse error:", err);
                }
            }
        }

        console.log("Parsed Data:", parsedData);

        if (!parsedData) {
            return res.json({
                success: true,
                status: "incomplete",
                message: modelResponse
            });
        }

        if (parsedData.intent === 'disease') {
            if (image) {
                try {
                    const imageUrl = await uploadImage(image.buffer);
                    return res.json({
                        success: true,
                        status: "disease_prediction",
                        message: "Image received. Please wait while I analyze the disease.",
                        imageUrl
                    });
                } catch (err) {
                    console.error("Error uploading image:", err);
                    return res.status(500).json({ success: false, message: "Image upload failed." });
                }
            } else {
                return res.json({
                    success: true,
                    status: "incomplete",
                    message: parsedData.Message || "Please upload an image of the plant."
                });
            }
        }

        if (parsedData.intent === "rotation" || parsedData.status === "complete") {

            console.log(parsedData.Language);

            if (parsedData.status === "complete" &&
                parsedData.hasOwnProperty('N') &&
                parsedData.hasOwnProperty('P') &&
                parsedData.hasOwnProperty('K') &&
                parsedData.hasOwnProperty('pH') &&
                parsedData.country &&
                parsedData.state &&
                parsedData.city &&
                parsedData.Language) {

                console.log("Complete rotation data received, calling predict function");

                delete conversations[sessionId];

                try {
                    const predictRes = await predict(
                        parsedData.N || 0,
                        parsedData.P || 0,
                        parsedData.K || 0,
                        parsedData.pH || 0,
                        parsedData.country,
                        parsedData.state,
                        parsedData.city,
                    );

                    return res.json({
                        success: true,
                        status: "complete",
                        predictRes
                    });
                } catch (predictError) {
                    console.error("Error in predict function:", predictError);
                    return res.status(500).json({
                        success: false,
                        message: "Error processing crop rotation prediction."
                    });
                }
            } else {
                return res.json({
                    success: true,
                    status: "incomplete",
                    message: parsedData.Message || "Please provide the missing information for crop rotation planning."
                });
            }
        }

        return res.json({
            success: true,
            status: "incomplete",
            message: parsedData.Message || modelResponse
        });

    } catch (error) {
        console.error("Error in chat:", error);
        delete conversations[sessionId];
        return res.status(500).json({ success: false, message: "Sorry, I couldn't process your request. Please try again later." });
    }
});




module.exports = router;


// nitrogen shayad 40 phosphorus shayad 20 pottasium shayad 30 ph shayad 5.5 and hum india jharkhand dhanbad m rahete h
// yaar mere pass ye saab details nhi h to kya iske bina aap kr sakte h help
// ey tm mera crop rotation m help kr sakte ho
// hum jharkhand dhanbad m rahete h
// humko janna h ki mere fasal me kya bimari hai

// mai dhanbad seher m raheta hu mai jharkhand rajya me raheta hu aur mai india desh me raheta hu aur mujhe kuch nhi pata bass tum mujhe fasal chakra de do

// mujhe koi jankari nhi h