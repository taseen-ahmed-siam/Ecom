import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize only if key is present to avoid errors on load if missing
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateShoppingAdvice = async (
  query: string,
  products: Product[]
): Promise<string> => {
  if (!ai) {
    return "I'm sorry, my brain (API Key) is missing! Please configure the API Key to chat with me.";
  }

  const productContext = products.map(p => 
    `- ${p.name} (ID: ${p.id}): $${p.price}. ${p.description} Category: ${p.category}`
  ).join('\n');

  const systemInstruction = `
    You are 'ShopGenie', a helpful AI assistant for Lumina Commerce. 
    Your goal is to help customers find the best products from our inventory based on their needs.
    
    Here is our current product inventory:
    ${productContext}
    
    Rules:
    1. Only recommend products from the list above.
    2. Be enthusiastic and concise.
    3. If the user asks for something we don't have, politely suggest a similar item from our inventory or say we don't carry it.
    4. Format your response with clear bullet points if recommending multiple items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "I couldn't find a good recommendation for that. Try asking differently!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};
