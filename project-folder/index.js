import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 🔥 Cohere v7+ client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// 🧠 Chat endpoint using Cohere's `chat` method (v7+)
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatResponse = await cohere.chat({
      model: "command-r-plus",
      message: userMessage,
      temperature: 0.7,
      stream: false,
    });

    const reply = chatResponse.text;
    res.json({ reply });
  } catch (error) {
    console.error("Cohere Error:", error);
    res.status(500).json({ reply: "Something went wrong with Cohere API." });
  }
});



// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
