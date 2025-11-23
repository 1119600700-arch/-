import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IpData, AiReport } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIpReport = async (ipData: IpData): Promise<AiReport> => {
  const ai = getAiClient();
  
  const prompt = `
    Analyze the following IP address data and provide a concise report.
    
    IP Data:
    ${JSON.stringify(ipData, null, 2)}
    
    Please provide:
    1. A summary of the location and ISP (is it residential, hosting, cellular?).
    2. A brief security assessment (is this ASN typically associated with bots/proxies? standard residential?).
    3. A short, interesting geographical or tech-related fact about the specific city or region.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Analysis of ISP type and location context" },
      securityRisk: { type: Type.STRING, description: "Assessment of network reputation" },
      funFact: { type: Type.STRING, description: "Interesting fact about the location" },
    },
    required: ["summary", "securityRisk", "funFact"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a cybersecurity expert and network analyst.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const askAiQuestion = async (question: string, contextData: IpData): Promise<string> => {
    const ai = getAiClient();
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: User is asking about IP ${contextData.ip} located in ${contextData.city}, ${contextData.country}. ISP: ${contextData.connection.isp}. \n\nQuestion: ${question}`,
            config: {
                systemInstruction: "You are a helpful network assistant. Keep answers concise and relevant to the IP context.",
            }
        });
        
        return response.text || "I couldn't generate a response.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I encountered an error answering that.";
    }
}
