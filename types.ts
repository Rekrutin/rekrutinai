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

export interface UserProfile {
  resumeText: string;
}

export type PlanType = 'Free' | 'Pro' | 'Career+';

export interface PricingPlan {
  name: PlanType;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}