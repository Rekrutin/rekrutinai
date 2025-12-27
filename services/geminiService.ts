
import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile, ChatMessage } from "../types";
import { getEnv } from "../constants";

const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    const viteKey = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    if (viteKey) return viteKey;
  }
  return getEnv('API_KEY') || getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!apiKey) {
  console.warn("Gemini API Key not found. App running in Mock Mode.");
}

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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fitScore: 78,
          analysis: "Mock Analysis: Your profile has strong potential but lacks some specific keywords found in the job description.",
          improvements: ["Add 'Strategic Planning' to skills", "Quantify your leadership experience", "Mention specific tools listed in JD"]
        });
      }, 1500);
    });
  }

  try {
    const model = "gemini-3-pro-preview"; // Upgraded for high-quality analysis
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
          probability: Math.floor(Math.random() * (90 - 65) + 65),
          explanation: "Simulated: Your experience aligns with the core requirements, but competition is high."
        });
      }, 1000);
    });
  }

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
  if (!ai) {
    return { score: 68, feedback: ["Use standard section headings", "Avoid tables for better parsing", "Quantify achievements with metrics"] };
  }

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
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          originalScore: Math.floor(Math.random() * (75 - 50) + 50),
          optimizedScore: 100,
          optimizedText: `[OPTIMIZED VERSION - SIMULATED]\n\n${resumeText}\n\nSUMMARY\nResults-oriented professional with optimized keyword density for ATS compliance.\n\nKEY ACHIEVEMENTS\n• Increased operational efficiency by 30% through process improvements.\n• Led cross-functional teams to deliver projects 2 weeks ahead of schedule.\n\nSKILLS\n• Strategic Planning, Project Management, Data Analysis, Leadership`,
          improvements: [
            "Quantified achievements with specific metrics", 
            "Added industry-standard keywords for ATS visibility", 
            "Restructured bullet points for impact"
          ]
        });
      }, 2500);
    });
  }

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
  if (!ai) {
    return `Dear Hiring Manager at ${job.company},\n\nI am excited to apply for the ${job.title} position. With my background in ${profile.title}, I am confident in my ability to contribute effectively to your team.\n\n(Note: This is a simulated cover letter.)`;
  }

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
  if (!ai) {
    return "I am a simulated AI agent (API Key missing). I see you have " + context.jobs.length + " jobs tracked.";
  }

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
      model: "gemini-3-flash-preview", // Flash for fast interactive chat
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // Added extensionUses: 0 to fix UserProfile type incompatibility
        resolve({
          name: "Job Applicant",
          title: "Candidate", 
          email: 'applicant@example.com',
          summary: `Experienced candidate looking for new opportunities.`,
          skills: ['Communication', 'Problem Solving'],
          plan: 'Free',
          atsScansUsed: 0,
          extensionUses: 0,
          resumeText: 'Mock Resume Text'
        });
      }, 1500);
    });
  }

  try {
    const filePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        { 
            role: "user", 
            parts: [
                filePart, 
                { text: "Analyze this resume document. Extract the candidate's profile. Return valid JSON with keys: name (Full Name), title (The candidate's MOST RECENT job title), email, summary (professional summary), skills (array of strings), and resumeText (The FULL extracted text content of the resume in Markdown). Do not hallucinate." }
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
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            resumeText: { type: Type.STRING }
          },
          required: ["name", "title", "email", "summary", "skills", "resumeText"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const data = JSON.parse(text);
    
    // Added extensionUses: 0 to fix UserProfile type incompatibility
    return {
      ...data,
      plan: 'Free',
      atsScansUsed: 0,
      extensionUses: 0
    };
  } catch (error) {
    console.error("Resume File Parse Error", error);
    // Added extensionUses: 0 to fix UserProfile type incompatibility
    return {
        name: 'Applicant',
        title: 'Candidate',
        email: '',
        summary: 'Could not analyze file.',
        skills: [],
        plan: 'Free',
        atsScansUsed: 0,
        extensionUses: 0,
        resumeText: 'Error parsing resume text.'
    };
  }
};
