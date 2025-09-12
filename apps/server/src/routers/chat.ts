import express, { type Express, type Response, type Request, type Router } from "express";
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const chat = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface ConversationState {
    data: Record<string, any>;
    history: Array<{ role: string; parts: Array<{ text: string }> }>;
}

const conversations: { [key: number]: ConversationState } = {};

const getConversationState = (sessionId: number) => {
    if (!conversations[sessionId]) {
        conversations[sessionId] = {
            data: {},
            history: []
        };
    }
    return conversations[sessionId];
};

chat.post('/chat', async (req: Request, res: Response): Promise<Response> => {
    const { sessionId, message }: { sessionId: number; message: string } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ success: false, message: "Session ID and message are required." });
    }

    const session = getConversationState(sessionId);
    session.history.push({ role: "user", parts: [{ text: message }] });

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chat = model.startChat({
            history: session.history,
            generationConfig: { temperature: 0.8 },
            systemInstruction: {
                parts: [
                    {
                        text: "{You are a friendly agricultural assistant. Your goal is to collect specific information from the user for a crop rotation plan. You need the following details: Soil Nitrogen (N), Soil Phosphorus (P), Soil Potassium (K), Soil pH, Country, State, and City. You can interact with the user in any language they use. As you collect each piece of information, respond to the user to keep the conversation going, but also provide a JSON object at the end of your response containing all the collected data so far. The JSON keys must be 'N', 'P', 'K', 'pH', 'country', 'state', and 'city'. If a value is unknown, use 'null'. When you have all seven pieces of information, your final response must be the JSON object ONLY, with no additional text. For example, if you have all the information, your response should be something like this: \n\n```json\n{\n  \"N\": 50,\n  \"P\": 30,\n  \"K\": 150,\n  \"pH\": 6.5,\n  \"country\": \"India\",\n  \"state\": \"Odisha\",\n  \"city\": \"Bhubaneswar\"\n}\n```\n\nUntil then, you will respond to the user in their language and append the current JSON object to your message.}"
                    }

                ]
            }
        });


        const result = await chat.sendMessage(message);
        const modelResponse: string = result.response.text();
        console.log(modelResponse);
        session.history.push({ role: "model", parts: [{ text: modelResponse }] });

        const jsonMatch = modelResponse.match(/```json\n([\s\S]*?)\n```/);

        if (jsonMatch) {
            const jsonString: string = jsonMatch[1];
            const collectedData: Record<string, any> = JSON.parse(jsonString);

            const isComplete: boolean = Object.values(collectedData).every(val => val !== null);

            if (isComplete) {
                delete conversations[sessionId];
                return res.json({
                    success: true,
                    status: "complete",
                    data: collectedData
                });
            } else {
                session.data = collectedData;
                const conversationalMessage: string = modelResponse.replace(jsonMatch[0], '').trim();
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

    } catch (error: any) {
        console.error("Error in AI chat:", error);
        delete conversations[sessionId];
        return res.status(500).json({ success: false, message: "Sorry, I couldn't process your request. Please try again later." });
    }
});

module.exports = chat;
