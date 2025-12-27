
import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile, ChatMessage } from "../types.ts";

// Initialize the Gemini API client directly with the API key from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const analyzeJobFit = async (resumeText: string, jobDescription: string): Promise<JobAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: `
        You are an expert career coach and recruiter. 
        Analyze the following Resume against the Job Description.
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Provide a fit score from 0 to 100, a brief analysis summary, and a list of specific improvements for the resume.
      `,
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

export const calculateSuccessProbability = async (resumeSummary: string, jobDescription: string): Promise<{ probability: number; explanation: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Estimate the probability (0-100) of a candidate getting an interview for this job.
        
        Candidate Summary: "${resumeSummary}"
        Job Description: "${jobDescription}"
        
        Return JSON with:
        - probability (integer 0-100)
        - explanation (string, max 20 words)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            probability: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["probability", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Success Probability Error", error);
    return { probability: 70, explanation: "Could not calculate due to API error." };
  }
};

export const analyzeResumeATS = async (resumeText: string): Promise<{ score: number; feedback: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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

export const scanAndOptimizeResume = async (resumeText: string): Promise<{
  originalScore: number;
  optimizedScore: number;
  optimizedText: string;
  improvements: string[];
}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        You are an expert Resume Optimizer. Your task is to rewrite the given resume to be 100% ATS-friendly and impactful.
        
        INPUT RESUME:
        "${resumeText.substring(0, 8000)}"
        
        INSTRUCTIONS:
        1. Evaluate the original ATS score (0-100).
        2. Rewrite the resume content to optimize for ATS (improve keywords, use action verbs, quantify results).
        3. The optimized score should be 100.
        4. List the key improvements made.
        
        Return JSON structure:
        {
          "originalScore": integer,
          "optimizedScore": integer,
          "optimizedText": string (the full rewritten resume text),
          "improvements": array of strings
        }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalScore: { type: Type.INTEGER },
            optimizedScore: { type: Type.INTEGER },
            optimizedText: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["originalScore", "optimizedScore", "optimizedText", "improvements"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Resume Optimization Error", error);
    throw error;
  }
};

export const generateCoverLetter = async (job: Job, profile: UserProfile): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Write a professional, engaging cover letter for the following candidate and job.
        
        CANDIDATE:
        Name: ${profile.name}
        Current Title: ${profile.title}
        Skills: ${profile.skills.join(", ")}
        Summary: ${profile.summary}
        
        JOB:
        Role: ${job.title}
        Company: ${job.company}
        Description: ${job.description || "Not provided"}
        
        REQUIREMENTS:
        - Professional but modern tone.
        - Highlight how the candidate's skills match the job.
        - Keep it under 300 words.
      `
    });

    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    console.error("Cover Letter Gen Error", error);
    throw error;
  }
};

export const chatWithCareerAgent = async (
  history: ChatMessage[],
  newMessage: string,
  context: { jobs: Job[]; profile: UserProfile }
): Promise<string> => {
  const profileContext = `
    USER PROFILE:
    Name: ${context.profile.name}
    Title: ${context.profile.title}
    Skills: ${context.profile.skills.join(", ")}
    Summary: ${context.profile.summary}
  `;

  const jobsContext = `
    TRACKED JOBS:
    ${context.jobs.map(j => 
      `- ${j.title} at ${j.company} (Status: ${j.status}).`
    ).join("\n")}
  `;

  const systemInstruction = `
    You are RekrutIn AI, a dedicated Career Strategy Agent.
    
    YOUR KNOWLEDGE BASE:
    ${profileContext}
    ${jobsContext}

    YOUR GOAL:
    Help the user land a job. tailored to their profile and tracked applications.
    
    GUIDELINES:
    - Be encouraging, strategic, and concise.
    - Reference specific jobs from their list when relevant.
    - Keep responses under 150 words unless asked for a detailed guide.
  `;

  try {
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Chat Agent Error", error);
    return "Sorry, I encountered an error communicating with the AI service.";
  }
};

export const parseResumeFile = async (file: File): Promise<UserProfile> => {
  try {
    const filePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
          parts: [
              filePart, 
              { text: "Extract profile metadata from this resume. Return JSON with: name (string), title (latest job title), email (string), summary (brief bio), skills (top 5 skills array). Do not include full resume text." }
          ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            email: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "title", "email", "summary", "skills"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    const data = JSON.parse(text);
    
    return {
      ...data,
      plan: 'Free',
      atsScansUsed: 0,
      extensionUses: 0,
      resumeText: '' 
    };
  } catch (error) {
    console.error("Resume File Parse Error", error);
    throw error;
  }
};
