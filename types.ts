
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

export interface JobContact {
  id: string;
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
}

export interface JobNote {
  id: string;
  content: string;
  updatedAt: string;
}

export interface JobTimelineEvent {
  status: JobStatus;
  date: string;
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
  followUpDate?: string; // New field for reminder
  // CRM Features (Huntr Style)
  contacts?: JobContact[];
  notes?: string; // Simplified for demo
  timeline?: JobTimelineEvent[];
}

export interface EmployerJob {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  salary_range: string;
  applicants_count: number;
  status: 'Active' | 'Closed' | 'Draft';
  created_at: string;
  description: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidateTitle: string;
  appliedDate: string;
  status: 'New' | 'Reviewed' | 'Interview' | 'Rejected';
  aiFitScore: number;
  aiSummary: string;
  skills: string[];
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  summary: string;
  skills: string[];
  resumeText?: string;
  plan: PlanType;
  atsScansUsed: number;
  companyName?: string; // Added for Employer
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

export interface JobAlert {
  id: string;
  keywords: string;
  location: string;
  frequency: 'Instant' | 'Daily' | 'Weekly';
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
  type: 'alert' | 'system';
}

export type PlanType = 'Free' | 'Pro' | 'Career+' | 'Elite';
export type UserRole = 'seeker' | 'employer' | 'admin';
export type DashboardTab = 'tracker' | 'resumes' | 'profile' | 'agent' | 'alerts' | 'billing';
export type EmployerTab = 'overview' | 'jobs' | 'candidates';
export type AdminTab = 'overview' | 'users' | 'employers' | 'jobs' | 'activity';
export type OnboardingStep = 'idle' | 'upload' | 'scanning' | 'review' | 'credentials' | 'complete';
export type Language = 'en' | 'id';

export interface PricingPlan {
  name: PlanType | string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  description?: string;
}

export type JobPlatform = 'RekrutIn' | 'LinkedIn' | 'Glints' | 'JobStreet';

export interface ExternalJobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  source: JobPlatform;
  externalUrl?: string;
  postedAt: string;
  description: string;
  aiFitScore: number;
}
