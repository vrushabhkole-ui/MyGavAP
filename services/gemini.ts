import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "MyGaav AI Sahayak", a helpful assistant for village residents in India. 
You support English, Hindi, and Marathi. 

Users will specify their language preference at the start of their message (e.g., "[Please respond in Marathi]"). 
Always strictly follow this language request.

Your goal is to:
1. Explain complex government schemes (like PM-Kisan, Gramin Awas Yojana, Ayushman Bharat).
2. Provide guidance on administrative procedures (certificates, land registration).
3. Offer rural living advice.

Always respond in a professional, polite, and simplified manner. 
If the user asks about local issues, tell them to check the respective section in the MyGaav app (Gram Panchayat, Chavdi, etc.).
Keep answers concise and structured. Use bullet points for readability.
`;

export async function getChatResponse(message: string, history: { role: 'user' | 'model', text: string }[]) {
  // Fix: Initializing GoogleGenAI client with correct named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    // Fix: Using correct ai.models.generateContent method and upgraded model for complex reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Fix: Accessing .text property directly from the response
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to the network. Please try again later.";
  }
}