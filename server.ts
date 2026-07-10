import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// ==========================================
// AI TRANSFORMATIONS API ENDPOINT
// ==========================================
app.post("/api/ai/edit", async (req, res) => {
  const { prompt, blocks } = req.body;

  if (!prompt || !blocks) {
    return res.status(400).json({ error: "Missing prompt or blocks data." });
  }

  // Handle case when API Key is missing gracefully
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined. Simulating visual edit locally.");
    // Simulate aesthetic changes locally if no key is present to guarantee a fully working prototype
    const isLuxury = prompt.toLowerCase().includes("luxur") || prompt.toLowerCase().includes("gold");
    const isCosmic = prompt.toLowerCase().includes("cosmic") || prompt.toLowerCase().includes("dark") || prompt.toLowerCase().includes("purple");
    const isMinimal = prompt.toLowerCase().includes("minim");

    const simulated = blocks.map((b: any) => {
      const styles = { ...b.styles };
      if (isLuxury) {
        styles.fontFamily = "Playfair Display";
        styles.backgroundColor = "#09090b";
        styles.textColor = "#f5f5f5";
        styles.subtitleColor = "#a3a3a3";
        styles.accentColor = "#d4af37";
        styles.badgeBgColor = "#1a1a1a";
        styles.badgeTextColor = "#d4af37";
        styles.buttonBgColor = "#d4af37";
        styles.buttonTextColor = "#09090b";
      } else if (isCosmic) {
        styles.fontFamily = "Space Grotesk";
        styles.backgroundColor = "#030712";
        styles.textColor = "#f9fafb";
        styles.subtitleColor = "#9ca3af";
        styles.accentColor = "#a855f7";
        styles.badgeBgColor = "#1e1b4b";
        styles.badgeTextColor = "#c084fc";
        styles.buttonBgColor = "#a855f7";
        styles.buttonTextColor = "#ffffff";
        styles.useGradient = true;
        styles.backgroundGradient = "linear-gradient(135deg, #090514 0%, #030712 100%)";
      } else if (isMinimal) {
        styles.fontFamily = "Inter";
        styles.backgroundColor = "#ffffff";
        styles.textColor = "#0f172a";
        styles.subtitleColor = "#475569";
        styles.accentColor = "#2563eb";
        styles.badgeBgColor = "#f1f5f9";
        styles.badgeTextColor = "#2563eb";
        styles.buttonBgColor = "#0f172a";
        styles.buttonTextColor = "#ffffff";
        styles.useGradient = false;
      }
      return { ...b, styles };
    });
    return res.json({ blocks: simulated, message: "Applied local preset transformations." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are an expert design agent for the OnlyPage builder. 
Transform the styles block properties of the following JSON array of sections to fit the user's design aesthetic.
User request: "${prompt}"

Current blocks configuration:
${JSON.stringify(blocks, null, 2)}

Only modify the styling-related properties (backgroundColor, textColors, fonts, gradients, border radius, gaps, lineHeights) to fit the style. Keep structural content like ids and text values unless requested otherwise.
Return the complete array of updated blocks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  badge: { type: Type.STRING },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  btnText: { type: Type.STRING },
                  variant: { type: Type.STRING },
                  styles: {
                    type: Type.OBJECT,
                    properties: {
                      paddingTop: { type: Type.INTEGER },
                      paddingBottom: { type: Type.INTEGER },
                      paddingLeft: { type: Type.INTEGER },
                      paddingRight: { type: Type.INTEGER },
                      gapSize: { type: Type.INTEGER },
                      maxWidth: { type: Type.INTEGER },
                      textAlign: { type: Type.STRING },
                      backgroundColor: { type: Type.STRING },
                      backgroundGradient: { type: Type.STRING },
                      useGradient: { type: Type.BOOLEAN },
                      textColor: { type: Type.STRING },
                      subtitleColor: { type: Type.STRING },
                      accentColor: { type: Type.STRING },
                      badgeBgColor: { type: Type.STRING },
                      badgeTextColor: { type: Type.STRING },
                      fontFamily: { type: Type.STRING },
                      titleSize: { type: Type.INTEGER },
                      titleWeight: { type: Type.STRING },
                      subtitleSize: { type: Type.INTEGER },
                      bodySize: { type: Type.INTEGER },
                      lineHeight: { type: Type.NUMBER },
                      cardBgColor: { type: Type.STRING },
                      cardTextColor: { type: Type.STRING },
                      cardBorderRadius: { type: Type.INTEGER },
                      cardShadow: { type: Type.STRING },
                      cardBorderWidth: { type: Type.INTEGER },
                      cardBorderColor: { type: Type.STRING },
                      borderRadius: { type: Type.INTEGER },
                      borderWidth: { type: Type.INTEGER },
                      borderColor: { type: Type.STRING },
                      borderStyle: { type: Type.STRING },
                      boxShadow: { type: Type.STRING },
                      buttonBgColor: { type: Type.STRING },
                      buttonTextColor: { type: Type.STRING },
                      buttonBorderRadius: { type: Type.INTEGER },
                      buttonHoverScale: { type: Type.BOOLEAN },
                    }
                  }
                }
              }
            }
          },
          required: ["blocks"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return res.json({ blocks: parsed.blocks, message: "Aesthetic styling updated by OnlyPage AI!" });
    }
    return res.status(500).json({ error: "Invalid blocks structure returned from AI model." });
  } catch (err: any) {
    console.error("Gemini API call failed:", err);
    return res.status(500).json({ error: err.message || "Failed to compile styling changes." });
  }
});

// ==========================================
// VITE DEV MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
