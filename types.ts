
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

export interface JobTimelineEvent {
  status: JobStatus;
  date: string;
}

export type AssessmentType = 'Online Game' | 'Coding Test' | 'Video Interview' | 'Personality Test' | 'Technical Assessment' | 'Other';
export type AssessmentStatus = 'Pending' | 'In Progress' | 'Completed' | 'Missed';

export interface JobAssessment {
  required: boolean;
  type: AssessmentType;
  deadline?: string;
  status: AssessmentStatus;
  platform?: string;
  link?: string;
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
  followUpDate?: string; 
  contacts?: JobContact[];
  notes?: string; 
  coverLetter?: string; 
  timeline?: JobTimelineEvent[];
  assessment?: JobAssessment;
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
  id?: string;
  name: string;
  title: string;
  email: string;
  summary: string;
  skills: string[];
  resumeText?: string;
  plan: PlanType;
  atsScansUsed: number;
  extensionUses: number;
  companyName?: string;
  extensionToken?: string;
}

export interface Resume {
  id: string;
  user_id?: string;
  title: string;
  name: string; // Legacy fallback
  file_path: string;
  extracted_text: string | null;
  ats_score: number;
  atsScore?: number; // Legacy UI support
  atsAnalysis?: string[];
  uploadDate: string;
  created_at?: string;
  updated_at?: string;
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

export type PlanType = 'Free' | 'Pro' | 'Accelerator' | 'Career+' | 'Elite'; 
export type UserRole = 'seeker' | 'employer' | 'admin';
export type DashboardTab = 'tracker' | 'resumes' | 'profile' | 'agent' | 'alerts' | 'billing' | 'extension';
export type EmployerTab = 'overview' | 'jobs' | 'candidates';
export type AdminView = 'overview' | 'revenue' | 'users' | 'resumes' | 'apps' | 'employers' | 'jobs' | 'logs' | 'settings';
export type Language = 'en' | 'id';

export interface PricingPlan {
  id: PlanType;
  name: string;
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

export interface ExtensionJobPayload {
  token: string;
  job_title: string;
  company_name: string;
  location: string;
  description: string;
  url: string;
  platform: string;
}

export interface ExtensionApiResponse {
  success: boolean;
  message: string;
  job?: Job;
  quota_remaining?: number;
  is_pro?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
  plan: PlanType;
  resumesCount: number;
  appsCount: number;
}

export interface Transaction {
  id: string;
  userEmail: string;
  plan: PlanType;
  amount: string;
  date: string;
  status: 'Success' | 'Failed';
  method: string;
}

export interface SystemLog {
  id: string;
  event: string;
  details: string;
  timestamp: string;
  severity: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  user?: string;
}

export interface AdminEmployer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  jobsPosted: number;
  status: 'active' | 'suspended';
  joinedDate: string;
}
