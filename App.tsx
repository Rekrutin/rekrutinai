
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, CheckCircle, BarChart3, Bot, Calendar, ArrowRight, 
  Linkedin, Github, Plus, LayoutDashboard, LogOut, ChevronDown, 
  Briefcase, Users, Search, List as ListIcon, Kanban, FileText, UserCircle, Sparkles, Bell, CreditCard,
  MapPin, TrendingUp, Rocket, Files, Zap, Target, Radar, Building2, ExternalLink, Trash2, BrainCircuit, Chrome,
  MessageSquare, User, Check
} from 'lucide-react';
import { Job, JobStatus, JobAnalysis, UserRole, EmployerJob, DashboardTab, UserProfile, Resume, JobAlert, Notification, EmployerTab, CandidateApplication, ExternalJobMatch, Language, PlanType } from './types';
import { INITIAL_JOBS, getFeatures, getPricingPlans, INITIAL_EMPLOYER_JOBS, TRENDING_SEARCHES, INITIAL_APPLICATIONS, INITIAL_EXTERNAL_MATCHES, TRANSLATIONS, MAX_FREE_ATS_SCANS } from './constants';
import { supabase } from './services/supabaseClient';
import { JobCard } from './components/JobCard';
import { JobListView } from './components/JobListView';
import { AddJobModal } from './components/AddJobModal';
import { AIAnalyzerModal } from './components/AIAnalyzerModal';
import { PostJobModal } from './components/PostJobModal';
import { SeekerAnalytics } from './components/SeekerAnalytics';
import { ProfileSection } from './components/ProfileSection';
import { ResumeSection } from './components/ResumeSection';
import { AIAgentSection } from './components/AIAgentSection';
import { JobAlertsSection } from './components/JobAlertsSection';
import { EmployerCandidatesView } from './components/EmployerCandidatesView';
import { EmployerDashboardSummary } from './components/EmployerDashboardSummary';
import { SignupModal } from './components/SignupModal';
import { LoginModal } from './components/LoginModal';
import { UpgradeLimitModal } from './components/UpgradeLimitModal';
import { EmployerSignupModal } from './components/EmployerSignupModal';
import { analyzeResumeATS } from './services/geminiService';
import { CountUp } from './components/CountUp';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import { AdminDashboard } from './components/AdminDashboard'; 
import { AssessmentTracker } from './components/AssessmentTracker';
import { ExtensionPage } from './components/ExtensionPage';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { useSubscription } from './hooks/useSubscription';
import { createCheckoutSession } from './services/paymentService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'features' | 'how-it-works' | 'pricing' | 'dashboard' | 'admin'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('seeker');
  const [language, setLanguage] = useState<Language>('en');
  
  // Job Seeker State
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [activeTab, setActiveTab] = useState<DashboardTab>('tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); 
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [isAnalyzerModalOpen, setIsAnalyzerModalOpen] = useState(false);

  // Auth & Onboarding State
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEmployerSignupModalOpen, setIsEmployerSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // USER DATABASE PERSISTENCE (Local Fallback)
  const [userDatabase, setUserDatabase] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('rekrutin_db');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Save User Database whenever it changes
  useEffect(() => {
    localStorage.setItem('rekrutin_db', JSON.stringify(userDatabase));
  }, [userDatabase]);

  // Global Nav Listener for subpages
  useEffect(() => {
    const handleNav = (e: any) => {
        setCurrentView(e.detail);
        window.scrollTo(0, 0);
    };
    window.addEventListener('nav', handleNav);
    return () => window.removeEventListener('nav', handleNav);
  }, []);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('Premium Feature');

  // Current User Profile
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
  
  // Subscription Hook
  const subscription = useSubscription(profile, jobs.length);

  // Initial empty resume list for new users
  const [resumes, setResumes] = useState<Resume[]>([]);
  
  // Alerts & Notifications
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Employer State
  const [employerJobs, setEmployerJobs] = useState<EmployerJob[]>([]);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isMandatoryJobPost, setIsMandatoryJobPost] = useState(false);
  
  const [employerTab, setEmployerTab] = useState<EmployerTab>('overview'); 
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Admin / Import State
  const [importedJobs, setImportedJobs] = useState<ExternalJobMatch[]>(INITIAL_EXTERNAL_MATCHES);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Internationalization Helper
  const t = TRANSLATIONS[language];
  const pricingPlans = getPricingPlans(language);
  const features = getFeatures(language);

  // DATA PERSISTENCE PER USER (Local Fallback)
  useEffect(() => {
    if (profile.email && userRole === 'seeker') {
      const userData = {
        jobs,
        resumes,
        jobAlerts
      };
      localStorage.setItem(`rekrutin_data_${profile.email}`, JSON.stringify(userData));
    }
  }, [jobs, resumes, jobAlerts, profile.email, userRole]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Supabase Fetch (Simulated) - Only if using Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      if (supabase && userRole === 'seeker') {
        const { data, error } = await supabase.from('jobs').select('*');
        if (!error && data) setJobs(data as unknown as Job[]);
      }
    };
    fetchJobs();
  }, [userRole]);

  // Derived State: Matched jobs based on alerts
  const allPotentialJobs: ExternalJobMatch[] = [
    ...employerJobs.map(ej => ({
      id: ej.id,
      title: ej.title,
      company: 'Verified Partner', 
      location: ej.location,
      type: ej.type,
      salary_range: ej.salary_range,
      source: 'RekrutIn' as const,
      postedAt: ej.created_at,
      description: ej.description,
      aiFitScore: Math.floor(Math.random() * (99 - 80 + 1)) + 80
    })),
    ...importedJobs 
  ];

  // Filter Jobs based on Search Query
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Job Seeker Actions ---
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
  }

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

  const handleAnalyzeResume = async (resume: Resume) => {
    if (!subscription.canUseAI) {
      setUpgradeFeatureName('Unlimited ATS Analysis');
      setIsUpgradeModalOpen(true);
      return;
    }
    try {
      const result = await analyzeResumeATS(resume.content);
      setResumes(resumes.map(r => r.id === resume.id ? { ...r, atsScore: result.score, atsAnalysis: result.feedback } : r));
      setProfile(prev => ({ ...prev, atsScansUsed: prev.atsScansUsed + 1 }));
    } catch (e) {}
  };

  const handlePaymentAndUpgrade = async (plan: PlanType = 'Pro') => {
    await createCheckoutSession(plan, profile.email);
    setProfile({ ...profile, plan });
    setIsUpgradeModalOpen(false);
  };

  const handleSignupComplete = async (newProfile: UserProfile, initialResume: Resume, password?: string) => {
    setProfile({ ...newProfile, plan: 'Free', atsScansUsed: 1 });
    setResumes([initialResume]);
    setUserDatabase(prev => [...prev, newProfile]);
    setIsSignupModalOpen(false);
    setUserRole('seeker');
    setCurrentView('dashboard');
  };

  const handleLogin = async (email: string, password?: string) => {
    if (email === 'admin@rekrutin.ai') {
      setUserRole('admin');
      setCurrentView('admin');
      setIsLoginModalOpen(false);
      return;
    }
    const foundUser = userDatabase.find(u => u.email === email);
    if (foundUser) {
        setProfile(foundUser);
        setCurrentView('dashboard');
        setIsLoginModalOpen(false);
    } else {
        alert("Account not found.");
    }
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setProfile({ name: 'Guest', title: '', email: '', summary: '', skills: [], plan: 'Free', atsScansUsed: 0, extensionUses: 0 });
    setJobs([]);
    setResumes([]);
  };

  const Navbar = () => (
    <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
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
               <button onClick={() => setIsEmployerSignupModalOpen(true)} className="text-slate-600 hover:text-indigo-600 font-bold px-3 py-2 text-sm">For Employers</button>
               <button onClick={() => setIsLoginModalOpen(true)} className="text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 text-sm transition-colors">{t.NAV_LOGIN}</button>
               <button onClick={() => setIsSignupModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 text-sm">{t.NAV_SIGNUP}</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderLanding = () => (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 shadow-sm">
            <Sparkles size={14} className="mr-2 text-indigo-500" /> {t.HERO_TAG}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            {t.HERO_TITLE_1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t.HERO_TITLE_2}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">{t.HERO_DESC}</p>
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 pr-2">
              <input type="text" placeholder={t.SEARCH_PLACEHOLDER} className="w-full p-4 text-lg bg-transparent border-none outline-none text-slate-800" />
              <button onClick={() => setIsSignupModalOpen(true)} className="hidden sm:flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">{t.SEARCH_BUTTON} <ArrowRight size={18} className="ml-2" /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderPricingPage = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.PRICING_TITLE}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t.PRICING_DESC}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border flex flex-col transition-transform hover:-translate-y-2 duration-300 ${plan.highlight ? 'border-indigo-600 shadow-2xl ring-4 ring-indigo-50 bg-white relative' : 'border-slate-200 bg-white shadow-lg'}`}>
                {plan.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">{t.PRICING_POPULAR}</span></div>}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mt-4 mb-8"><span className="text-4xl font-extrabold text-slate-900">{plan.price}</span><p className="text-sm text-slate-500 mt-2">{plan.description}</p></div>
                <ul className="space-y-4 mb-8 flex-1">{plan.features.map((feat, i) => (<li key={i} className="flex items-start text-sm text-slate-700"><Check size={16} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />{feat}</li>))}</ul>
                <button onClick={() => setIsSignupModalOpen(true)} className={`w-full py-4 rounded-xl font-bold shadow-md transition-all ${plan.highlight ? 'bg-indigo-600 text-white shadow-indigo-500/25' : 'bg-slate-50 text-slate-900 border border-slate-200'}`}>{plan.cta}</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
          <span className="text-xl font-extrabold text-slate-900 hidden lg:block">RekrutIn<span className="text-indigo-600">.ai</span></span>
        </div>
        <nav className="flex-1 py-6 px-2 lg:px-4 space-y-1 overflow-y-auto">
             {[{ id: 'tracker', icon: LayoutDashboard, label: t.JOB_TRACKER }, { id: 'resumes', icon: FileText, label: t.RESUME_MANAGER }, { id: 'agent', icon: MessageSquare, label: t.AI_AGENT }, { id: 'billing', icon: CreditCard, label: 'Billing' }].map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id as DashboardTab)} className={`w-full flex items-center justify-center lg:justify-start px-2 lg:px-4 py-3 rounded-xl ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500'}`}><item.icon size={22} className="lg:mr-3" /><span className="hidden lg:block">{item.label}</span></button>
             ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center lg:justify-start px-4 py-3 text-slate-500 hover:text-red-600 transition-colors"><LogOut size={20} className="lg:mr-3" /><span className="hidden lg:block">Logout</span></button>
        </div>
      </aside>
      <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        {activeTab === 'tracker' && <JobListView jobs={filteredJobs} onStatusChange={handleStatusChange} onAnalyze={(j) => {setAnalyzingJob(j); setIsAnalyzerModalOpen(true);}} onDelete={handleDeleteJob} onJobClick={(j) => {setSelectedJob(j); setIsJobDetailOpen(true);}} onAddJob={() => setIsAddModalOpen(true)} />}
        {activeTab === 'resumes' && <ResumeSection resumes={resumes} onAddResume={(r) => setResumes([...resumes, r])} onDeleteResume={(id) => setResumes(resumes.filter(r => r.id !== id))} onUpdateResume={(id, u) => setResumes(resumes.map(r => r.id === id ? {...r, ...u} : r))} onAnalyzeResume={handleAnalyzeResume} plan={profile.plan} scansUsed={profile.atsScansUsed} />}
        {activeTab === 'agent' && <AIAgentSection jobs={jobs} profile={profile} />}
        {activeTab === 'billing' && (
           <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="text-2xl font-bold mb-4">Subscription</h2>
             <p className="text-slate-600 mb-6">Current Plan: <span className="font-bold text-indigo-600">{profile.plan}</span></p>
             <button onClick={() => setCurrentView('pricing')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Change Plan</button>
           </div>
        )}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'admin' ? <AdminDashboard onLogout={handleLogout} liveUsers={userDatabase.map(u => u.email)} employerJobs={employerJobs} applications={applications} seekerJobs={jobs} seekerResumes={resumes} importedJobs={importedJobs} onImportJobs={setImportedJobs} onDeleteUser={() => {}} onDeleteResume={() => {}} onDeleteJob={() => {}} /> :
       currentView === 'pricing' ? renderPricingPage() :
       currentView === 'features' ? <FeaturesPage onSignUp={() => setIsSignupModalOpen(true)} onLogin={() => setIsLoginModalOpen(true)} onEmployerSignup={() => setIsEmployerSignupModalOpen(true)} /> :
       currentView === 'how-it-works' ? <HowItWorksPage onSignUp={() => setIsSignupModalOpen(true)} onLogin={() => setIsLoginModalOpen(true)} onEmployerSignup={() => setIsEmployerSignupModalOpen(true)} /> :
       currentView === 'dashboard' ? renderDashboard() :
       renderLanding()}

      {/* Global Modals */}
      {isSignupModalOpen && <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} onComplete={handleSignupComplete} />}
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} onSwitchToSignup={() => {setIsLoginModalOpen(false); setIsSignupModalOpen(true);}} />}
      {isEmployerSignupModalOpen && <EmployerSignupModal isOpen={isEmployerSignupModalOpen} onClose={() => setIsEmployerSignupModalOpen(false)} onComplete={(p) => { setProfile(p); setUserRole('employer'); setIsEmployerSignupModalOpen(false); setIsPostJobModalOpen(true); setIsMandatoryJobPost(true); }} />}
      {isAddModalOpen && <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddJob} />}
      {isAnalyzerModalOpen && analyzingJob && <AIAnalyzerModal job={analyzingJob} isOpen={isAnalyzerModalOpen} onClose={() => setIsAnalyzerModalOpen(false)} onAnalysisComplete={(id, a) => handleUpdateJobDetails(id, { ai_analysis: a })} />}
      {isPostJobModalOpen && <PostJobModal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} onPost={(j) => { setEmployerJobs([...employerJobs, {...j, id: Date.now().toString(), created_at: new Date().toISOString(), applicants_count: 0, status: 'Active'}]); setIsPostJobModalOpen(false); if(isMandatoryJobPost) { setCurrentView('dashboard'); setIsMandatoryJobPost(false); } }} isMandatory={isMandatoryJobPost} />}
      {isUpgradeModalOpen && <UpgradeLimitModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={() => handlePaymentAndUpgrade('Pro')} featureName={upgradeFeatureName} />}
      {isJobDetailOpen && selectedJob && <JobDetailDrawer job={selectedJob} isOpen={isJobDetailOpen} onClose={() => setIsJobDetailOpen(false)} onUpdateJob={handleUpdateJobDetails} isPro={subscription.isPro} onUpgrade={() => { setIsJobDetailOpen(false); handlePaymentAndUpgrade('Pro'); }} />}
    </div>
  );
};

export default App;
