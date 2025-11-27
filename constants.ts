
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
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    description: 'Looking for a UI/UX designer proficient in Figma.',
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'Glints',
    location: 'Singapore',
    status: JobStatus.SAVED,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Python and Django developer needed.',
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'Tokopedia',
    location: 'Jakarta, ID',
    status: JobStatus.OFFER,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'MERN Stack developer with experience in high-traffic apps.',
    ai_analysis: {
      fitScore: 92,
      analysis: 'Perfect match. Your experience with Node.js scaling aligns perfectly.',
      improvements: []
    }
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Gojek',
    location: 'Jakarta, ID',
    status: JobStatus.REJECTED,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: 'Kubernetes and AWS expert needed.',
    ai_analysis: {
      fitScore: 60,
      analysis: 'Missing key certification requirements (AWS Pro).',
      improvements: ['Get AWS Certified', 'Add Terraform projects']
    }
  },
  {
    id: '6',
    title: 'Data Analyst',
    company: 'Traveloka',
    location: 'Tangerang, ID',
    status: JobStatus.APPLIED,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: 'SQL and Tableau expert.',
  },
  {
    id: '7',
    title: 'Product Manager',
    company: 'Bukalapak',
    location: 'Jakarta, ID',
    status: JobStatus.INTERVIEW,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    description: 'Lead the marketplace product team.',
    ai_analysis: {
      fitScore: 78,
      analysis: 'Good strategic fit, but experience is more B2B than B2C.',
      improvements: ['Highlight B2C side projects']
    }
  },
  {
    id: '8',
    title: 'UX Researcher',
    company: 'Jenius',
    location: 'Jakarta, ID',
    status: JobStatus.SAVED,
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    description: 'Conduct user interviews and usability testing.',
  },
  {
    id: '9',
    title: 'Mobile Developer (iOS)',
    company: 'Bank Jago',
    location: 'Jakarta, ID',
    status: JobStatus.APPLIED,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    description: 'Swift and SwiftUI developer.',
  },
  {
    id: '10',
    title: 'QA Engineer',
    company: 'Bibit',
    location: 'Remote',
    status: JobStatus.SAVED,
    created_at: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    description: 'Automation testing with Selenium.',
  },
  {
    id: '11',
    title: 'Marketing Specialist',
    company: 'Ruangguru',
    location: 'Jakarta, ID',
    status: JobStatus.REJECTED,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    description: 'Content marketing and SEO.',
  },
  {
    id: '12',
    title: 'Solutions Architect',
    company: 'AWS Indonesia',
    location: 'Jakarta, ID',
    status: JobStatus.INTERVIEW,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    description: 'Design cloud infrastructure.',
    ai_analysis: {
      fitScore: 88,
      analysis: 'Strong technical background, good soft skills match.',
      improvements: ['Prepare for system design interview']
    }
  },
  {
    id: '13',
    title: 'Machine Learning Engineer',
    company: 'Tiket.com',
    location: 'Jakarta, ID',
    status: JobStatus.APPLIED,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Build recommendation engines.',
  },
  {
    id: '14',
    title: 'Frontend Developer',
    company: 'Shopee',
    location: 'Singapore',
    status: JobStatus.OFFER,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    description: 'React and Vue experience required.',
    ai_analysis: {
      fitScore: 95,
      analysis: 'Exceptional match. Previous e-commerce experience is a big plus.',
      improvements: []
    }
  },
  {
    id: '15',
    title: 'Technical Writer',
    company: 'Xendit',
    location: 'Jakarta, ID',
    status: JobStatus.SAVED,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    description: 'Document API endpoints.',
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
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
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
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Join our engineering team. Must know React, TypeScript and Tailwind.'
  },
  {
    id: '104',
    title: 'Senior Backend Engineer',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 20.000.000 - Rp 35.000.000',
    applicants_count: 8,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: 'Golang and Microservices architecture experience needed.'
  },
  {
    id: '105',
    title: 'Product Manager',
    location: 'Singapore (Hybrid)',
    type: 'Full-time',
    salary_range: 'SGD 6,000 - SGD 9,000',
    applicants_count: 15,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Lead our fintech product vertical.'
  },
  {
    id: '106',
    title: 'Data Scientist',
    location: 'Remote',
    type: 'Contract',
    salary_range: 'Rp 25.000.000 / month',
    applicants_count: 4,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    description: 'Python, Pandas, and Scikit-learn expert.'
  },
  {
    id: '107',
    title: 'HR Generalist',
    location: 'Bali, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 8.000.000 - Rp 12.000.000',
    applicants_count: 20,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: 'Manage recruitment and employee relations.'
  },
  {
    id: '108',
    title: 'Social Media Intern',
    location: 'Jakarta, Indonesia',
    type: 'Internship',
    salary_range: 'Rp 2.500.000',
    applicants_count: 45,
    status: 'Closed',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    description: 'Manage our Instagram and TikTok.'
  },
  {
    id: '109',
    title: 'Sales Executive',
    location: 'Surabaya, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 5.000.000 + Commission',
    applicants_count: 10,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    description: 'B2B sales for SaaS product.'
  },
  {
    id: '110',
    title: 'DevOps Engineer',
    location: 'Remote',
    type: 'Full-time',
    salary_range: 'Rp 18.000.000 - Rp 28.000.000',
    applicants_count: 6,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    description: 'AWS, Docker, Kubernetes.'
  },
  {
    id: '111',
    title: 'Copywriter',
    location: 'Jakarta, Indonesia',
    type: 'Freelance',
    salary_range: 'Project based',
    applicants_count: 22,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Write compelling ad copy and landing pages.'
  },
  {
    id: '112',
    title: 'QA Automation Engineer',
    location: 'Yogyakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 10.000.000 - Rp 16.000.000',
    applicants_count: 5,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    description: 'Selenium and Cypress experience.'
  },
  {
    id: '113',
    title: 'Finance Manager',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 20.000.000 - Rp 30.000.000',
    applicants_count: 9,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    description: 'Oversee financial planning and analysis.'
  },
  {
    id: '114',
    title: 'Customer Success Manager',
    location: 'Remote',
    type: 'Full-time',
    salary_range: 'Rp 10.000.000 - Rp 15.000.000',
    applicants_count: 18,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Ensure client satisfaction and retention.'
  },
  {
    id: '115',
    title: 'Video Editor',
    location: 'Jakarta, Indonesia',
    type: 'Part-time',
    salary_range: 'Rp 5.000.000 - Rp 8.000.000',
    applicants_count: 14,
    status: 'Draft',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    description: 'Edit promotional videos for YouTube.'
  }
];

export const INITIAL_APPLICATIONS: CandidateApplication[] = [
  // Job 101 (Marketing)
  {
    id: 'c1', jobId: '101', candidateName: 'Sarah Wijaya', candidateEmail: 'sarah@example.com', candidateTitle: 'Digital Marketer',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 92,
    aiSummary: 'Excellent match. 5 years exp in Growth, managed >$50k monthly ad spend.', skills: ['SEO', 'Google Ads', 'Analytics']
  },
  {
    id: 'c2', jobId: '101', candidateName: 'Budi Santoso', candidateEmail: 'budi@example.com', candidateTitle: 'Marketing Specialist',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Reviewed', aiFitScore: 75,
    aiSummary: 'Good generalist, but lacks specific SaaS growth experience.', skills: ['Social Media', 'Copywriting']
  },
  {
    id: 'c3', jobId: '101', candidateName: 'Indra Lesmana', candidateEmail: 'indra@example.com', candidateTitle: 'Sales Associate',
    appliedDate: new Date(Date.now() - 172800000).toISOString(), status: 'Rejected', aiFitScore: 45,
    aiSummary: 'Profile focuses on direct sales rather than digital growth.', skills: ['Sales', 'CRM']
  },
  
  // Job 102 (Designer)
  {
    id: 'c4', jobId: '102', candidateName: 'Maya Putri', candidateEmail: 'maya@example.com', candidateTitle: 'Visual Design Student',
    appliedDate: new Date().toISOString(), status: 'Interview', aiFitScore: 88,
    aiSummary: 'Strong portfolio, great eye for typography. Internship match.', skills: ['Figma', 'Adobe CC']
  },
  {
    id: 'c5', jobId: '102', candidateName: 'Rizky Ramadhan', candidateEmail: 'rizky@example.com', candidateTitle: 'Graphic Designer',
    appliedDate: new Date(Date.now() - 200000000).toISOString(), status: 'New', aiFitScore: 65,
    aiSummary: 'Good graphic skills, but portfolio lacks UI/Web projects.', skills: ['Photoshop', 'Illustrator']
  },

  // Job 103 (Frontend)
  {
    id: 'c6', jobId: '103', candidateName: 'Andi Pratama', candidateEmail: 'andi@example.com', candidateTitle: 'Frontend Dev',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 95,
    aiSummary: 'Perfect stack match (React, TS, Tailwind).', skills: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: 'c7', jobId: '103', candidateName: 'Siti Aminah', candidateEmail: 'siti@example.com', candidateTitle: 'Web Developer',
    appliedDate: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'Reviewed', aiFitScore: 82,
    aiSummary: 'Solid experience, but mostly Vue instead of React.', skills: ['Vue.js', 'JavaScript', 'CSS']
  },

  // Job 104 (Backend)
  {
    id: 'c8', jobId: '104', candidateName: 'David Chen', candidateEmail: 'david@example.com', candidateTitle: 'Backend Engineer',
    appliedDate: new Date().toISOString(), status: 'Interview', aiFitScore: 89,
    aiSummary: 'Extensive Golang experience. Previous fintech background.', skills: ['Golang', 'PostgreSQL', 'Docker']
  },
  {
    id: 'c9', jobId: '104', candidateName: 'Eko Yulianto', candidateEmail: 'eko@example.com', candidateTitle: 'PHP Developer',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Rejected', aiFitScore: 50,
    aiSummary: 'Stack mismatch. Mostly PHP/Laravel, job requires Go.', skills: ['PHP', 'Laravel', 'MySQL']
  },

  // Job 105 (Product Manager)
  {
    id: 'c10', jobId: '105', candidateName: 'Jessica Tan', candidateEmail: 'jessica@example.com', candidateTitle: 'Associate PM',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 85,
    aiSummary: 'Great potential, handled roadmap for B2C app.', skills: ['Jira', 'Agile', 'Product Strategy']
  },
  {
    id: 'c11', jobId: '105', candidateName: 'Michael Wong', candidateEmail: 'michael@example.com', candidateTitle: 'Senior PM',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Interview', aiFitScore: 91,
    aiSummary: 'Overqualified but excellent. 8 years experience.', skills: ['Leadership', 'Strategy', 'Fintech']
  },

  // Job 106 (Data Scientist)
  {
    id: 'c12', jobId: '106', candidateName: 'Rina Kusuma', candidateEmail: 'rina@example.com', candidateTitle: 'Data Analyst',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 78,
    aiSummary: 'Strong SQL, learning Python. Good junior candidate.', skills: ['SQL', 'Tableau', 'Python']
  },

  // Job 107 (HR)
  {
    id: 'c13', jobId: '107', candidateName: 'Putri Indah', candidateEmail: 'putri@example.com', candidateTitle: 'HR Admin',
    appliedDate: new Date().toISOString(), status: 'Reviewed', aiFitScore: 80,
    aiSummary: 'Good administrative skills, organized.', skills: ['Admin', 'Recruitment', 'Payroll']
  },
  {
    id: 'c14', jobId: '107', candidateName: 'Dewi Lestari', candidateEmail: 'dewi@example.com', candidateTitle: 'Recruiter',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Interview', aiFitScore: 88,
    aiSummary: 'Strong recruitment background in tech.', skills: ['Tech Recruiting', 'LinkedIn']
  },

  // Job 108 (Social Media - Closed)
  {
    id: 'c15', jobId: '108', candidateName: 'Gen Z User', candidateEmail: 'genz@example.com', candidateTitle: 'Student',
    appliedDate: new Date(Date.now() - 86400000 * 30).toISOString(), status: 'Rejected', aiFitScore: 90,
    aiSummary: 'Great content creator, viral potential.', skills: ['TikTok', 'CapCut']
  },

  // Job 109 (Sales)
  {
    id: 'c16', jobId: '109', candidateName: 'Agus Setiawan', candidateEmail: 'agus@example.com', candidateTitle: 'Sales Rep',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 83,
    aiSummary: 'Proven track record in B2B sales.', skills: ['Sales', 'Negotiation', 'B2B']
  },
  {
    id: 'c17', jobId: '109', candidateName: 'Bambang Pamungkas', candidateEmail: 'bambang@example.com', candidateTitle: 'Account Manager',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Reviewed', aiFitScore: 79,
    aiSummary: 'Good relationship builder.', skills: ['CRM', 'Communication']
  },

  // Job 110 (DevOps)
  {
    id: 'c18', jobId: '110', candidateName: 'Fajar Nugraha', candidateEmail: 'fajar@example.com', candidateTitle: 'SysAdmin',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 86,
    aiSummary: 'Strong Linux skills, transitioning to DevOps.', skills: ['Linux', 'Bash', 'Docker']
  },
  {
    id: 'c19', jobId: '110', candidateName: 'Kevin Lim', candidateEmail: 'kevin@example.com', candidateTitle: 'Cloud Engineer',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Interview', aiFitScore: 94,
    aiSummary: 'Certified AWS Architect. Deep Kubernetes knowledge.', skills: ['AWS', 'K8s', 'Terraform']
  },

  // Job 111 (Copywriter)
  {
    id: 'c20', jobId: '111', candidateName: 'Linda Sari', candidateEmail: 'linda@example.com', candidateTitle: 'Writer',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 92,
    aiSummary: 'Creative portfolio with high conversion samples.', skills: ['Copywriting', 'SEO', 'Creative']
  },
  
  // Job 112 (QA)
  {
    id: 'c21', jobId: '112', candidateName: 'Toni Gunawan', candidateEmail: 'toni@example.com', candidateTitle: 'Manual Tester',
    appliedDate: new Date().toISOString(), status: 'Rejected', aiFitScore: 60,
    aiSummary: 'Only manual testing experience. Job requires automation.', skills: ['Manual Testing', 'Jira']
  },
  {
    id: 'c22', jobId: '112', candidateName: 'Siska Wulandari', candidateEmail: 'siska@example.com', candidateTitle: 'SDET',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'New', aiFitScore: 90,
    aiSummary: 'Strong automation skills with Selenium Java.', skills: ['Java', 'Selenium', 'TestNG']
  },

  // Job 113 (Finance)
  {
    id: 'c23', jobId: '113', candidateName: 'Hendra Wijaya', candidateEmail: 'hendra@example.com', candidateTitle: 'Accountant',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 85,
    aiSummary: 'CPA certified, solid accounting background.', skills: ['Accounting', 'Tax', 'Excel']
  },

  // Job 114 (CSM)
  {
    id: 'c24', jobId: '114', candidateName: 'Maria Kristal', candidateEmail: 'maria@example.com', candidateTitle: 'Support Agent',
    appliedDate: new Date().toISOString(), status: 'Reviewed', aiFitScore: 75,
    aiSummary: 'Great empathy, but lacks strategic account management exp.', skills: ['Zendesk', 'Communication']
  },
  {
    id: 'c25', jobId: '114', candidateName: 'Diana Prince', candidateEmail: 'diana@example.com', candidateTitle: 'CS Manager',
    appliedDate: new Date(Date.now() - 86400000).toISOString(), status: 'Interview', aiFitScore: 93,
    aiSummary: 'Managed enterprise accounts >$1M ARR.', skills: ['Retention', 'Upselling', 'Strategy']
  },
  
  // More miscellaneous applicants
  {
    id: 'c26', jobId: '101', candidateName: 'Tom Holland', candidateEmail: 'tom@example.com', candidateTitle: 'Marketing Intern',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 68,
    aiSummary: 'Eager to learn, but lacks experience.', skills: ['Social Media']
  },
  {
    id: 'c27', jobId: '103', candidateName: 'Chris Evans', candidateEmail: 'chris@example.com', candidateTitle: 'Fullstack Dev',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 88,
    aiSummary: 'Strong React skills, bonus Backend knowledge.', skills: ['React', 'Node.js']
  },
  {
    id: 'c28', jobId: '106', candidateName: 'Scarlett J', candidateEmail: 'scarlett@example.com', candidateTitle: 'Math PhD',
    appliedDate: new Date().toISOString(), status: 'Interview', aiFitScore: 96,
    aiSummary: 'Brilliant mathematical mind for algorithms.', skills: ['Math', 'Python', 'R']
  },
  {
    id: 'c29', jobId: '110', candidateName: 'Mark Ruffalo', candidateEmail: 'mark@example.com', candidateTitle: 'IT Support',
    appliedDate: new Date().toISOString(), status: 'Rejected', aiFitScore: 55,
    aiSummary: 'Lacks cloud engineering experience.', skills: ['Hardware', 'Networking']
  },
  {
    id: 'c30', jobId: '115', candidateName: 'Paul Rudd', candidateEmail: 'paul@example.com', candidateTitle: 'Filmmaker',
    appliedDate: new Date().toISOString(), status: 'New', aiFitScore: 92,
    aiSummary: 'Excellent editing reel.', skills: ['Premiere Pro', 'After Effects']
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
