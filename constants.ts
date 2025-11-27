import { JobStatus, Job, PricingPlan, EmployerJob } from './types';

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

export const INITIAL_EMPLOYER_JOBS: EmployerJob[] = [
  {
    id: '101',
    title: 'Growth Marketing Manager',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 15.000.000 - Rp 25.000.000',
    applicants_count: 12,
    status: 'Active',
    created_at: new Date().toISOString(),
    description: 'We need a growth wizard to scale our user base.'
  },
  {
    id: '102',
    title: 'Junior UI Designer',
    location: 'Remote',
    type: 'Internship',
    salary_range: 'Rp 3.000.000 - Rp 5.000.000',
    applicants_count: 45,
    status: 'Closed',
    created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    description: 'Looking for a talented junior designer.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: 'Rp0',
    description: 'Perfect for getting started',
    features: [
      '10 job applications (limit)',
      'Basic job tracking',
      'Basic dashboard & reminders'
    ],
    cta: 'Start Free'
  },
  {
    name: 'Pro',
    price: 'Rp165.000',
    description: 'Main MRR Driver',
    features: [
      'Unlimited job tracking',
      'Chrome extension (auto-capture)',
      'AI Resume Fit Score',
      'AI Success Probability',
      'Personalized recommendations',
      'Progress analytics',
      'Early access to new features'
    ],
    cta: 'Go Pro',
    highlight: true
  },
  {
    name: 'Career+',
    price: 'Rp356.000',
    description: 'For serious growth',
    features: [
      'All Pro features',
      'Career learning modules',
      'CV & LinkedIn optimization course',
      'Pre-written templates',
      'Advanced job search strategies'
    ],
    cta: 'Join Career+'
  },
  {
    name: 'Elite',
    price: 'Rp455.000',
    description: 'Maximum impact',
    features: [
      'All Career+ features',
      '1x Interview Training (Live)',
      'Priority chat support',
      'Personalized CV & LinkedIn audit',
      'Advanced job search roadmap'
    ],
    cta: 'Get Elite'
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