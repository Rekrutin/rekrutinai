export enum JobStatus {
  SAVED = 'Saved',
  APPLIED = 'Applied',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected'
}

export interface JobAnalysis {
  fitScore: number;
  analysis: string;
  improvements: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary_range?: string;
  url?: string;
  description?: string;
  status: JobStatus;
  created_at: string;
  ai_analysis?: JobAnalysis | null;
}

export interface EmployerJob {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary_range: string;
  applicants_count: number;
  status: 'Active' | 'Closed' | 'Draft';
  created_at: string;
  description: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  summary: string;
  skills: string[];
  resumeText?: string; // Legacy field, kept for compatibility but preferred in Resume interface
}

export interface Resume {
  id: string;
  name: string;
  content: string; // Text content for analysis
  uploadDate: string;
  atsScore?: number;
  atsAnalysis?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type PlanType = 'Free' | 'Pro' | 'Career+' | 'Elite';
export type UserRole = 'seeker' | 'employer';
export type DashboardTab = 'tracker' | 'resumes' | 'profile' | 'agent';

export interface PricingPlan {
  name: PlanType | string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  description?: string;
}