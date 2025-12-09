
import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile, ChatMessage } from "../types";
import { getEnv } from "../constants";

// Initialize the API client strictly according to guidelines.
// Try multiple common names for the API Key to help with Vercel deployment issues
const apiKey = getEnv('API_KEY') || getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to convert File to Base64 for Gemini API
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

export const scanAndOptimizeResume = async (resumeText: string): Promise<{
  originalScore: number;
  optimizedScore: number;
  optimizedText: string;
  improvements: string[];
}> => {
  if (!ai) {
    // Better mock logic to ensure the feature feels complete in demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          originalScore: Math.floor(Math.random() * (75 - 50) + 50),
          optimizedScore: 100,
          optimizedText: `[OPTIMIZED VERSION - SIMULATED]\n\n${resumeText}\n\nSUMMARY\nHighly motivated professional with improved keyword density designed to pass ATS filters.\n\nKEY ACHIEVEMENTS\n• Boosted efficiency by 25% using Agile methodologies.\n• Led a cross-functional team of 5 to deliver critical projects on time.\n\nSKILLS\n• Leadership, Strategic Planning, Communication, Technical Analysis`,
          improvements: [
            "Quantified achievements with specific numbers", 
            "Added missing ATS keywords relevant to your industry", 
            "Improved formatting for better readability"
          ]
        });
      }, 2500);
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

export const parseResumeFile = async (file: File): Promise<UserProfile> => {
  if (!ai) {
    // Robust fallback to ensure the UI flow works even if API key is missing.
    // Try to be smart about extracting info from the filename to avoid "Software Engineer" default.
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
        
        // Simple heuristic: If filename looks like "John Doe Resume", use "John Doe"
        // If it looks like "Resume_Account_Specialist", maybe use "Account Specialist" as title?
        let name = "Candidate";
        let title = "Job Applicant";
        
        const parts = cleanName.split(' ');
        if (parts.length > 0) {
            // Assume first 2 words are name if they start with uppercase
            if (parts[0] && parts[0][0] === parts[0][0].toUpperCase()) {
                name = parts.slice(0, 2).join(' ');
            }
            
            // If there are words after "Resume" or "CV", use them as title
            const resumeIndex = parts.findIndex(p => p.toLowerCase().includes('resume') || p.toLowerCase().includes('cv'));
            if (resumeIndex !== -1 && resumeIndex < parts.length - 1) {
                title = parts.slice(resumeIndex + 1).join(' ');
            }
        }

        resolve({
          name: name !== "Candidate" ? name : cleanName,
          title: title, 
          email: 'applicant@example.com',
          summary: 'Experienced professional. (Mock data: Real AI analysis requires valid API Key)',
          skills: ['Communication', 'Teamwork', 'Problem Solving', 'Adaptability'],
          plan: 'Free',
          atsScansUsed: 0
        });
      }, 2000);
    });
  }

  try {
    const filePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { 
            role: "user", 
            parts: [
                filePart, 
                { text: "Analyze this resume document. Extract the candidate's profile. Return valid JSON with keys: name (Full Name), title (The candidate's MOST RECENT job title found in the Experience section), email, summary (professional summary), and skills (array of strings). Do not hallucinate. If the title is ambiguous, infer the most likely current role from their last job." }
            ] 
        }
      ],
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
    console.error("Resume File Parse Error", error);
    // Return safe fallback
    return {
        name: '',
        title: '',
        email: '',
        summary: 'Could not analyze file. Please update your profile manually.',
        skills: [],
        plan: 'Free',
        atsScansUsed: 0
    };
  }
};
