import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Persistent Profile Photo Storage on Server
let storedProfilePhoto: string | null = null;
const PHOTO_FILE_PATH = path.join(process.cwd(), "public", "uploaded_profile_photo.txt");

try {
  if (fs.existsSync(PHOTO_FILE_PATH)) {
    storedProfilePhoto = fs.readFileSync(PHOTO_FILE_PATH, "utf-8");
  }
} catch (e) {
  console.log("No saved profile photo file on server startup.");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "25mb" }));

  // Profile Photo Storage API
  app.post("/api/profile-photo", (req, res) => {
    try {
      const { photoUrl } = req.body;
      if (!photoUrl) {
        return res.status(400).json({ error: "photoUrl is required" });
      }
      storedProfilePhoto = photoUrl;
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(PHOTO_FILE_PATH, photoUrl, "utf-8");
      return res.json({ success: true, message: "Profile photo updated and saved to server." });
    } catch (err: any) {
      console.error("Error saving profile photo:", err);
      return res.status(500).json({ error: err.message || "Failed to save photo" });
    }
  });

  app.get("/api/profile-photo", (req, res) => {
    if (storedProfilePhoto && storedProfilePhoto.trim().length > 0) {
      if (storedProfilePhoto.startsWith("data:image")) {
        const matches = storedProfilePhoto.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const imageType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          res.setHeader("Content-Type", `image/${imageType}`);
          res.setHeader("Cache-Control", "no-cache");
          return res.send(buffer);
        }
      }
      return res.redirect(storedProfilePhoto);
    }
    // High quality photorealistic portrait default fallback (no SVG vector/drawing)
    return res.redirect("https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=800&q=80");
  });

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

  // API Endpoint: Generate professional property descriptions using Gemini 3.5 Flash with USP highlights
  app.post("/api/generate-description", async (req, res) => {
    try {
      const { propertyType, location, bhk, price, amenities, usps, tone } = req.body;

      if (!propertyType || !location) {
        return res.status(400).json({ error: "Property type and location are required." });
      }

      const ai = getGenAI();
      const toneStr = tone || "sophisticated and high-end";
      const amenitiesStr = Array.isArray(amenities) && amenities.length > 0 
        ? amenities.join(", ") 
        : "Excellent ventilation, premium security, modern design, 24/7 water and power backup";

      const uspsList = Array.isArray(usps) && usps.length > 0 
        ? usps.join(", ") 
        : "near metro, sea view, gated community";

      const prompt = `Write a highly compelling, professional real estate marketing description for a property in Chennai, India.

Key Specifications:
- Property Type: ${propertyType}
- Location: ${location}, Chennai
- Configuration: ${bhk ? `${bhk} BHK` : "Spacious layout"}
- Price Range/Value: ${price || "Contact Agent for Price"}
- Key USPs (Unique Selling Points to explicitly highlight): ${uspsList}
- Amenities/Features: ${amenitiesStr}
- Desired Tone: ${toneStr}

Guidelines:
1. Create a punchy, eye-catching headline.
2. Write a captivating, high-converting property description (approx 100-150 words) that strongly highlights and weaves in the USP points (e.g. 'near metro', 'sea view', or 'gated community').
3. Explain why living here in ${location} provides an unbeatable lifestyle and smart investment.

Ensure the output is clean plain text, without raw markdown hashtags (#) or brackets.`;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

      res.json({ 
        description: response.text,
        usps: Array.isArray(usps) && usps.length > 0 ? usps : ["Near Metro", "Sea View", "Gated Community"]
      });
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
