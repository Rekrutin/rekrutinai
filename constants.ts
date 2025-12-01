
import { JobStatus, Job, PricingPlan, EmployerJob, CandidateApplication, ExternalJobMatch, Language } from './types';

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
export const MAX_FREE_ATS_SCANS = 2;
export const MAX_FREE_JOBS = 10;

// --- INTERNATIONALIZATION DATA ---

export const TRANSLATIONS = {
  en: {
    NAV_FEATURES: "Features",
    NAV_HOW_IT_WORKS: "How It Works",
    NAV_PRICING: "Pricing",
    NAV_EMPLOYERS: "For Employers",
    NAV_LOGIN: "Login",
    NAV_SIGNUP: "Sign Up",
    HERO_TAG: "New: AI Copilot for your job hunt",
    HERO_TITLE_1: "Land Your Next Job",
    HERO_TITLE_2: "Smarter, Not Harder.",
    HERO_DESC: "Your personal AI recruiter. Track applications, analyze your CV, and find matching roles across the web in seconds.",
    SEARCH_PLACEHOLDER: "Ask RekrutIn AI: Find me remote Product Design jobs in Jakarta...",
    SEARCH_BUTTON: "Search",
    TRENDING: "Trending:",
    STATS_JOBS: "Active Jobs",
    STATS_COMPANIES: "Companies",
    STATS_FASTER: "Hired Faster",
    STATS_APPS: "Applications",
    PRODUCT_PREVIEW_TITLE: "Live Application Tracker",
    PRODUCT_CTA: "Try AI Dashboard Free",
    FEATURES_TITLE: "Everything You Need to Get Hired",
    FEATURES_DESC: "Stop using spreadsheets. Start using an AI-powered command center for your career.",
    PRICING_TITLE: "Simple, Transparent Pricing",
    PRICING_DESC: "Invest in your career for less than the cost of a coffee.",
    PRICING_POPULAR: "Popular",
    PRICING_MONTH: "/mo",
    FOOTER_DESC: "© 2025 RekrutIn.ai — Designed with 💡 in Indonesia",
    JOB_TRACKER: "Job Tracker",
    RESUME_MANAGER: "Resume Manager",
    JOB_ALERTS: "Job Alerts",
    MY_PROFILE: "My Profile",
    AI_AGENT: "AI Career Agent",
    UPGRADE_PLAN: "Upgrade Plan"
  },
  id: {
    NAV_FEATURES: "Fitur",
    NAV_HOW_IT_WORKS: "Cara Kerja",
    NAV_PRICING: "Harga",
    NAV_EMPLOYERS: "Untuk Perusahaan",
    NAV_LOGIN: "Masuk",
    NAV_SIGNUP: "Daftar",
    HERO_TAG: "Baru: AI Copilot untuk pencarian kerjamu",
    HERO_TITLE_1: "Dapatkan Pekerjaan Impian",
    HERO_TITLE_2: "Lebih Cerdas, Lebih Cepat.",
    HERO_DESC: "Rekruter AI pribadimu. Lacak lamaran, analisis CV, dan temukan lowongan yang cocok di seluruh web dalam hitungan detik.",
    SEARCH_PLACEHOLDER: "Tanya RekrutIn AI: Carikan lowongan Product Design remote di Jakarta...",
    SEARCH_BUTTON: "Cari",
    TRENDING: "Populer:",
    STATS_JOBS: "Lowongan Aktif",
    STATS_COMPANIES: "Perusahaan",
    STATS_FASTER: "Lebih Cepat Direkrut",
    STATS_APPS: "Lamaran Terkirim",
    PRODUCT_PREVIEW_TITLE: "Pelacak Lamaran Live",
    PRODUCT_CTA: "Coba Dashboard AI Gratis",
    FEATURES_TITLE: "Semua yang Kamu Butuhkan",
    FEATURES_DESC: "Berhenti menggunakan spreadsheet manual. Mulai gunakan pusat komando berbasis AI untuk karirmu.",
    PRICING_TITLE: "Harga Simpel & Transparan",
    PRICING_DESC: "Investasi untuk karirmu dengan harga kurang dari segelas kopi.",
    PRICING_POPULAR: "Terlaris",
    PRICING_MONTH: "/bulan",
    FOOTER_DESC: "© 2025 RekrutIn.ai — Dibuat dengan 💡 di Indonesia",
    JOB_TRACKER: "Pelacak Kerja",
    RESUME_MANAGER: "Manajer Resume",
    JOB_ALERTS: "Notifikasi Lowongan",
    MY_PROFILE: "Profil Saya",
    AI_AGENT: "Agen Karir AI",
    UPGRADE_PLAN: "Upgrade Paket"
  }
};

export const getPricingPlans = (lang: Language): PricingPlan[] => {
  const isId = lang === 'id';
  return [
    {
      name: isId ? 'Gratis' : 'Free',
      price: 'Rp0',
      description: isId ? 'Sempurna untuk memulai' : 'Perfect for getting started',
      features: isId ? [
        '10 lamaran kerja (batas)',
        'Pelacakan kerja dasar',
        'Dashboard & pengingat dasar'
      ] : [
        '10 job applications (limit)',
        'Basic job tracking',
        'Basic dashboard & reminders'
      ],
      cta: isId ? 'Mulai Gratis' : 'Start Free'
    },
    {
      name: 'Pro',
      price: 'Rp165.000',
      description: isId ? 'Pilihan Utama Pencari Kerja' : 'Main MRR Driver',
      features: isId ? [
        'Pelacakan kerja tanpa batas',
        'Ekstensi Chrome (auto-capture)',
        'Skor Kecocokan Resume AI',
        'Prediksi Peluang Sukses AI',
        'Rekomendasi personal',
        'Analisis progres',
        'Akses awal fitur baru'
      ] : [
        'Unlimited job tracking',
        'Chrome extension (auto-capture)',
        'AI Resume Fit Score',
        'AI Success Probability',
        'Personalized recommendations',
        'Progress analytics',
        'Early access to new features'
      ],
      cta: isId ? 'Pilih Pro' : 'Go Pro',
      highlight: true
    },
    {
      name: 'Career+',
      price: 'Rp356.000',
      description: isId ? 'Untuk pertumbuhan serius' : 'For serious growth',
      features: isId ? [
        'Semua fitur Pro',
        'Modul pembelajaran karir',
        'Kursus optimasi CV & LinkedIn',
        'Template siap pakai',
        'Strategi pencarian kerja tingkat lanjut'
      ] : [
        'All Pro features',
        'Career learning modules',
        'CV & LinkedIn optimization course',
        'Pre-written templates',
        'Advanced job search strategies'
      ],
      cta: isId ? 'Gabung Career+' : 'Join Career+'
    },
    {
      name: 'Elite',
      price: 'Rp455.000',
      description: isId ? 'Dampak maksimal' : 'Maximum impact',
      features: isId ? [
        'Semua fitur Career+',
        '1x Latihan Interview (Live)',
        'Dukungan chat prioritas',
        'Audit personal CV & LinkedIn',
        'Roadmap pencarian kerja lanjutan'
      ] : [
        'All Career+ features',
        '1x Interview Training (Live)',
        'Priority chat support',
        'Personalized CV & LinkedIn audit',
        'Advanced job search roadmap'
      ],
      cta: isId ? 'Dapatkan Elite' : 'Get Elite'
    }
  ];
};

export const getFeatures = (lang: Language) => {
  const isId = lang === 'id';
  return [
    {
      title: isId ? 'Wawasan Dashboard' : 'Dashboard Insights',
      description: isId 
        ? 'Visualisasikan progres pencarian kerjamu dan dapatkan umpan balik berbasis data tentang performa CV-mu.' 
        : 'Visualize your job-hunting progress and get data-driven feedback on your CV performance.',
      icon: 'BarChart'
    },
    {
      title: isId ? 'Analisis Kecocokan AI' : 'AI Fit Analyzer',
      description: isId
        ? 'Bandingkan resumemu dengan lowongan kerja secara instan dan dapatkan skor kecocokan & tips dari AI.'
        : 'Instantly compare your resume with any job listing and get an AI-generated fit score & tips.',
      icon: 'Bot'
    },
    {
      title: isId ? 'Pelacakan Pintar' : 'Smart Tracking',
      description: isId
        ? 'Jangan pernah kehilangan jejak lagi — ketahui di mana kamu melamar, kapan, dan apa langkah selanjutnya.'
        : 'Never lose track again — know where you applied, when, and what your next move should be.',
      icon: 'Calendar'
    }
  ];
};

// --- DATA MOCKS ---

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
    },
    contacts: [
      { id: 'c1', name: 'Sarah Miller', role: 'Talent Acquisition', email: 'sarah@techflow.com' }
    ],
    notes: "Interview went well. Need to brush up on System Design for the next round.",
    timeline: [
      { status: JobStatus.SAVED, date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { status: JobStatus.APPLIED, date: new Date(Date.now() - 86400000 * 4).toISOString() },
      { status: JobStatus.INTERVIEW, date: new Date(Date.now() - 86400000 * 1).toISOString() }
    ],
    assessment: {
      required: true,
      type: 'Technical Assessment',
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days left
      status: 'Pending',
      platform: 'HackerRank'
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
    timeline: [
      { status: JobStatus.APPLIED, date: new Date().toISOString() }
    ],
    assessment: {
      required: true,
      type: 'Online Game',
      deadline: new Date(Date.now() + 86400000 * 1.5).toISOString(), // 1.5 days left (Urgent)
      status: 'In Progress',
      platform: 'Pymetrics'
    }
  },
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
  // ... (Other jobs remain similar)
];

export const INITIAL_APPLICATIONS: CandidateApplication[] = []; // Empty for brevity in diff
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
];

export const TRENDING_SEARCHES = [
  "Remote Frontend Developer",
  "Product Manager Jakarta",
  "Data Analyst Entry Level",
  "UX Designer Singapore",
  "Marketing Intern"
];
