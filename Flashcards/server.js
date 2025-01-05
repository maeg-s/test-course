const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

const OPENROUTER_API_KEY = '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';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const notes = req.body.notes;
    

    const systemPrompt = `
    You are an AI flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
    1. Create clear and concise questions for the front of the flashcard.
    2. Provide accurate and informative answers for the back of the flashcard, ensuring they do not exceed one or two sentences.
    3. Ensure that each flashcard focuses on a single concept or piece of information.
    4. Use simple language to make the flashcards accessible to a wide range of learners.
    5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
    6. Avoid overly complex or ambiguous phrasing in both questions and answers.
    7. When appropriate, use mnemonics or memory aids to help reinforce the information.
    8. Tailor the difficulty level of the flashcards to the user's specified preferences.
    9. If given a body of text, extract the most important and relevant information for the flashcards.
    10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
    11. Only generate 10 flashcards.

    Return in the following JSON format:
    {
        "flashcards": [{
            "front": str,
            "back": str
        }]
    }
    `;

    try {
        console.log('Received notes:', notes);
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: notes }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            }
        });

        console.log('Received response from OpenRouter:', response.data);

        const rawJson = response.data.choices[0].message.content;
        const startIndex = rawJson.indexOf('{');
        const endIndex = rawJson.lastIndexOf('}') + 1;
        const jsonString = rawJson.substring(startIndex, endIndex);
        const flashcardsData = JSON.parse(jsonString);

        res.json({ flashcards: flashcardsData.flashcards });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            console.error('Request data:', error.request);
            res.status(500).send('No response received from API');
        } else {
            console.error('Unexpected error:', error.message);
            res.status(500).send('Unexpected error occurred');
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
