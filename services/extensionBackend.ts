
import { UserProfile, Job, ExtensionJobPayload, ExtensionApiResponse, JobStatus } from '../types';
import { MAX_FREE_JOBS } from '../constants';
import { analyzeJobFit } from './geminiService';

/**
 * EXTENSION BACKEND SIMULATOR
 * This file simulates the server-side logic that handles requests from the Chrome Extension.
 * In a real Next.js app, these would be API Routes (e.g., /pages/api/extension/track-job.ts).
 */

// Simulate Database Lookup
const getUserFromToken = (token: string, users: UserProfile[]): UserProfile | null => {
  // For demo, we just check if the token exists in the current session profile
  // In real DB, we'd query `profiles` table where `extension_token` = token
  return users.find(u => u.extensionToken === token) || null;
};

// GET /api/extension/plan-status
export const checkPlanStatus = async (userProfile: UserProfile, currentJobCount: number): Promise<{
  plan: string;
  remaining_quota: number;
  can_auto_capture: boolean;
}> => {
  const isPro = userProfile.plan === 'Pro' || userProfile.plan === 'Career+' || userProfile.plan === 'Elite';
  
  return {
    plan: userProfile.plan,
    remaining_quota: isPro ? 999999 : Math.max(0, MAX_FREE_JOBS - currentJobCount),
    can_auto_capture: isPro // Only Pro users get auto-capture API access
  };
};

// POST /api/extension/track-job
export const trackJobFromExtension = async (
  payload: ExtensionJobPayload, 
  userProfile: UserProfile, 
  currentJobs: Job[]
): Promise<ExtensionApiResponse> => {
  
  // 1. Auth Check
  if (payload.token !== userProfile.extensionToken) {
    return { success: false, message: 'Invalid API Token. Please re-authenticate extension.' };
  }

  // 2. Subscription Check
  const isPro = userProfile.plan !== 'Free';
  const jobCount = currentJobs.length;

  if (!isPro && jobCount >= MAX_FREE_JOBS) {
    return { 
      success: false, 
      message: 'Free limit reached (10 jobs). Upgrade to Pro for unlimited tracking.',
      is_pro: false
    };
  }

  // 3. Create Job Object
  const newJob: Job = {
    id: `ext-${Date.now()}`,
    title: payload.job_title,
    company: payload.company_name,
    location: payload.location,
    url: payload.url,
    description: payload.description,
    status: JobStatus.APPLIED, // Auto-captured jobs default to Applied
    created_at: new Date().toISOString(),
    timeline: [{ status: JobStatus.APPLIED, date: new Date().toISOString() }],
    ai_analysis: null
  };

  // 4. Pro Feature: Auto AI Analysis
  if (isPro) {
    try {
        // Mock resume text since we don't have it in the extension payload usually
        // In real app, we fetch the user's default resume from DB
        const mockResumeContext = userProfile.summary || "Candidate Resume"; 
        const analysis = await analyzeJobFit(mockResumeContext, payload.description);
        newJob.ai_analysis = analysis;
    } catch (e) {
        console.warn("Auto-analysis failed", e);
    }
  }

  return {
    success: true,
    message: 'Job tracked successfully!',
    job: newJob,
    is_pro: isPro,
    quota_remaining: isPro ? 999 : Math.max(0, MAX_FREE_JOBS - (jobCount + 1))
  };
};
