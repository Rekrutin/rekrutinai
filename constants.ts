import { JobStatus, Job, PricingPlan } from './types';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Inc.',
    location: 'Remote, ID',
    status: JobStatus.INTERVIEW,
    created_at: new Date().toISOString(),
    description: 'We are looking for a React expert with Tailwind experience...',
    ai_analysis: {
      fitScore: 85,
      analysis: 'Strong match for technical skills, but lacks specific mention of GraphQL.',
      improvements: ['Highlight GraphQL projects', 'Emphasize leadership experience']
    }
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'Jakarta, ID',
    status: JobStatus.APPLIED,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    description: 'Looking for a UI/UX designer proficient in Figma.',
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'Glints',
    location: 'Singapore',
    status: JobStatus.SAVED,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    description: 'Python and Django developer needed.',
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    features: ['Track job applications', 'View analytics', 'Basic dashboard'],
    cta: 'Start Free'
  },
  {
    name: 'Pro',
    price: '$9',
    features: ['All Free features', 'AI Fit Scoring', 'CV improvement tips'],
    cta: 'Go Pro',
    highlight: true
  },
  {
    name: 'Career+',
    price: '$19',
    features: ['All Pro features', 'Custom tracking', 'Success probability'],
    cta: 'Join Career+'
  }
];

export const FEATURES = [
  {
    title: 'Dashboard Insights',
    description: 'Visualize your job-hunting progress and get data-driven feedback on your CV performance.',
    icon: 'BarChart'
  },
  {
    title: 'AI Fit Analyzer',
    description: 'Instantly compare your resume with any job listing and get an AI-generated fit score & tips.',
    icon: 'Bot'
  },
  {
    title: 'Smart Tracking',
    description: 'Never lose track again — know where you applied, when, and what your next move should be.',
    icon: 'Calendar'
  }
];