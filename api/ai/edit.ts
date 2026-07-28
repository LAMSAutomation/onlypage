import { ai, Type } from "../_lib/gemini";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, blocks } = req.body;

  if (!prompt || !blocks) {
    return res.status(400).json({ error: "Missing prompt or blocks data." });
  }

  if (!process.env.GEMINI_API_KEY) {
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
      model: "gemini-3.6-flash",
      contents: `You are an expert design and copywriter agent for the OnlyPage builder. 
Transform the styles and/or content properties of the following JSON array of sections to fit the user's request.
User request: "${prompt}"

Current blocks configuration:
${JSON.stringify(blocks, null, 2)}

If the user request is about design or styling, modify the styling-related properties (backgroundColor, textColor, fontFamily, gradients, colors, padding, alignment).
If the user request asks to change copy, rewrite headings, shorten/extend description, or adjust the tone (e.g. professional, casual, playful, persuasive), modify the copy properties (badge, title, subtitle, btnText, and list item text fields) accordingly.
Always keep structural properties like block ids and block types intact. Return the complete array of updated blocks.`,
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
                  mapAddress: { type: Type.STRING },
                  contactEmail: { type: Type.STRING },
                  contactPhone: { type: Type.STRING },
                  contactAddress: { type: Type.STRING },
                  copyright: { type: Type.STRING },
                  features: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        desc: { type: Type.STRING },
                        icon: { type: Type.STRING },
                      },
                    },
                  },
                  pricing: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        tier: { type: Type.STRING },
                        price: { type: Type.STRING },
                        features: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        btnText: { type: Type.STRING },
                        popular: { type: Type.BOOLEAN },
                      },
                    },
                  },
                  testimonials: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        content: { type: Type.STRING },
                        avatar: { type: Type.STRING },
                        rating: { type: Type.INTEGER },
                      },
                    },
                  },
                  faqs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        q: { type: Type.STRING },
                        a: { type: Type.STRING },
                      },
                    },
                  },
                  stats: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        val: { type: Type.INTEGER },
                        suffix: { type: Type.STRING },
                      },
                    },
                  },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        step: { type: Type.STRING },
                        title: { type: Type.STRING },
                        desc: { type: Type.STRING },
                      },
                    },
                  },
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
                    },
                  },
                },
              },
            },
          },
          required: ["blocks"],
        },
      },
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
}
