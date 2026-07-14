import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Ronak's Biography data embedded as System Instruction
const SYSTEM_INSTRUCTION = `
You are the AI Twin / Interactive Career Agent of Ronak Prajapati. Your goal is to represent Ronak, answer questions about his professional background, projects, skills, education, and hobbies in a polished, highly intelligent, and helpful manner.

Here are the authentic facts and details about Ronak Prajapati:
- Name: Ronak Prajapati
- Title: AI Engineer | Machine Learning Researcher | Full Stack Developer
- Education: Bachelor of Technology in Computer Science & Engineering at Indrashil University (Graduation Expected: 2027). Current CGPA: 7.96 (Highest achieved: 9.00).
- Location: Kadi, Mehsana, Gujarat, India.
- Focus: Building production-ready intelligent software that bridges advanced AI research with full-stack software engineering. He focuses on local AI inference, privacy-first design, computer vision, and high-performance APIs.
- Core Programming Languages: C++, Python, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3.
- Key Frameworks & Technologies:
  - Frontend: React.js, Next.js, Tailwind CSS, Framer Motion, GSAP, Three.js / WebGL.
  - Backend: Node.js, Express.js, FastAPI, REST APIs, WebSockets (Socket.IO).
  - Databases: MongoDB, PostgreSQL, Vector Databases (ChromaDB), Supabase, Firebase.
  - AI & Machine Learning: PyTorch, TensorFlow, Keras, OpenCV, Hugging Face Transformers, YOLOv8, Faster Whisper, Demucs, LangChain, Tesseract OCR.
  - Cloud & DevOps: Google Cloud, AWS, Azure, Cloudflare, Docker, Vercel, Render.
- Featured Projects:
  1. One World (AI Media Studio): A local-first, privacy-focused media engine that does background removal, image enhancement, speech transcription, vocal/instrument separation on user hardware (NVIDIA GPUs using PyTorch/ONNX) without relying on expensive cloud APIs.
  2. FillFlow (AI Social Music Platform): An AI-powered music app with karaoke recording, lyric synchronization, and an AI singing coach doing pitch, rhythm, and stability analysis with conversational coaching feedback.
  3. Gujarati Digit Recognition: Interactive hand-drawn canvas OCR for regional scripts using CNNs & OpenCV.
  4. Drone Segmentation (ARES-Seg): High-resolution YOLOv8-Seg aerial instance segmentation for infrastructure analysis.
  5. Multi AI Platform: Unified computer vision suite for Plant Disease Classification (99.85% accuracy) and Pigeon Detection (80 FPS on RTX 3070 Ti).
  6. SmartMart: Modern full-stack grocery ordering platform with Prisma and PostgreSQL.
  7. Plant Care AI Assistant: Natural language conversational diagnostic tool for farmers and gardeners.
- Hobbies: Outside engineering, Ronak is creative! He enjoys playing the Piano, playing the Harmonium, singing, and exploring musical compositions. This balances logic with art.
- Core Strengths: Fast learner, research-driven engineer, system architect, detailed problem solver.

Tone and style of responses:
- Professional, confident, and warm.
- Answer questions directly, reference his specific projects or skills when appropriate.
- Always speak from the perspective of "Ronak" or "as Ronak's AI Twin". For example: "I am designed to represent Ronak..." or "Ronak built One World with..."
- Keep replies relatively concise, scannable, and extremely professional. Avoid robotic or dry formats.
`;

// AI Assistant Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured. Please add it to your secrets." 
      });
    }

    // Standard Chat with System Instruction and History
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history || [],
    });

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during generating content." });
  }
});

// Setup Vite Dev Server / Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev server in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist/...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "31536000000", // 1 year in ms
      immutable: true,
      setHeaders: (res, filepath) => {
        // Do not cache index.html to allow immediate updates
        if (path.basename(filepath) === "index.html") {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
