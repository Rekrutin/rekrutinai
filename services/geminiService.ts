
import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile } from "../types";
import { getEnv } from "../constants";

// Initialize the API client strictly according to guidelines.
// If process.env.API_KEY is missing in a dev env, we handle the null client gracefully in the function.
const apiKey = getEnv('API_KEY');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeJobFit = async (resumeText: string, jobDescription: string): Promise<JobAnalysis> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock analysis.");
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

export const analyzeResumeATS = async (resumeText: string): Promise<{ score: number; feedback: string[] }> => {
  if (!ai) {
    return { score: 65, feedback: ["Simulated: Use standard headings", "Simulated: Quantify achievements"] };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze this resume text for ATS (Applicant Tracking System) friendliness and overall quality.
        Resume Text: "${resumeText.substring(0, 5000)}"
        
        Return JSON with:
        - score (0-100 integer)
        - feedback (array of strings, specific advice to improve ATS parsing and impact)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "feedback"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("ATS Analysis Error", error);
    throw error;
  }
};

export const chatWithCareerAgent = async (
  message: string, 
  context: { jobs: Job[]; profile: UserProfile }
): Promise<string> => {
  if (!ai) {
    return "I am a simulated AI agent. Please configure your API Key to get real personalized advice based on your " + context.jobs.length + " applications.";
  }

  // Construct context string
  const jobsContext = context.jobs.map(j => 
    `- Role: ${j.title} at ${j.company} (Status: ${j.status}). Description snippet: ${j.description?.substring(0, 100)}...`
  ).join("\n");

  const profileContext = `
    User Name: ${context.profile.name}
    Title: ${context.profile.title}
    Skills: ${context.profile.skills.join(", ")}
    Summary: ${context.profile.summary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are a helpful, encouraging, and strategic AI Career Agent for RekrutIn.ai.
        
        USER PROFILE:
        ${profileContext}
        
        USER'S JOB APPLICATIONS:
        ${jobsContext}
        
        USER QUESTION:
        "${message}"
        
        Answer the user's question based on their specific profile and job list. 
        If they ask for matches, compare their skills to the job descriptions provided.
        Keep the tone professional yet conversational.
      `
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Chat Agent Error", error);
    return "Sorry, I encountered an error processing your request.";
  }
};
