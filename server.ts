import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Dynamic initialization helper for Gemini to prevent startup crashes if key is missing
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the developer secrets.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Endpoint: Generate professional property descriptions using Gemini 3.5 Flash
  app.post("/api/generate-description", async (req, res) => {
    try {
      const { propertyType, location, bhk, price, amenities, tone } = req.body;

      if (!propertyType || !location) {
        return res.status(400).json({ error: "Property type and location are required." });
      }

      const ai = getGenAI();
      const toneStr = tone || "sophisticated and high-end";
      const amenitiesStr = Array.isArray(amenities) && amenities.length > 0 
        ? amenities.join(", ") 
        : "Excellent ventilation, premium security, modern design, 24/7 water and power backup";

      const prompt = `Write a highly compelling, professional real estate marketing description for a property in Chennai, India.
Use the following details:
- Property Type: ${propertyType}
- Location: ${location}, Chennai
- Configuration: ${bhk ? `${bhk} BHK` : "Spacious layout"}
- Price Range/Value: ${price || "Contact Agent for Price"}
- Amenities/Features: ${amenitiesStr}
- Desired Tone: ${toneStr}

Format:
1. An eye-catching, punchy headline (e.g. "Luxurious Coastal Living: Elegant 3 BHK Apartment in Adyar")
2. Two highly engaging paragraphs emphasizing why this property is the perfect choice, the excellent connectivity of ${location} (e.g., IT corridor convenience of OMR, coastal elegance of ECR, retail/educational excellence of Anna Nagar, upscale vibe of Adyar, or central convenience of T. Nagar), and the exceptional quality of life.

Make sure the output text is clean, free of brackets or markdown hashtags/stars, and looks highly professional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ description: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error.message);
      res.status(500).json({ 
        error: error.message || "An error occurred while generating description with Gemini AI." 
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Serve Vite in development, or Static Files in Production
  if (!isProduction) {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
  process.exit(1);
});
