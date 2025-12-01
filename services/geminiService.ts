
import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile, ChatMessage } from "../types";
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

export const calculateSuccessProbability = async (resumeSummary: string, jobDescription: string): Promise<{ probability: number; explanation: string }> => {
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          probability: Math.floor(Math.random() * (95 - 60) + 60),
          explanation: "Simulated: Your experience aligns well with the core requirements."
        });
      }, 1000);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

export const generateCoverLetter = async (job: Job, profile: UserProfile): Promise<string> => {
  if (!ai) {
    return `Dear Hiring Manager at ${job.company},\n\nI am writing to express my interest in the ${job.title} position. (Simulated AI Cover Letter - API Key Missing)`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
        - Use placeholders like [Phone Number] if contact info is missing.
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
  if (!ai) {
    return "I am a simulated AI agent (API Key missing). I see you have " + context.jobs.length + " jobs tracked. I can help you analyze them once connected.";
  }

  // 1. Construct the System Context
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
      `- ${j.title} at ${j.company} (Status: ${j.status}). Desc: ${j.description ? 'Available' : 'Missing'}`
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
    - If they ask about a specific company, check if it's in their list first.
    - Suggest specific improvements based on their skills vs job requirements.
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
      model: "gemini-2.5-flash",
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

export const parseResumeFromFilename = async (filename: string): Promise<UserProfile> => {
  if (!ai) {
    // Fallback if no API key
    return new Promise((resolve) => {
      setTimeout(() => {
        const namePart = filename.split('.')[0].replace(/[_-]/g, ' ');
        resolve({
          name: namePart.split(' ').slice(0, 2).join(' ') || 'Guest User',
          title: 'Software Engineer', // default
          email: 'guest@example.com',
          summary: 'Simulated profile based on file upload.',
          skills: ['React', 'TypeScript', 'Node.js'],
          plan: 'Free',
          atsScansUsed: 0
        });
      }, 1500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are a smart resume parser AI. 
        A user uploaded a resume file named: "${filename}".
        
        Your task is to infer a realistic candidate profile based strictly on the clues in the filename.
        
        Instructions:
        1. Name: Extract potential name from filename (e.g., "alex_smith_cv" -> "Alex Smith"). If generic, generate a realistic professional name.
        2. Job Title: Extract role from filename (e.g., "frontend_dev" -> "Frontend Developer"). If generic, assume a "Software Engineer" or similar tech role.
        3. Skills: Infer 5-7 hard skills that match the Job Title.
        4. Summary: Write a professional 2-sentence summary matching the Title and Skills.
        5. Email: Generate a realistic email based on the Name (e.g., alex.smith@example.com).

        Return JSON with keys: name, title, email, summary, skills (array of strings).
      `,
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
    if (!text) throw new Error("No response");
    
    const data = JSON.parse(text);
    
    return {
      ...data,
      plan: 'Free',
      atsScansUsed: 0
    };
  } catch (error) {
    console.error("Resume Filename Parse Error", error);
    // Return safe fallback
    return {
        name: 'Guest User',
        title: 'Candidate',
        email: 'user@example.com',
        summary: 'Could not analyze file. Please update your profile manually.',
        skills: ['Update Skills'],
        plan: 'Free',
        atsScansUsed: 0
    };
  }
};
