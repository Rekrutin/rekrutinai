
import { JobStatus, Job, PricingPlan, EmployerJob, CandidateApplication, ExternalJobMatch } from './types';

// Helper to safely get environment variables without crashing in browser
export const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch (error) {
    // Ignore error if process is not available
  }
  return '';
};

export const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

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
    applicants_count: 5,
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
    applicants_count: 12,
    status: 'Active', 
    created_at: new Date(Date.now() - 604800000).toISOString(),
    description: 'Looking for a talented junior designer.'
  },
  {
    id: '103',
    title: 'Frontend Developer',
    location: 'Remote',
    type: 'Full-time',
    salary_range: 'Rp 12.000.000 - Rp 18.000.000',
    applicants_count: 3,
    status: 'Active',
    created_at: new Date(Date.now() - 120000000).toISOString(),
    description: 'Join our engineering team. Must know React, TypeScript and Tailwind.'
  }
];

export const INITIAL_APPLICATIONS: CandidateApplication[] = [
  // Applicants for Job 101 (Marketing)
  {
    id: 'c1',
    jobId: '101',
    candidateName: 'Sarah Wijaya',
    candidateEmail: 'sarah@example.com',
    candidateTitle: 'Digital Marketer',
    appliedDate: new Date().toISOString(),
    status: 'New',
    aiFitScore: 92,
    aiSummary: 'Excellent match. 5 years exp in Growth, managed >$50k monthly ad spend.',
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy']
  },
  {
    id: 'c2',
    jobId: '101',
    candidateName: 'Budi Santoso',
    candidateEmail: 'budi@example.com',
    candidateTitle: 'Marketing Specialist',
    appliedDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'Reviewed',
    aiFitScore: 75,
    aiSummary: 'Good generalist, but lacks specific SaaS growth experience required.',
    skills: ['Social Media', 'Copywriting', 'Event Management']
  },
  {
    id: 'c3',
    jobId: '101',
    candidateName: 'Indra Lesmana',
    candidateEmail: 'indra@example.com',
    candidateTitle: 'Sales Associate',
    appliedDate: new Date(Date.now() - 172800000).toISOString(),
    status: 'Rejected',
    aiFitScore: 45,
    aiSummary: 'Profile focuses on direct sales rather than digital growth marketing.',
    skills: ['Cold Calling', 'CRM', 'Negotiation']
  },
  
  // Applicants for Job 102 (Designer)
  {
    id: 'c4',
    jobId: '102',
    candidateName: 'Maya Putri',
    candidateEmail: 'maya@example.com',
    candidateTitle: 'Visual Communication Student',
    appliedDate: new Date().toISOString(),
    status: 'Interview',
    aiFitScore: 88,
    aiSummary: 'Strong portfolio, great eye for typography. Internship experience matches.',
    skills: ['Figma', 'Adobe CC', 'Prototyping']
  },
  {
    id: 'c5',
    jobId: '102',
    candidateName: 'Rizky Ramadhan',
    candidateEmail: 'rizky@example.com',
    candidateTitle: 'Graphic Designer',
    appliedDate: new Date(Date.now() - 200000000).toISOString(),
    status: 'New',
    aiFitScore: 65,
    aiSummary: 'Good graphic skills, but portfolio lacks UI/Web projects.',
    skills: ['Photoshop', 'Illustrator', 'Branding']
  }
];

export const INITIAL_EXTERNAL_MATCHES: ExternalJobMatch[] = [
  {
    id: 'ext1',
    title: 'Senior React Developer',
    company: 'Tokopedia',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 25.000.000 - Rp 40.000.000',
    source: 'LinkedIn',
    externalUrl: 'https://linkedin.com',
    postedAt: new Date().toISOString(),
    description: 'Looking for a Senior React Dev with 5+ years experience...',
    aiFitScore: 94
  },
  {
    id: 'ext2',
    title: 'Product Manager - Fintech',
    company: 'Gojek',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 30.000.000+',
    source: 'Glints',
    externalUrl: 'https://glints.com',
    postedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    description: 'Join our fintech team to revolutionize payments...',
    aiFitScore: 88
  },
  {
    id: 'ext3',
    title: 'Frontend Engineer (Remote)',
    company: 'Traveloka',
    location: 'Remote',
    type: 'Contract',
    salary_range: 'Competitive',
    source: 'JobStreet',
    externalUrl: 'https://jobstreet.co.id',
    postedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    description: 'Frontend engineer needed for travel tech platform...',
    aiFitScore: 82
  },
  {
    id: 'ext4',
    title: 'Junior Web Developer',
    company: 'StartUp Indo',
    location: 'Bandung',
    type: 'Full-time',
    salary_range: 'Rp 8.000.000',
    source: 'Glints',
    externalUrl: 'https://glints.com',
    postedAt: new Date().toISOString(),
    description: 'Great opportunity for fresh graduates...',
    aiFitScore: 78
  },
  {
    id: 'ext5',
    title: 'Lead UI/UX Designer',
    company: 'Bukalapak',
    location: 'Jakarta',
    type: 'Full-time',
    salary_range: 'Rp 35.000.000',
    source: 'LinkedIn',
    externalUrl: 'https://linkedin.com',
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    description: 'Lead our design system team...',
    aiFitScore: 91
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

export const TRENDING_SEARCHES = [
  "Remote Frontend Developer",
  "Product Manager Jakarta",
  "Data Analyst Entry Level",
  "UX Designer Singapore",
  "Marketing Intern"
];
