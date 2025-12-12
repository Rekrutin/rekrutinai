import { GoogleGenAI, Type } from "@google/genai";
import { JobAnalysis, Job, UserProfile, ChatMessage } from "../types";
import { getEnv } from "../constants";

// Initialize the API client strictly according to guidelines.
// Robustly check for API Key in various environment configurations
const getApiKey = () => {
  // 1. Direct check for Vite/Next.js env vars (bypassing potential getEnv lag)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    const viteKey = import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    if (viteKey) return viteKey;
  }
  // 2. Standard check
  return getEnv('API_KEY') || getEnv('GEMINI_API_KEY') || getEnv('GOOGLE_API_KEY');
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

if (!apiKey) {
  console.warn("Gemini API Key not found. App running in Mock Mode.");
}

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
          fitScore: 78,
          analysis: "Mock Analysis: Your profile has strong potential but lacks some specific keywords found in the job description.",
          improvements: ["Add 'Strategic Planning' to skills", "Quantify your leadership experience", "Mention specific tools listed in JD"]
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
          probability: Math.floor(Math.random() * (90 - 65) + 65),
          explanation: "Simulated: Your experience aligns with the core requirements, but competition is high."
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
    return { score: 68, feedback: ["Use standard section headings", "Avoid tables for better parsing", "Quantify achievements with metrics"] };
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
    return `Dear Hiring Manager at ${job.company},\n\nI am excited to apply for the ${job.title} position. With my background in ${profile.title}, I am confident in my ability to contribute effectively to your team.\n\n(Note: This is a simulated cover letter. Add a valid API Key for AI generation.)`;
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
    return "I am a simulated AI agent (API Key missing). I see you have " + context.jobs.length + " jobs tracked. Once you connect a valid API Key, I can help you analyze them in depth.";
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
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
        
        let name = "Job Applicant";
        let title = "Candidate";
        
        // 1. Improved Heuristic for Title Detection in Filename
        const commonRoles = ['Account Specialist', 'Software Engineer', 'Product Manager', 'Designer', 'Marketing', 'Sales', 'HR', 'Data Analyst', 'Developer', 'Consultant', 'Admin', 'Coordinator', 'Executive', 'Manager', 'Assistant'];
        
        const foundRole = commonRoles.find(role => cleanName.toLowerCase().includes(role.toLowerCase()));
        if (foundRole) {
            title = foundRole;
        }

        // 2. Improved Name Detection
        const parts = cleanName.split(' ').filter(p => {
            const lower = p.toLowerCase();
            return !['resume', 'cv', 'profile', 'pdf', 'docx', 'document', ...commonRoles.map(r => r.toLowerCase())].includes(lower);
        });

        if (parts.length >= 2) {
            name = parts.slice(0, 2).join(' '); // Assume first 2 remaining words are name
        } else if (parts.length === 1) {
            name = parts[0];
        }

        const mockResumeBody = `
${name.toUpperCase()}
${title} | Jakarta, Indonesia | applicant@example.com

PROFESSIONAL SUMMARY
Results-driven ${title} with 5+ years of experience in high-paced environments. Proven track record of success in project management and team leadership. Looking for new opportunities to leverage skills in a challenging role.

EXPERIENCE
Senior ${title} | Tech Company A | 2020 - Present
• Led a team of 10+ professionals to achieve Q4 targets.
• Increased efficiency by 20% through workflow optimization.
• Collaborated with cross-functional teams to deliver projects on time.

${title} | Company B | 2018 - 2020
• Managed daily operations and reporting.
• Implemented new CRM system for better data tracking.

EDUCATION
Bachelor of Science | University of Indonesia | 2014 - 2018

SKILLS
Communication • Leadership • Strategic Planning • Data Analysis
        `.trim();

        resolve({
          name: name,
          title: title, 
          email: 'applicant@example.com',
          summary: `Experienced ${title} looking for new opportunities.`,
          skills: ['Communication', 'Teamwork', 'Problem Solving', 'Adaptability'],
          plan: 'Free',
          atsScansUsed: 0,
          resumeText: mockResumeBody
        });
      }, 1500);
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
                { text: "Analyze this resume document. Extract the candidate's profile. Return valid JSON with keys: name (Full Name), title (The candidate's MOST RECENT job title found in the Experience section), email, summary (professional summary), skills (array of strings), and resumeText (The FULL extracted text content of the resume, nicely formatted with Markdown headers and bullet points. Preserve the original content structure as much as possible). Do not hallucinate." }
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
    
    return {
      ...data,
      plan: 'Free',
      atsScansUsed: 0
    };
  } catch (error) {
    console.error("Resume File Parse Error", error);
    // Return safe fallback
    return {
        name: 'Applicant',
        title: 'Candidate',
        email: '',
        summary: 'Could not analyze file. Please update your profile manually.',
        skills: [],
        plan: 'Free',
        atsScansUsed: 0,
        resumeText: 'Error parsing resume text. Please copy/paste your resume content here.'
    };
  }
};