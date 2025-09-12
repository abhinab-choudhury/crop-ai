const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

const { uploadImage, removeImage } = require('../helpers/cloudinary');
const multer = require('multer');

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
    const userMessage = { role: "user", parts: [{ text: message }] };


    const isDiseasePredictionRequest = image && message.toLowerCase().includes('disease');
    const imageUrl = await uploadImage(image.buffer);

    if (isDiseasePredictionRequest) {

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const imagePart = {

                inlineData: {

                    data: image.buffer.toString('base64'),
                    mimeType: image.mimetype
                }
            };

            const chatParts = [
                { text: `The user wants to identify a crop disease. The image is of a plant.` },
                imagePart,
                { text: `Analyze the image. If it's a valid photo of a plant then tell true for isValidImage give message as i got the image please wait while i found the disease. If the photo is not of a plant or is unclear, politely ask the user for a clearer photo of the plant. Return a JSON object with the following structure: { "isValidImage": boolean , "message": text }` }
            ];

            const result = await model.generateContent(chatParts);
            const modelResponse = result.response.text();

            const jsonMatch = modelResponse.match(/```json\n([\s\S]*?)\n```/);
            // console.log(jsonMatch);
            // console.log(jsonMatch.isValidImage);


            if (jsonMatch) {
                const diseaseData = JSON.parse(jsonMatch[1]);

                console.log(diseaseData.isValidImage);

                if (diseaseData.isValidImage) {
                    diseaseData.imageUrl = imageUrl;
                    return res.json({
                        success: true,
                        status: "disease_prediction",
                        data: diseaseData
                    });
                } else {

                    return res.json({
                        success: true,
                        status: "disease_prediction",
                        message: "Sorry, I couldn't identify the disease. Please ensure the photo is of a crop."
                    });
                }
            } else {
                return res.json({
                    success: true,
                    status: "disease_prediction",
                    message: "Sorry, I couldn't identify the disease. Please ensure the photo is of a crop."
                });
            }

        } catch (error) {
            console.error("Error in disease prediction:", error);
            return res.status(500).json({ success: false, message: "An error occurred during disease prediction." });
        }

    } else {

        session.history.push(userMessage);

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const chat = model.startChat({
                history: session.history,
                generationConfig: { temperature: 0.8 },
                systemInstruction: {
                    parts: [
                        {
                            text: `You are a friendly agricultural assistant. Your sole purpose is to collect seven pieces of information from the user for a crop rotation plan. The user can chat with you in any language, and you must respond in the same language. The required details are: Soil Nitrogen (N) in mg/kg, Soil Phosphorus (P) in mg/kg, Soil Potassium (K) in mg/kg, Soil pH, Country, State, and City.

As you collect each piece of information, you must do two things:
1.  **Respond to the user in their language** to keep the conversation going.
2.  **Append a JSON object to your response** containing all the data collected so far. Use the keys: 'N', 'P', 'K', 'pH', 'country', 'state', and 'city'. If a value is not yet collected, set it to 'null'.

When all seven pieces of information have been collected (or the user indicates they don't know a value), your **final and only response** must be the complete JSON object, with no conversational text.`
                        }
                    ]
                }
            });

            const result = await chat.sendMessage(message);
            const modelResponse = result.response.text();
            session.history.push({ role: "model", parts: [{ text: modelResponse }] });

            const jsonMatch = modelResponse.match(/```json\n([\s\S]*?)\n```/);

            if (jsonMatch) {
                const jsonString = jsonMatch[1];
                const collectedData = JSON.parse(jsonString);
                const isComplete = Object.values(collectedData).every(val => val !== null);

                if (isComplete) {
                    delete conversations[sessionId];
                    return res.json({
                        success: true,
                        status: "complete",
                        data: collectedData
                    });
                } else {
                    session.data = collectedData;
                    const conversationalMessage = modelResponse.replace(jsonMatch[0], '').trim();
                    return res.json({
                        success: true,
                        status: "incomplete",
                        message: conversationalMessage
                    });
                }
            } else {
                return res.json({
                    success: true,
                    status: "incomplete",
                    message: modelResponse
                });
            }

        } catch (error) {
            console.error("Error in AI chat:", error);
            delete conversations[sessionId];
            return res.status(500).json({ success: false, message: "Sorry, I couldn't process your request. Please try again later." });
        }
    }
});

module.exports = router;
