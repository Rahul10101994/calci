import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const solveMathWithGemini = async (query: string): Promise<string> => {
  try {
    // Using flash for speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are an expert mathematical assistant. 
        Your goal is to solve math problems provided by the user.
        
        Rules:
        1. If the input is a direct math expression (e.g., "5 + 5"), return ONLY the numeric result or the simplified expression.
        2. If the input is a word problem (e.g., "Volume of a sphere with radius 5"), provide the formula used, the step-by-step substitution, and the final result.
        3. Keep explanations concise.
        4. Use Markdown for formatting (e.g., bold for the final answer).
        5. If the request is not math-related, politely decline.`,
        temperature: 0.1, // Low temperature for deterministic math results
      }
    });

    return response.text || "Could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to AI service. Please check your API key.";
  }
};
