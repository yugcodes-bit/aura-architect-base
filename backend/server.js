// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- SETUP ---
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- GEMINI API ENDPOINT ---
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        const metaPrompt = `
            You are an expert interior designer AI for an application called Aura Architect.
            Your task is to take a user's prompt and convert it into a structured JSON object.
            The JSON object must follow this structure: { "items": [ { "name": "model_category_name", "qualifiers": ["adjective1", "adjective2"], "placement": "A short placement instruction from the list below" } ] }
            - "name" must be a simple category from this list: chair, sofa, table, lamp, rug, plant, room_base, tv, painting, ceiling_fan, door, window.
            - "qualifiers" is a list of descriptive words.
            - "placement" MUST be one of the following simple strings: "center", "back-wall", "left-wall", "right-wall", "front-wall", "back-left-corner", "back-right-corner". If the user asks for a relative position like "in front of the sofa", choose the most logical position from the list.
            User Prompt: "${prompt}"
            Generate the JSON object.
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result = await model.generateContent(metaPrompt);
        const response = await result.response;
        let text = response.text();

        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}') + 1;
        const jsonString = text.substring(startIndex, endIndex);
        
        console.log("Cleaned AI Response:", jsonString);
        res.json(JSON.parse(jsonString));

    } catch (error) {
        console.error("Error generating or parsing content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

// --- MESHY API ENDPOINT ---
app.post('/api/generate-new-model', async (req, res) => {
    console.log("Received request to generate new model...");
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const meshyApiUrl = 'https://api.meshy.ai/v2/text-to-3d';
        const headers = {
            'Authorization': `Bearer ${process.env.MESHY_API_KEY}`,
            'Content-Type': 'application/json'
        };
        const body = {
            object_prompt: prompt,
            style: "realistic"
        };
        const response = await axios.post(meshyApiUrl, body, { headers });
        const taskId = response.data.result;
        console.log("Successfully started generation task with ID:", taskId);
        res.json({ taskId: taskId });
    } catch (error) {
        console.error("Error with Meshy API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to start model generation" });
    }
});


// --- START SERVER ---
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`AI server running on http://localhost:${PORT}`);
});