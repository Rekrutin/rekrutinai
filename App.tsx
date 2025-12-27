
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, LogOut, FileText, Sparkles, CreditCard,
  MessageSquare, Settings, HelpCircle, Plus, Zap, CheckCircle, ArrowRight,
  Rocket, Briefcase, ChevronRight, Bell, Menu, X, Star, Globe, Play, Bot,
  Quote, Search, Trophy, Users, Target
} from 'lucide-react';
import { Job, JobStatus, UserRole, EmployerJob, DashboardTab, UserProfile, Resume, ExternalJobMatch, Language, PlanType, JobAnalysis, PricingPlan } from './types.ts';
import { TRANSLATIONS, INITIAL_EXTERNAL_MATCHES, getPricingPlans, INITIAL_JOBS } from './constants.ts';
import { supabase } from './services/supabaseClient.ts';
import { JobListView } from './components/JobListView.tsx';
import { AddJobModal } from './components/AddJobModal.tsx';
import { AIAnalyzerModal } from './components/AIAnalyzerModal.tsx';
import { SeekerAnalytics } from './components/SeekerAnalytics.tsx';
import { ResumeSection } from './components/ResumeSection.tsx';
import { AIAgentSection } from './components/AIAgentSection.tsx';
import { SignupModal } from './components/SignupModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { UpgradeLimitModal } from './components/UpgradeLimitModal.tsx';
import { EmployerSignupModal } from './components/EmployerSignupModal.tsx';
import { JobDetailDrawer } from './components/JobDetailDrawer.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx'; 
import { FeaturesPage } from './components/FeaturesPage.tsx';
import { HowItWorksPage } from './components/HowItWorksPage.tsx';
import { useSubscription } from './hooks/useSubscription.ts';
import { createCheckoutSession } from './services/paymentService.ts';
import { CountUp } from './components/CountUp.tsx';

const userDatabase = [
  { id: '1', email: 'john@example.com', name: 'John Doe', plan: 'Free' as PlanType },
  { id: '2', email: 'jane@pro.com', name: 'Jane Smith', plan: 'Pro' as PlanType },
  { id: '3', email: 'admin@rekrutin.ai', name: 'Admin', plan: 'Elite' as PlanType }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'features' | 'how-it-works' | 'pricing' | 'dashboard' | 'admin'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('seeker');
  const [language, setLanguage] = useState<Language>('en');
  const [session, setSession] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Job Seeker State
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS); 
  const [activeTab, setActiveTab] = useState<DashboardTab>('tracker');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); 
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isAnalyzerModalOpen, setIsAnalyzerModalOpen] = useState(false);

  // Auth & Onboarding State
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEmployerSignupModalOpen, setIsEmployerSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('Premium Feature');

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Guest User',
    title: 'Explorer',
    email: '',
    summary: 'Join to create your profile.',
    skills: [],
    plan: 'Free', 
    atsScansUsed: 0,
    extensionUses: 0
  });

  const subscription = useSubscription(profile, jobs.length);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [employerJobs, setEmployerJobs] = useState<EmployerJob[]>([]);
  const [importedJobs, setImportedJobs] = useState<ExternalJobMatch[]>(INITIAL_EXTERNAL_MATCHES);

  const t = TRANSLATIONS[language];
  const pricingPlans = getPricingPlans(language);

  // Global Navigation Listener
  useEffect(() => {
    const handleNav = (e: any) => {
        setCurrentView(e.detail);
        window.scrollTo(0, 0);
    };
    window.addEventListener('nav', handleNav);
    return () => window.removeEventListener('nav', handleNav);
  }, []);

  // AUTH SYNC & PERSISTENCE
  useEffect(() => {
    if (!supabase) return;

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        syncProfile(session.user);
        setCurrentView('dashboard');
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        syncProfile(session.user);
        if (currentView === 'landing' || currentView === 'pricing' || currentView === 'features' || currentView === 'how-it-works') {
           setCurrentView('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        handleLogoutLocal();
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const syncProfile = async (user: any) => {
    if (!supabase) return;
    
    // Attempt to fetch profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(prev => ({
        ...prev,
        id: data.id,
        email: data.email,
        name: data.full_name || prev.name,
        title: data.title || prev.title,
      }));
    } else {
      // If profile record doesn't exist yet, we can use metadata as fallback
      setProfile(prev => ({
        ...prev,
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || prev.name,
        title: user.user_metadata?.title || prev.title,
      }));
    }
  };

  const handleAddJob = async (newJobData: Omit<Job, 'id' | 'created_at'>) => {
    if (!subscription.canTrackJob) {
        setUpgradeFeatureName('Unlimited Job Tracking');
        setIsUpgradeModalOpen(true);
        return;
    }
    const newJob: Job = {
      ...newJobData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      timeline: [{ status: newJobData.status, date: new Date().toISOString() }]
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleDeleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const updatedJob = {
      ...job,
      status: newStatus,
      timeline: [...(job.timeline || []), { status: newStatus, date: new Date().toISOString() }]
    };
    setJobs(jobs.map(j => j.id === id ? updatedJob : j));
  };

  const handleUpdateJobDetails = async (id: string, updates: Partial<Job>) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const handlePaymentAndUpgrade = async (plan: PlanType = 'Pro') => {
    await createCheckoutSession(plan, profile.email);
    setProfile({ ...profile, plan });
    setIsUpgradeModalOpen(false);
  };

  const handleLogoutLocal = () => {
    setCurrentView('landing');
    setProfile({ name: 'Guest', title: '', email: '', summary: '', skills: [], plan: 'Free', atsScansUsed: 0, extensionUses: 0 });
    setJobs(INITIAL_JOBS);
    setResumes([]);
    setSession(null);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    handleLogoutLocal();
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span 
              onClick={() => setCurrentView('landing')}
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer"
            >
              RekrutIn.ai
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setCurrentView('features')} className={`font-medium transition-colors ${currentView === 'features' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>{t.NAV_FEATURES}</button>
            <button onClick={() => setCurrentView('how-it-works')} className={`font-medium transition-colors ${currentView === 'how-it-works' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>{t.NAV_HOW_IT_WORKS}</button>
            <button onClick={() => setCurrentView('pricing')} className={`font-medium transition-colors ${currentView === 'pricing' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>{t.NAV_PRICING}</button>
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
               <button onClick={() => setIsEmployerSignupModalOpen(true)} className="bg-black text-white font-bold px-4 py-2 text-sm rounded-md transition-colors hover:bg-slate-800">{t.NAV_EMPLOYERS}</button>
               <button onClick={() => setIsLoginModalOpen(true)} className="text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 text-sm transition-colors">{t.NAV_LOGIN}</button>
               
               <button onClick={() => setIsSignupModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 text-sm">{t.NAV_SIGNUP}</button>

               <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-black transition-all border border-slate-200 hover:border-indigo-200 ml-1 shadow-sm group"
                  title="Switch Language"
               >
                  <Globe size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  <span>{language.toUpperCase()}</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderLanding = () => (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,_rgba(79,70,229,0.08)_0%,_transparent_60%)] -z-10 pointer-events-none"></div>
        <div className="absolute top-40 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full animate-drift"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full animate-drift" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-black mb-8 shadow-sm animate-fade-in">
            <Sparkles size={14} className="mr-2 text-indigo-500" /> {t.HERO_TAG}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1] animate-fade-in">
            {t.HERO_TITLE_1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">{t.HERO_TITLE_2}</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.HERO_DESC}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
             <button 
                onClick={() => setIsSignupModalOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
             >
                {t.PRODUCT_CTA} <ArrowRight size={22} />
             </button>
             <button 
                onClick={() => setCurrentView('how-it-works')}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group"
             >
                <Play size={20} className="fill-slate-900" /> Watch Demo
             </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto py-12 border-y border-slate-100/60 mb-24">
            {[
              { label: t.STATS_USERS, value: 12.4, icon: <Users size={20} className="text-indigo-600" />, suffix: "K+" },
              { label: t.STATS_JOBS, value: 150, icon: <Briefcase size={20} className="text-blue-500" />, suffix: "K+" },
              { label: t.STATS_FASTER, value: 3.5, icon: <Rocket size={20} className="text-purple-500" />, suffix: "x" },
              { label: t.STATS_APPS, value: 85, icon: <CheckCircle size={20} className="text-green-500" />, suffix: "K+" }
            ].map((stat, i) => (
              <div key={i} className="text-center group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex justify-center mb-3 text-slate-400 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-4xl font-black text-slate-900">
                  <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                </p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto mb-32 group">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-white border border-slate-200 rounded-full shadow-2xl text-[10px] font-black text-slate-800 z-30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                {t.PRODUCT_PREVIEW_TITLE.toUpperCase()}
             </div>
             
             <div className="bg-[#0A0C16] rounded-[2.5rem] p-2 md:p-5 shadow-[0_50px_100px_-20px_rgba(10,12,22,0.6)] border border-slate-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(79,70,229,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
                
                <div className="bg-[#121422] rounded-[2rem] p-0 h-[480px] overflow-hidden relative border border-slate-800/40 flex">
                   <div className="w-16 md:w-20 border-r border-slate-800/40 flex flex-col items-center py-8 gap-10">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                         <Sparkles size={20} className="text-white" />
                      </div>
                      <div className="space-y-8">
                         {[LayoutGrid, FileText, MessageSquare, Target, Settings].map((Icon, idx) => (
                           <div key={idx} className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-700'}`}>
                              <Icon size={18} />
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="flex-1 flex flex-col">
                      <div className="h-20 px-8 flex items-center justify-between border-b border-slate-800/30">
                         <div className="flex gap-8">
                            {[
                              { label: 'Applied', value: '1.2K', color: 'text-blue-400' },
                              { label: 'Interviews', value: '48', color: 'text-purple-400' },
                              { label: 'Offer Rate', value: '12%', color: 'text-green-400' }
                            ].map((stat, i) => (
                              <div key={i} className="flex flex-col">
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</span>
                                 <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                              </div>
                            ))}
                         </div>
                         <div className="h-8 px-4 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-lg border border-indigo-500/30">
                            + ADD NEW
                         </div>
                      </div>

                      <div className="px-8 py-3 border-b border-slate-800/40 flex text-[8px] font-black text-slate-600 tracking-[0.2em] uppercase items-center bg-[#0D0F1A]/50">
                         <div className="w-2/5">Role & Company</div>
                         <div className="w-1/5 text-center">Status</div>
                         <div className="w-1/5 text-center">Date</div>
                         <div className="w-1/5 text-right">AI Score</div>
                      </div>

                      <div className="flex-1 overflow-hidden relative bg-[#0D0F1A]/20">
                         <div className="px-5 py-4 space-y-2 animate-scroll-vertical hover-pause">
                            {[
                              { title: 'Product Manager', company: 'Google', status: 'OFFER', color: 'text-green-400 bg-green-400/10 border-green-400/20', date: 'Jan 12', score: 98 },
                              { title: 'Frontend Lead', company: 'Meta', status: 'INTERVIEW', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', date: 'Jan 10', score: 94 },
                              { title: 'UX Specialist', company: 'Apple', status: 'APPLIED', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', date: 'Jan 15', score: 87 },
                              { title: 'Software Eng', company: 'Shopee', status: 'INTERVIEW', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', date: 'Jan 08', score: 91 },
                              { title: 'Data Scientist', company: 'Gojek', status: 'APPLIED', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', date: 'Jan 18', score: 82 },
                              { title: 'Designer', company: 'Figma', status: 'OFFER', color: 'text-green-400 bg-green-400/10 border-green-400/20', date: 'Jan 05', score: 96 },
                              { title: 'Backend Dev', company: 'Netflix', status: 'INTERVIEW', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', date: 'Jan 14', score: 89 },
                              { title: 'Marketing Mgr', company: 'HubSpot', status: 'OFFER', color: 'text-green-400 bg-green-400/10 border-green-400/20', date: 'Jan 03', score: 93 },
                              { title: 'Product Manager', company: 'Google', status: 'OFFER', color: 'text-green-400 bg-green-400/10 border-green-400/20', date: 'Jan 12', score: 98 },
                              { title: 'Frontend Lead', company: 'Meta', status: 'INTERVIEW', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', date: 'Jan 10', score: 94 },
                            ].map((row, idx) => (
                              <div key={idx} className="flex items-center px-5 py-4 bg-[#1C1F35]/40 border border-slate-800/60 rounded-[1.2rem] transition-all hover:bg-[#252A47] hover:border-indigo-500/30 group/row">
                                 <div className="w-2/5 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-800/60 group-hover/row:scale-105 transition-transform">
                                       <Briefcase size={16} className="text-slate-600" />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-slate-100 mb-0.5 leading-tight">{row.title}</p>
                                       <p className="text-[10px] text-slate-500 font-bold">{row.company}</p>
                                    </div>
                                 </div>
                                 <div className="w-1/5 flex justify-center">
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest border ${row.color}`}>
                                       {row.status}
                                    </div>
                                 </div>
                                 <div className="w-1/5 text-center text-[10px] font-bold text-slate-600">
                                    {row.date}
                                 </div>
                                 <div className="w-1/5 flex justify-end">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                                       <Sparkles size={10} className="text-indigo-400" />
                                       <span className="text-[10px] font-black text-indigo-400">{row.score}%</span>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#121422] to-transparent pointer-events-none z-10"></div>
                      </div>
                   </div>
                </div>

                <div className="absolute inset-x-0 bottom-16 flex justify-center z-40 pointer-events-none">
                   <button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className="pointer-events-auto bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl shadow-[0_20px_80px_rgba(79,70,229,0.7)] hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 flex items-center gap-5 ring-8 ring-indigo-600/10 group/cta"
                   >
                      {t.PRODUCT_CTA}
                      <ArrowRight size={28} className="group-hover/cta:translate-x-2 transition-transform" />
                   </button>
                </div>
             </div>
          </div>

          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6">
             <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">{t.TESTIMONIALS_TITLE}</h2>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">{t.TESTIMONIALS_DESC}</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: t.TESTIMONIAL_1_NAME, role: t.TESTIMONIAL_1_ROLE, text: t.TESTIMONIAL_1_TEXT, avatar: "AW" },
                  { name: t.TESTIMONIAL_2_NAME, role: t.TESTIMONIAL_2_ROLE, text: t.TESTIMONIAL_2_TEXT, avatar: "BS" },
                  { name: t.TESTIMONIAL_3_NAME, role: t.TESTIMONIAL_3_ROLE, text: t.TESTIMONIAL_3_TEXT, avatar: "CT" }
                ].map((testi, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
                     <Quote size={40} className="absolute top-6 right-8 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                           {testi.avatar}
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900">{testi.name}</h4>
                           <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{testi.role}</p>
                        </div>
                     </div>
                     <p className="text-slate-600 font-medium leading-relaxed italic">"{testi.text}"</p>
                     <div className="mt-6 flex gap-1 text-yellow-400">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <footer className="pt-20 pb-12 text-center border-t border-slate-100">
             <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.1em]">{t.FOOTER_DESC}</p>
          </footer>
        </div>
      </section>
    </div>
  );

  const renderPricingPage = () => {
    const isId = language === 'id';
    
    const getPrice = (plan: PricingPlan) => {
        if (plan.id === 'Free') return 'Rp0';
        if (billingCycle === 'monthly') return plan.price;
        
        if (plan.id === 'Pro') return 'Rp132.000';
        if (plan.id === 'Accelerator') return 'Rp280.000';
        return plan.price;
    };

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="pt-32 pb-16 px-4 text-center max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Smallest Investment, Biggest Return</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">Join 10,000+ professionals using AI to land offers 3x faster.</p>
            
            <div className="sticky top-20 z-30 flex flex-col items-center gap-4 mb-16 py-4 bg-white/80 backdrop-blur-md">
                <div className="inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${billingCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Yearly
                        <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Save 20%</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto relative px-4">
                {pricingPlans.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`bg-white rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col relative group ${
                            plan.highlight 
                            ? 'border-indigo-600 shadow-[0_30px_70px_rgba(79,70,229,0.15)] ring-1 ring-indigo-600 z-10 scale-105' 
                            : 'border-slate-200 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:border-slate-300'
                        }`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black px-6 py-2 rounded-full whitespace-nowrap shadow-xl uppercase tracking-[0.1em] flex items-center gap-2 ring-4 ring-white">
                                <Star size={12} className="fill-white" /> BEST VALUE - SAVE 30%
                            </div>
                        )}
                        
                        <div className="mb-8 text-left">
                            <h3 className="text-3xl font-black text-slate-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">{getPrice(plan)}</span>
                                <span className="text-slate-400 font-bold ml-1 text-sm">{billingCycle === 'monthly' ? '/mo' : '/mo'}</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100 mb-8"></div>

                        <ul className="space-y-5 mb-12 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-600 font-bold leading-snug text-left group-hover:text-slate-900 transition-colors">
                                    <div className={`mt-0.5 p-0.5 rounded-full mr-4 flex-shrink-0 border ${plan.highlight ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        <CheckCircle size={16} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => plan.id === 'Free' ? setIsSignupModalOpen(true) : handlePaymentAndUpgrade(plan.id)}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                                plan.highlight 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.3)]' 
                                : 'bg-[#12141D] text-white hover:bg-slate-800 shadow-xl'
                            }`}
                        >
                            {plan.cta}
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-24 max-w-4xl mx-auto flex flex-col items-center gap-8">
                 <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                    <Users size={20} className="opacity-50" /> Trusted by 10,000+ Career Builders
                 </div>
                 <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale filter hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                    {['Google', 'Shopee', 'Gojek', 'Traveloka', 'Tokopedia'].map(brand => (
                        <span key={brand} className="text-2xl font-black text-slate-800 tracking-tighter italic">{brand}</span>
                    ))}
                 </div>
            </div>
        </div>

        <footer className="mt-20 border-t border-slate-100 py-12 text-center">
            <p className="text-slate-400 text-sm font-medium">© 2025 RekrutIn.ai — Designed with 💡 in Indonesia</p>
        </footer>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20 shadow-sm">
        <div className="h-20 flex items-center justify-center border-b border-slate-50">
          <div onClick={() => setCurrentView('landing')} className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <Sparkles size={20} className="text-white" />
          </div>
        </div>
        <nav className="flex-1 py-10 px-3 space-y-6 flex flex-col items-center overflow-y-auto">
          <button onClick={() => setActiveTab('tracker')} title="Job Tracker" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${activeTab === 'tracker' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}><LayoutGrid size={24} /></button>
          <button onClick={() => setActiveTab('resumes')} title="Resume" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${activeTab === 'resumes' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}><FileText size={24} /></button>
          <button onClick={() => setActiveTab('agent')} title="AI Agent Chat" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${activeTab === 'agent' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}><MessageSquare size={24} /></button>
          <button onClick={() => setActiveTab('billing')} title="Subscription" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}><CreditCard size={24} /></button>
        </nav>
        <div className="p-4 border-t border-slate-50 flex flex-col items-center gap-4">
          <button title="Help Center" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><HelpCircle size={20} /></button>
          <button title="Settings" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Settings size={20} /></button>
          <button onClick={handleLogout} title="Logout" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-xl transition-all group"><LogOut size={20} /></button>
        </div>
      </aside>

      <main className="flex-1 ml-20 p-4 lg:p-10 overflow-y-auto">
        {activeTab === 'tracker' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Job Tracker Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your job applications and visualize your progress.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all hover:scale-[1.02]"><Plus size={20} className="mr-2" /> Add Application</button>
            </div>
            
            <SeekerAnalytics jobs={jobs} isPro={subscription.isPro} mode="summary" />
            
            <JobListView 
              jobs={jobs} 
              onStatusChange={handleStatusChange} 
              onAnalyze={(j) => {setAnalyzingJob(j); setIsAnalyzerModalOpen(true);}} 
              onDelete={handleDeleteJob} 
              onJobClick={(j) => {setSelectedJob(j); setIsJobDetailOpen(true);}} 
              onAddJob={() => setIsAddModalOpen(true)} 
            />
          </div>
        )}
        
        {activeTab === 'resumes' && <ResumeSection resumes={resumes} setResumes={setResumes} plan={profile.plan} scansUsed={profile.atsScansUsed} session={session} />}
        {activeTab === 'agent' && <AIAgentSection jobs={jobs} profile={profile} />}
        {activeTab === 'billing' && (
           <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <h2 className="text-3xl font-extrabold mb-2 text-slate-900">Subscription Plan</h2>
                <p className="text-slate-500 mb-10 max-w-md">Manage your account plan and unlock premium AI tools.</p>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                      <h4 className="text-3xl font-black text-indigo-600">{profile.plan}</h4>
                   </div>
                   <button onClick={() => setCurrentView('pricing')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-xl">Change Plan</button>
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'admin' ? <AdminDashboard onLogout={handleLogout} liveUsers={userDatabase.map(u => u.email)} employerJobs={employerJobs} applications={[]} seekerJobs={jobs} seekerResumes={resumes} importedJobs={importedJobs} onImportJobs={setImportedJobs} onDeleteUser={() => {}} onDeleteResume={() => {}} onDeleteJob={() => {}} /> :
       currentView === 'pricing' ? renderPricingPage() :
       currentView === 'features' ? <FeaturesPage onSignUp={() => setIsSignupModalOpen(true)} onLogin={() => setIsLoginModalOpen(true)} onEmployerSignup={() => setIsEmployerSignupModalOpen(true)} /> :
       currentView === 'how-it-works' ? <HowItWorksPage onSignUp={() => setIsSignupModalOpen(true)} onLogin={() => setIsLoginModalOpen(true)} onEmployerSignup={() => setIsEmployerSignupModalOpen(true)} /> :
       currentView === 'dashboard' ? renderDashboard() :
       renderLanding()}

      {/* Global Modals */}
      {isSignupModalOpen && (
        <SignupModal 
          isOpen={isSignupModalOpen} 
          onClose={() => setIsSignupModalOpen(false)} 
          onComplete={(p, r) => {
            setProfile(p);
            setResumes([r]);
            setCurrentView('dashboard');
            setIsSignupModalOpen(false);
          }} 
        />
      )}
      
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLogin={(email) => {
            // After Supabase logic in LoginModal, this callback triggers dashboard view
            setCurrentView('dashboard');
            setIsLoginModalOpen(false);
          }} 
          onSwitchToSignup={() => {setIsLoginModalOpen(false); setIsSignupModalOpen(true);}} 
        />
      )}
      
      {isEmployerSignupModalOpen && (
        <EmployerSignupModal 
          isOpen={isEmployerSignupModalOpen} 
          onClose={() => setIsEmployerSignupModalOpen(false)} 
          onComplete={(p) => {
            setProfile(p);
            setUserRole('employer');
            setIsEmployerSignupModalOpen(false);
            setCurrentView('dashboard');
          }} 
        />
      )}
      
      {isAddModalOpen && <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddJob} />}
      
      {isAnalyzerModalOpen && analyzingJob && (
        <AIAnalyzerModal 
          job={analyzingJob} 
          isOpen={isAnalyzerModalOpen} 
          onClose={() => setIsAnalyzerModalOpen(false)} 
          onAnalysisComplete={(id, a) => handleUpdateJobDetails(id, { ai_analysis: a })} 
        />
      )}
      
      {isUpgradeModalOpen && (
        <UpgradeLimitModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          onUpgrade={() => handlePaymentAndUpgrade('Pro')} 
          featureName={upgradeFeatureName} 
        />
      )}
      
      {isJobDetailOpen && selectedJob && (
        <JobDetailDrawer 
          job={selectedJob} 
          isOpen={isJobDetailOpen} 
          onClose={() => setIsJobDetailOpen(false)} 
          onUpdateJob={handleUpdateJobDetails} 
          isPro={subscription.isPro} 
          onUpgrade={() => { setIsJobDetailOpen(false); handlePaymentAndUpgrade('Pro'); }} 
        />
      )}
    </div>
  );
};

export default App;
