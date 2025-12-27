
import { JobStatus, Job, PricingPlan, EmployerJob, CandidateApplication, ExternalJobMatch, Language } from './types';

// Helper to safely get environment variables without crashing in browser
export const getEnv = (key: string) => {
  let value = '';
  
  // 1. Try standard process.env (Node/Next.js/CRA)
  try {
    if (typeof process !== 'undefined' && process.env) {
      value = process.env[key] || 
              process.env[`NEXT_PUBLIC_${key}`] || 
              process.env[`REACT_APP_${key}`] || 
              '';
    }
  } catch (error) {
    // Ignore error
  }

  // 2. Try Vite import.meta.env
  if (!value) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        value = import.meta.env[key] || import.meta.env[`VITE_${key}`] || '';
      }
    } catch (error) {
      // Ignore
    }
  }

  return value;
};

export const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

// Updated Free Limits
export const MAX_FREE_ATS_SCANS = 2;
export const MAX_FREE_JOBS = 30;
export const MAX_FREE_EXTENSION_USES = 20;
export const MAX_FREE_RECOMMENDATIONS = 2;

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
    PRICING_TITLE: "Smallest Investment, Biggest Return",
    PRICING_DESC: "Join 10,000+ professionals using AI to land offers 3x faster. Choose the path that fits your ambition.",
    PRICING_POPULAR: "Best Value - Save 30%",
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
    PRICING_TITLE: "Investasi Terkecil untuk Karir Terbesar",
    PRICING_DESC: "Gabung dengan 10,000+ profesional yang menggunakan AI untuk dapat kerja 3x lebih cepat. Pilih paket suksesmu.",
    PRICING_POPULAR: "Paling Hemat - Diskon 30%",
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
      id: 'Free',
      name: isId ? 'Starter' : 'Starter',
      price: 'Rp0',
      description: isId ? 'Hanya dasar untuk memulai' : 'The essentials to get started',
      features: isId ? [
        'Lacak 30 lamaran kerja',
        '2x Skor Kecocokan AI',
        '2x Rekomendasi Personal',
        '20x Penggunaan Ekstensi',
        'Dashboard pelacakan dasar'
      ] : [
        'Track 30 job applications',
        '2x AI Fit Scores',
        '2x AI Personalized Recommendations',
        '20x Extension Uses',
        'Basic tracking dashboard'
      ],
      cta: isId ? 'Mulai Gratis' : 'Start Free'
    },
    {
      id: 'Pro',
      name: isId ? 'Pro Monthly' : 'Pro Monthly',
      price: 'Rp165.000',
      description: isId ? 'Untuk pencari kerja aktif' : 'For the active job seeker',
      features: isId ? [
        'Semua fitur Starter',
        'Pelacakan lamaran TANPA BATAS',
        'Ekstensi Chrome (unlimited)',
        'Skor Kecocokan AI (unlimited)',
        'Prediksi Peluang Sukses AI',
        'Akses awal fitur baru'
      ] : [
        'Everything in Starter',
        'UNLIMITED job tracking',
        'Chrome extension (unlimited)',
        'Unlimited AI Fit Scores',
        'AI Success Probability',
        'Early access to new features'
      ],
      cta: isId ? 'Pilih Pro Bulanan' : 'Get Pro Monthly',
    },
    {
      id: 'Accelerator',
      name: isId ? 'Career Accelerator' : 'Career Accelerator',
      price: 'Rp350.000',
      description: isId ? '90 hari akses penuh (Hemat 30%)' : '90-day full access (Save 30%)',
      features: isId ? [
        'Semua fitur Pro',
        'Lacak lamaran tanpa batas',
        'Ekstensi Chrome (unlimited)',
        'Skor Kecocokan AI (unlimited)',
        'Prioritas dukungan AI',
        'Masa aktif 3 bulan penuh'
      ] : [
        'All Pro features included',
        'Unlimited job tracking',
        'Chrome extension (unlimited)',
        'Unlimited AI Fit Scores',
        'Priority AI Support',
        'Full 3-month active period'
      ],
      cta: isId ? 'Ambil Paket Hemat' : 'Claim Best Value',
      highlight: true
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

// Helper to get past date
const daysAgo = (days: number) => new Date(Date.now() - 86400000 * days).toISOString();
const futureDate = (days: number) => new Date(Date.now() + 86400000 * days).toISOString();

export const INITIAL_JOBS: Job[] = [
  // OFFERS (2) - High Success
  { 
    id: 'j1', 
    title: 'Senior Frontend Engineer', 
    company: 'Ruangguru', 
    location: 'Jakarta, ID', 
    status: JobStatus.OFFER, 
    created_at: daysAgo(20),
    ai_analysis: { fitScore: 95, analysis: 'Perfect match for React stack.', improvements: [] },
    timeline: [
        { status: JobStatus.APPLIED, date: daysAgo(20) },
        { status: JobStatus.INTERVIEW, date: daysAgo(10) },
        { status: JobStatus.OFFER, date: daysAgo(1) }
    ]
  },
  { 
    id: 'j2', 
    title: 'Product Manager', 
    company: 'Mekari', 
    location: 'Jakarta, ID', 
    status: JobStatus.OFFER, 
    created_at: daysAgo(18),
    ai_analysis: { fitScore: 92, analysis: 'Strong domain expertise.', improvements: [] },
    timeline: [
        { status: JobStatus.APPLIED, date: daysAgo(18) },
        { status: JobStatus.INTERVIEW, date: daysAgo(5) },
        { status: JobStatus.OFFER, date: daysAgo(0) }
    ]
  },

  // INTERVIEWS (8) - Bringing Interview Rate to ~40% (10/25)
  { 
    id: 'j3', 
    title: 'Software Engineer', 
    company: 'GoTo Financial', 
    location: 'Jakarta, ID', 
    status: JobStatus.INTERVIEW, 
    created_at: daysAgo(15), 
    ai_analysis: { fitScore: 88, analysis: 'Solid technical background.', improvements: [] },
    assessment: { required: true, type: 'Coding Test', status: 'Completed', deadline: daysAgo(10) }
  },
  { id: 'j4', title: 'UX Designer', company: 'Traveloka', location: 'Tangerang, ID', status: JobStatus.INTERVIEW, created_at: daysAgo(14) },
  { id: 'j5', title: 'Backend Developer', company: 'Shopee', location: 'Singapore', status: JobStatus.INTERVIEW, created_at: daysAgo(12) },
  { 
    id: 'j6', 
    title: 'Full Stack Dev', 
    company: 'Grab', 
    location: 'Jakarta, ID', 
    status: JobStatus.INTERVIEW, 
    created_at: daysAgo(10),
    assessment: { required: true, type: 'Video Interview', status: 'Pending', deadline: futureDate(2), platform: 'HireVue' }
  },
  { id: 'j7', title: 'QA Engineer', company: 'Bukalapak', location: 'Remote', status: JobStatus.INTERVIEW, created_at: daysAgo(9) },
  { id: 'j8', title: 'Data Analyst', company: 'Jenius', location: 'Jakarta, ID', status: JobStatus.INTERVIEW, created_at: daysAgo(8) },
  { id: 'j9', title: 'Mobile Engineer', company: 'Tiket.com', location: 'Jakarta, ID', status: JobStatus.INTERVIEW, created_at: daysAgo(7) },
  { id: 'j10', title: 'DevOps Engineer', company: 'Blibli', location: 'Jakarta, ID', status: JobStatus.INTERVIEW, created_at: daysAgo(6) },

  // REJECTED (5)
  { id: 'j11', title: 'Senior Engineer', company: 'Agoda', location: 'Bangkok', status: JobStatus.REJECTED, created_at: daysAgo(25) },
  { id: 'j12', title: 'Tech Lead', company: 'Sea Labs', location: 'Jakarta, ID', status: JobStatus.REJECTED, created_at: daysAgo(22) },
  { id: 'j13', title: 'Solutions Architect', company: 'Google', location: 'Singapore', status: JobStatus.REJECTED, created_at: daysAgo(21) },
  { id: 'j14', title: 'Frontend Dev', company: 'Meta', location: 'Singapore', status: JobStatus.REJECTED, created_at: daysAgo(19) },
  { id: 'j15', title: 'System Analyst', company: 'BCA', location: 'Jakarta, ID', status: JobStatus.REJECTED, created_at: daysAgo(17) },

  // APPLIED (7)
  { id: 'j16', title: 'React Developer', company: 'Stockbit', location: 'Jakarta, ID', status: JobStatus.APPLIED, created_at: daysAgo(5) },
  { id: 'j17', title: 'UI Designer', company: 'Bibit', location: 'Jakarta, ID', status: JobStatus.APPLIED, created_at: daysAgo(4) },
  { 
    id: 'j18', 
    title: 'Frontend Engineer', 
    company: 'Xendit', 
    location: 'Remote', 
    status: JobStatus.APPLIED, 
    created_at: daysAgo(3),
    assessment: { required: true, type: 'Online Game', status: 'In Progress', deadline: futureDate(1), platform: 'Pymetrics' }
  },
  { id: 'j19', title: 'Software Engineer', company: 'eFishery', location: 'Bandung, ID', status: JobStatus.APPLIED, created_at: daysAgo(2) },
  { id: 'j20', title: 'Product Owner', company: 'Flip', location: 'Depok, ID', status: JobStatus.APPLIED, created_at: daysAgo(1) },
  { id: 'j21', title: 'Marketing Lead', company: 'Kopi Kenangan', location: 'Jakarta, ID', status: JobStatus.APPLIED, created_at: daysAgo(1) },
  { id: 'j22', title: 'Content Writer', company: 'Sociolla', location: 'Jakarta, ID', status: JobStatus.APPLIED, created_at: daysAgo(0) },

  // SAVED (3)
  { id: 'j23', title: 'Engineering Manager', company: 'Ajaib', location: 'Jakarta, ID', status: JobStatus.SAVED, created_at: daysAgo(0) },
  { id: 'j24', title: 'CTO', company: 'Halodoc', location: 'Jakarta, ID', status: JobStatus.SAVED, created_at: daysAgo(0) },
  { id: 'j25', title: 'VP of Engineering', company: 'Alodokter', location: 'Jakarta, ID', status: JobStatus.SAVED, created_at: daysAgo(0) },
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
