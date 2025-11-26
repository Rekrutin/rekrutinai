import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeJobFit = async (resumeText: string, jobDescription: string): Promise<JobAnalysis> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock analysis.");
    // Return mock data if no key is present to prevent app crash during demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fitScore: 75,
          analysis: "API Key missing. This is a simulated analysis. Your profile matches general requirements.",
          improvements: ["Add real API Key to .env", "Update CV with specific keywords"]
        });
      }, 1500);
    });
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert career coach and recruiter. 
      Analyze the following Resume against the Job Description.
      
      RESUME:
      ${resumeText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Provide a fit score from 0 to 100, a brief analysis summary, and a list of specific improvements for the resume.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: { type: Type.INTEGER },
            analysis: { type: Type.STRING },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["fitScore", "analysis", "improvements"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as JobAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};