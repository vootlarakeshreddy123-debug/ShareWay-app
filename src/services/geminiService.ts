import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MatchSuggestion {
  reason: string;
  matchScore: number;
  pickupWithinKm: number;
}

export async function getSmartSuggestions(route: string, nearbyRoutes: any[]): Promise<MatchSuggestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI for ShareWay, a carpooling and errand app. 
      Target Route: ${route}
      Nearby Routes: ${JSON.stringify(nearbyRoutes)}
      
      Suggest the best matches by comparing the direction and proximity. 
      Return an array of match analysis objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
               reason: { type: Type.STRING },
               matchScore: { type: Type.NUMBER },
               pickupWithinKm: { type: Type.NUMBER }
            },
            required: ['reason', 'matchScore', 'pickupWithinKm']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Suggester Error:", error);
    return [];
  }
}
