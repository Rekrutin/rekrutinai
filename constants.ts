
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
    STATS_USERS: "Active Users",
    STATS_FASTER: "Hired Faster",
    STATS_APPS: "Applications",
    PRODUCT_PREVIEW_TITLE: "Live Application Tracker",
    PRODUCT_CTA: "Try AI Dashboard Free",
    TESTIMONIALS_TITLE: "What Our Users Say",
    TESTIMONIALS_DESC: "Real success stories from professionals who accelerated their career with RekrutIn.",
    TESTIMONIAL_1_NAME: "Anita Wijaya",
    TESTIMONIAL_1_ROLE: "Software Engineer at Shopee",
    TESTIMONIAL_1_TEXT: "RekrutIn changed everything. I used to lose track of where I applied, but now I have an AI coach that helps me optimize every single application. Landed my role in 3 weeks!",
    TESTIMONIAL_2_NAME: "Budi Santoso",
    TESTIMONIAL_2_ROLE: "Product Manager at Gojek",
    TESTIMONIAL_2_TEXT: "The AI Fit Score is a game-changer. It told me exactly what was missing in my resume for the PM role. I increased my interview rate by almost 50% immediately.",
    TESTIMONIAL_3_NAME: "Clarissa Tan",
    TESTIMONIAL_3_ROLE: "UX Designer at Traveloka",
    TESTIMONIAL_3_TEXT: "Managing 50+ applications was a nightmare until I found RekrutIn. The extension makes saving jobs from LinkedIn so seamless. Highly recommended!",
    CTA_TITLE: "Ready to Land Your Dream Job?",
    CTA_DESC: "Join 10,000+ professionals who have accelerated their career by 3x using RekrutIn.",
    CTA_BUTTON: "Join Now Free",
    FOOTER_DESC: "© 2025 RekrutIn.ai — Designed with 💡 in Indonesia"
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
    STATS_USERS: "Pengguna Aktif",
    STATS_FASTER: "Lebih Cepat Direkrut",
    STATS_APPS: "Lamaran Terkirim",
    PRODUCT_PREVIEW_TITLE: "Pelacak Lamaran Live",
    PRODUCT_CTA: "Coba Dashboard AI Gratis",
    TESTIMONIALS_TITLE: "Apa Kata Pengguna Kami",
    TESTIMONIALS_DESC: "Kisah sukses nyata dari para profesional yang mempercepat karir mereka dengan RekrutIn.",
    TESTIMONIAL_1_NAME: "Anita Wijaya",
    TESTIMONIAL_1_ROLE: "Software Engineer di Shopee",
    TESTIMONIAL_1_TEXT: "RekrutIn mengubah segalanya. Dulu saya sering lupa melamar di mana saja, tapi sekarang saya punya pelatih AI yang mengoptimalkan setiap lamaran. Dapat kerja dalam 3 minggu!",
    TESTIMONIAL_2_NAME: "Budi Santoso",
    TESTIMONIAL_2_ROLE: "Product Manager di Gojek",
    TESTIMONIAL_2_TEXT: "Skor Kecocokan AI sangat membantu. Saya diberitahu apa yang kurang di resume saya. Tingkat panggilan interview saya naik hampir 50% seketika.",
    TESTIMONIAL_3_NAME: "Clarissa Tan",
    TESTIMONIAL_3_ROLE: "UX Designer di Traveloka",
    TESTIMONIAL_3_TEXT: "Mengelola 50+ lamaran sangat melelahkan sampai saya menemukan RekrutIn. Ekstensi browsernya memudahkan simpan lowongan dari LinkedIn. Sangat direkomendasikan!",
    CTA_TITLE: "Siap Mendapatkan Pekerjaan Impianmu?",
    CTA_DESC: "Gabung dengan 10.000+ profesional yang mempercepat karir mereka 3x lipat menggunakan RekrutIn.",
    CTA_BUTTON: "Daftar Sekarang Gratis",
    FOOTER_DESC: "© 2025 RekrutIn.ai — Dibuat dengan 💡 di Indonesia"
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
        'Unlimited AI Fit Scores',
        'AI Success Probability',
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
        'Unlimited AI Fit Scores',
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

export const INITIAL_JOBS: Job[] = [
  { 
    id: 'j1', 
    title: 'Senior Frontend Engineer', 
    company: 'Ruangguru', 
    location: 'Jakarta, ID', 
    status: JobStatus.OFFER, 
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    ai_analysis: { fitScore: 95, analysis: 'Perfect match for React stack.', improvements: [] },
    timeline: [
        { status: JobStatus.APPLIED, date: new Date(Date.now() - 86400000 * 20).toISOString() },
        { status: JobStatus.INTERVIEW, date: new Date(Date.now() - 86400000 * 10).toISOString() },
        { status: JobStatus.OFFER, date: new Date(Date.now() - 86400000 * 1).toISOString() }
    ]
  },
  { 
    id: 'j3', 
    title: 'Software Engineer', 
    company: 'GoTo Financial', 
    location: 'Jakarta, ID', 
    status: JobStatus.INTERVIEW, 
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(), 
    ai_analysis: { fitScore: 88, analysis: 'Solid technical background.', improvements: [] },
    assessment: { required: true, type: 'Coding Test', status: 'Completed', deadline: new Date(Date.now() - 86400000 * 10).toISOString() }
  },
  { id: 'j4', title: 'UX Designer', company: 'Traveloka', location: 'Tangerang, ID', status: JobStatus.INTERVIEW, created_at: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: 'j11', title: 'Senior Engineer', company: 'Agoda', location: 'Bangkok', status: JobStatus.REJECTED, created_at: new Date(Date.now() - 86400000 * 25).toISOString() },
  { id: 'j16', title: 'React Developer', company: 'Stockbit', location: 'Jakarta, ID', status: JobStatus.APPLIED, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
];

// INITIAL_EMPLOYER_JOBS added to fix error in AdminDashboard.tsx
export const INITIAL_EMPLOYER_JOBS: EmployerJob[] = [
  {
    id: 'ej1',
    title: 'Senior Frontend Developer',
    location: 'Remote, Indonesia',
    type: 'Full-time',
    salary_range: 'Rp 20.000.000 - Rp 35.000.000',
    applicants_count: 12,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Looking for a Senior Frontend Developer with expertise in React and TypeScript.'
  },
  {
    id: 'ej2',
    title: 'Product Designer',
    location: 'Jakarta, ID',
    type: 'Full-time',
    salary_range: 'Rp 15.000.000 - Rp 25.000.000',
    applicants_count: 8,
    status: 'Active',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: 'Join our design team to create beautiful and functional user experiences.'
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
  }
];

export const TRENDING_SEARCHES = [
  "Remote Frontend Developer",
  "Product Manager Jakarta",
  "Data Analyst Entry Level",
  "UX Designer Singapore",
  "Marketing Intern"
];
