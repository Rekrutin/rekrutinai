
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, CheckCircle, BarChart3, Bot, Calendar, ArrowRight, 
  Linkedin, Github, Plus, LayoutDashboard, LogOut, ChevronDown, 
  Briefcase, Users, Search, List as ListIcon, Kanban, FileText, UserCircle, Sparkles, Bell, CreditCard,
  MapPin, TrendingUp, Rocket, Files, Zap, Target, Radar, Building2, ExternalLink, Trash2, BrainCircuit
} from 'lucide-react';
import { Job, JobStatus, JobAnalysis, UserRole, EmployerJob, DashboardTab, UserProfile, Resume, JobAlert, Notification, EmployerTab, CandidateApplication, ExternalJobMatch, Language } from './types';
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

// Mock simple HashRouter to avoid dependencies
const HashRouter = ({ 
  children, 
  route 
}: { 
  children: (currentRoute: string, navigate: (path: string) => void) => React.ReactNode; 
  route: string 
}) => {
  return <>{children(route, () => {})}</>;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'pricing' | 'dashboard' | 'admin'>('landing');
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
  
  // Auth & Onboarding State
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEmployerSignupModalOpen, setIsEmployerSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Initialize registered users from localStorage to persist accounts across refreshes
  const [registeredUsers, setRegisteredUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rekrutin_users');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // New Features State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Guest User',
    title: 'Explorer',
    email: '',
    summary: 'Join to create your profile.',
    skills: [],
    plan: 'Free', 
    atsScansUsed: 0
  });
  
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

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('rekrutin_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Check for active session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('rekrutin_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        setProfile(sessionData.profile);
        setUserRole(sessionData.role || 'seeker');
        
        // Handle redirect based on role
        if (sessionData.role === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('dashboard');
        }
        
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

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

  // Supabase Fetch (Simulated)
  useEffect(() => {
    const fetchJobs = async () => {
      if (supabase) {
        if (userRole === 'seeker') {
          const { data, error } = await supabase.from('jobs').select('*');
          if (!error && data) setJobs(data as unknown as Job[]);
        }
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
    ...importedJobs // Updated to use dynamic state instead of constant
  ];

  const matchedJobs = allPotentialJobs.filter(job => 
    jobAlerts.some(alert => 
      job.title.toLowerCase().includes(alert.keywords.toLowerCase()) &&
      (!alert.location || job.location.toLowerCase().includes(alert.location.toLowerCase()))
    )
  );

  // Filter Jobs based on Search Query
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Job Seeker Actions ---
  const handleAddJob = async (newJobData: Omit<Job, 'id' | 'created_at'>) => {
    const newJob: Job = {
      ...newJobData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      timeline: [{ status: newJobData.status, date: new Date().toISOString() }]
    };
    setJobs(prev => [newJob, ...prev]);
    if (supabase) await supabase.from('jobs').insert([newJob]);
  };

  const handleDeleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selectedJob?.id === id) setSelectedJob(null);
    if (supabase) await supabase.from('jobs').delete().eq('id', id);
  }

  const handleMoveJob = async (job: Job, direction: 'next' | 'prev') => {
    const statusOrder = Object.values(JobStatus);
    const currentIndex = statusOrder.indexOf(job.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const newStatus = statusOrder[newIndex];
      const updatedJob = { 
        ...job, 
        status: newStatus,
        timeline: [...(job.timeline || []), { status: newStatus, date: new Date().toISOString() }]
      };
      
      const updatedJobs = jobs.map(j => 
        j.id === job.id ? updatedJob : j
      );
      setJobs(updatedJobs);
      if(selectedJob?.id === job.id) setSelectedJob(updatedJob);
      if (supabase) await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const updatedJob = {
      ...job,
      status: newStatus,
      timeline: [...(job.timeline || []), { status: newStatus, date: new Date().toISOString() }]
    };

    const updatedJobs = jobs.map(j => j.id === id ? updatedJob : j);
    setJobs(updatedJobs);
    if(selectedJob?.id === id) setSelectedJob(updatedJob);
    if (supabase) await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
  };

  const handleAnalysisComplete = async (jobId: string, analysis: JobAnalysis) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const updatedJob = { ...job, ai_analysis: analysis };
    const updatedJobs = jobs.map(j => j.id === jobId ? updatedJob : j);
    
    setJobs(updatedJobs);
    if(selectedJob?.id === jobId) setSelectedJob(updatedJob);
    if (supabase) await supabase.from('jobs').update({ ai_analysis: analysis }).eq('id', jobId);
  };

  const handleUpdateJobDetails = (id: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    setJobs(updatedJobs);
    
    if(selectedJob?.id === id) {
      setSelectedJob(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // --- Resume Actions ---
  const handleAddResume = (resume: Resume) => setResumes(prev => [resume, ...prev]);
  const handleDeleteResume = (id: string) => setResumes(prev => prev.filter(r => r.id !== id));
  const handleUpdateResume = (id: string, updates: Partial<Resume>) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Limit Check for ATS Analysis
  const handleAnalyzeResume = async (resume: Resume) => {
    if (profile.plan === 'Free' && profile.atsScansUsed >= MAX_FREE_ATS_SCANS) {
      setIsUpgradeModalOpen(true);
      return;
    }
    try {
      const result = await analyzeResumeATS(resume.content);
      handleUpdateResume(resume.id, {
        atsScore: result.score,
        atsAnalysis: result.feedback
      });
      setProfile(prev => ({ ...prev, atsScansUsed: prev.atsScansUsed + 1 }));
    } catch (error) {
      console.error("Analysis failed", error);
    }
  };

  const handleUpgradeToPro = () => {
    setProfile(prev => ({ ...prev, plan: 'Pro' }));
    setIsUpgradeModalOpen(false);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Welcome to Pro! 🌟',
      message: 'You now have unlimited ATS scans and AI analysis.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system'
    }, ...prev]);
  };

  // --- Alert Actions ---
  const handleAddAlert = (alertData: Omit<JobAlert, 'id' | 'createdAt'>) => {
    const newAlert: JobAlert = {
      ...alertData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setJobAlerts(prev => [newAlert, ...prev]);
  };
  
  const handleDeleteAlert = (id: string) => {
    setJobAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const handleClearNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  // --- Employer Actions ---
  const handlePostJob = async (newJobData: Omit<EmployerJob, 'id' | 'created_at' | 'applicants_count' | 'status'>) => {
    const newJob: EmployerJob = {
      ...newJobData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      applicants_count: 0,
      status: 'Active'
    };
    setEmployerJobs(prev => [newJob, ...prev]);
    if (supabase) await supabase.from('employer_jobs').insert([newJob]);

    // Check Matches for notifications
    const matchedAlerts = jobAlerts.filter(alert => 
      newJob.title.toLowerCase().includes(alert.keywords.toLowerCase()) && 
      (!alert.location || newJob.location.toLowerCase().includes(alert.location.toLowerCase()))
    );

    if (matchedAlerts.length > 0) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'New Job Match!',
        message: `A new "${newJob.title}" job matching your alert was just posted.`,
        timestamp: new Date().toISOString(),
        read: false,
        jobId: newJob.id,
        type: 'alert'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }

    // MANDATORY FLOW CHECK
    if (isMandatoryJobPost) {
      setIsMandatoryJobPost(false);
      setIsPostJobModalOpen(false);
      setCurrentView('dashboard');
      setEmployerTab('jobs');
      setNotifications(prev => [{
        id: 'employer-welcome',
        title: 'Dashboard Active 📢',
        message: `Your first job "${newJob.title}" is live. Waiting for applicants.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'system'
      }, ...prev]);
    } else {
      setIsPostJobModalOpen(false);
    }
  }

  const handleViewApplicants = (jobId: string) => {
    setSelectedJobId(jobId);
    setEmployerTab('candidates');
  };

  const handleUpdateCandidateStatus = (id: string, status: CandidateApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const handleEmployerSignupComplete = (newProfile: UserProfile) => {
    // 1. Set User
    setProfile(newProfile);
    setUserRole('employer');
    
    // 2. Clear previous data (Rule 2)
    setEmployerJobs([]);
    setApplications([]);
    
    // 3. Register in persistent DB
    setRegisteredUsers(prev => {
      const updated = [...prev, newProfile.email];
      localStorage.setItem('rekrutin_users', JSON.stringify(updated));
      return updated;
    });

    // 4. Close Signup and FORCE OPEN POST JOB MODAL (Rule 1)
    setIsEmployerSignupModalOpen(false);
    setIsMandatoryJobPost(true);
    setIsPostJobModalOpen(true);
  };

  // --- Admin Actions ---
  const handleAdminImportJobs = (newJobs: ExternalJobMatch[]) => {
    setImportedJobs(prev => [...newJobs, ...prev]);
  };
  
  // --- Auth & Signup Flow ---
  const handleSignupComplete = async (newProfile: UserProfile, initialResume: Resume) => {
    let analyzedResume = { ...initialResume };
    try {
      const analysisResult = await analyzeResumeATS(initialResume.content);
      analyzedResume = {
        ...initialResume,
        atsScore: analysisResult.score,
        atsAnalysis: analysisResult.feedback
      };
    } catch (e) {
      console.error("Initial ATS scan failed during signup", e);
    }

    const completeProfile: UserProfile = {
      ...newProfile,
      plan: 'Free',
      atsScansUsed: 1 
    };
    setProfile(completeProfile);
    setJobs([]); 
    setResumes([analyzedResume]);
    
    // Update Persistent Users
    setRegisteredUsers(prev => {
      const updated = [...prev, newProfile.email];
      localStorage.setItem('rekrutin_users', JSON.stringify(updated));
      return updated;
    });

    // Save Session
    localStorage.setItem('rekrutin_session', JSON.stringify({ profile: completeProfile, role: 'seeker' }));

    setIsSignupModalOpen(false);
    setUserRole('seeker');
    setCurrentView('dashboard');
    setActiveTab('profile'); 
    
    setNotifications(prev => [{
      id: 'welcome',
      title: 'Welcome to RekrutIn.ai! 🚀',
      message: `Your profile is live. We've scanned your resume (1/2 free scans used).`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system'
    }, ...prev]);
  };

  const handleLogin = (email: string) => {
    // ADMIN CHECK
    if (email === 'admin@rekrutin.ai') {
      setUserRole('admin');
      setCurrentView('admin');
      setIsLoginModalOpen(false);
      localStorage.setItem('rekrutin_session', JSON.stringify({ profile: { name: 'Admin', email }, role: 'admin' }));
      return;
    }

    // STANDARD USER CHECK
    if (registeredUsers.includes(email)) {
      const newProfile = { ...profile, email };
      setProfile(newProfile);
      setIsLoginModalOpen(false);
      setUserRole('seeker');
      setCurrentView('dashboard');
      setActiveTab('tracker');
      
      // Persist Session
      localStorage.setItem('rekrutin_session', JSON.stringify({ profile: newProfile, role: 'seeker' }));
    } else {
      alert("Account not found. Please Sign Up.");
      setIsLoginModalOpen(false);
    }
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setIsNotificationOpen(false);
    setIsMandatoryJobPost(false);
    localStorage.removeItem('rekrutin_session');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  // ... (Navbar, Render functions, Helper functions same as previous) ...
  // [I will omit repeating the entire render logic for brevity, just highlighting the switch update]
  // But since this is a complete file replacement, I must include everything.
  // Re-pasting standard render functions to ensure full file integrity.

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
            <button onClick={() => setCurrentView('landing')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">{t.NAV_FEATURES}</button>
            <button onClick={() => setCurrentView('landing')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">{t.NAV_HOW_IT_WORKS}</button>
            <button onClick={() => setCurrentView('pricing')} className={`font-medium transition-colors ${currentView === 'pricing' ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>{t.NAV_PRICING}</button>
            
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
               <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors mr-2 text-sm font-semibold text-slate-700"
               >
                  <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇮🇩'}</span>
                  <span>{language === 'en' ? 'EN' : 'ID'}</span>
               </button>

               <button 
                onClick={() => setIsEmployerSignupModalOpen(true)}
                className="text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 text-sm"
              >
                {t.NAV_EMPLOYERS}
              </button>
                
                <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 text-sm transition-colors"
              >
                {t.NAV_LOGIN}
              </button>

                <button 
                onClick={() => setIsSignupModalOpen(true)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
              >
                {t.NAV_SIGNUP}
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderScrollingJobRow = (job: Job) => {
    const getStatusColor = (status: JobStatus) => {
      switch (status) {
        case JobStatus.SAVED: return 'bg-slate-100 text-slate-700 border-slate-200';
        case JobStatus.APPLIED: return 'bg-blue-50 text-blue-700 border-blue-200';
        case JobStatus.INTERVIEW: return 'bg-purple-50 text-purple-700 border-purple-200';
        case JobStatus.OFFER: return 'bg-green-50 text-green-700 border-green-200';
        case JobStatus.REJECTED: return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-slate-100 text-slate-700';
      }
    };
    
    const getScoreBadgeStyle = (score: number) => {
      if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
      if (score >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-red-50 text-red-700 border-red-200';
    };

    return (
      <div key={job.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl mb-3 shadow-sm hover:shadow-md transition-shadow">
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
               <h4 className="font-bold text-slate-900 truncate">{job.title}</h4>
               {job.ai_analysis && (
                 <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold flex items-center gap-1 ${getScoreBadgeStyle(job.ai_analysis.fitScore)}`}>
                   <BrainCircuit size={10} /> {job.ai_analysis.fitScore}%
                 </span>
               )}
            </div>
            <div className="flex items-center text-xs text-slate-500">
               <Building2 size={12} className="mr-1" />
               <span className="truncate mr-3">{job.company}</span>
               <MapPin size={12} className="mr-1" />
               <span className="truncate">{job.location || 'Remote'}</span>
            </div>
         </div>
         <div className="flex items-center gap-4 ml-4">
            <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getStatusColor(job.status)}`}>
               {job.status}
            </span>
            <div className="text-slate-300">
               <ChevronDown size={16} />
            </div>
         </div>
      </div>
    );
  };

  const renderLanding = () => (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent -z-10 pointer-events-none"></div>
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 shadow-sm">
            <Sparkles size={14} className="mr-2 text-indigo-500" />
            {t.HERO_TAG}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            {t.HERO_TITLE_1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t.HERO_TITLE_2}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            {t.HERO_DESC}
          </p>

          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 pr-2">
              <div className="pl-4 text-indigo-500">
                <Bot size={28} />
              </div>
              <input 
                type="text" 
                placeholder={t.SEARCH_PLACEHOLDER} 
                className="w-full p-4 text-lg bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button 
                onClick={() => setIsSignupModalOpen(true)}
                className="hidden sm:flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
              >
                {t.SEARCH_BUTTON} <ArrowRight size={18} className="ml-2" />
              </button>
              <button 
                 onClick={() => setIsSignupModalOpen(true)}
                className="sm:hidden p-3 bg-indigo-600 text-white rounded-xl"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm mb-10">
            <span className="text-slate-500 font-medium mr-2">{t.TRENDING}</span>
            {TRENDING_SEARCHES.map((tag, i) => (
              <button 
                key={i} 
                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
                onClick={() => setIsSignupModalOpen(true)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
             <div className="p-4 rounded-2xl bg-white/60 border border-indigo-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-default">
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 origin-center inline-block">
                  <CountUp end={250} suffix="k+" />
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 group-hover:text-indigo-600 transition-colors">{t.STATS_JOBS}</p>
             </div>
             <div className="p-4 rounded-2xl bg-white/60 border border-indigo-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-default">
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 origin-center inline-block">
                  <CountUp end={10} suffix="k+" />
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 group-hover:text-indigo-600 transition-colors">{t.STATS_COMPANIES}</p>
             </div>
             <div className="p-4 rounded-2xl bg-white/60 border border-indigo-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-default">
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 origin-center inline-block">
                  <CountUp end={85} suffix="%" />
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 group-hover:text-indigo-600 transition-colors">{t.STATS_FASTER}</p>
             </div>
             <div className="p-4 rounded-2xl bg-white/60 border border-indigo-50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-default">
                <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 origin-center inline-block">
                  <CountUp end={1.2} suffix="M+" decimals={1} />
                </p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 group-hover:text-indigo-600 transition-colors">{t.STATS_APPS}</p>
             </div>
          </div>

          <div className="hidden xl:block absolute top-1/2 -left-32 animate-float">
             <div className="bg-white p-2.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 w-56 transform rotate-[-4deg]">
               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                 <CheckCircle size={20} />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-800">Offer Received! 🎉</p>
                 <p className="text-xs text-slate-400">Google • Senior Dev</p>
               </div>
             </div>
          </div>
          <div className="hidden xl:block absolute top-1/3 -right-32 animate-float" style={{ animationDelay: '2s' }}>
             <div className="bg-white p-2.5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 w-56 transform rotate-[4deg]">
               <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                 <Sparkles size={20} />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-800">Resume Optimized</p>
                 <p className="text-xs text-slate-400">Score: 65 ➝ 92</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-transparent relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-6xl">
            <div className="rounded-2xl shadow-2xl bg-white/60 backdrop-blur-xl border border-white/50 overflow-hidden ring-1 ring-slate-900/5">
              <div className="bg-white/80 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
                <div className="mx-auto bg-slate-100 rounded-md px-3 py-1 text-xs text-slate-400 font-mono">rekrutin.ai/dashboard</div>
              </div>
              <div className="p-4 md:p-8 bg-slate-50/50">
                 <div className="mb-6 relative z-10">
                   <h3 className="text-lg font-bold text-slate-800 mb-2">{t.PRODUCT_PREVIEW_TITLE}</h3>
                   <SeekerAnalytics jobs={INITIAL_JOBS} />
                 </div>
                 
                 <div className="relative h-[450px] overflow-hidden -mx-2 px-2">
                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-50/50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="animate-scroll-vertical hover-pause">
                       {INITIAL_JOBS.map(job => renderScrollingJobRow(job))}
                       {INITIAL_JOBS.map(job => renderScrollingJobRow(job))}
                    </div>
                 </div>
              </div>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <button 
                  onClick={() => setIsSignupModalOpen(true)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform hover:shadow-xl flex items-center gap-2"
                >
                  <Sparkles size={18} className="text-yellow-300" />
                  {t.PRODUCT_CTA}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">{t.FEATURES_TITLE}</h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">{t.FEATURES_DESC}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 border border-slate-100">
                  {feature.icon === 'BarChart' && <BarChart3 size={28} />}
                  {feature.icon === 'Bot' && <Bot size={28} />}
                  {feature.icon === 'Calendar' && <Calendar size={28} />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              RekrutIn.ai
           </span>
           <p className="text-slate-500 text-sm mt-4">{t.FOOTER_DESC}</p>
           <div className="flex justify-center gap-6 mt-6">
             <a href="#" className="text-slate-400 hover:text-indigo-600"><Linkedin size={20} /></a>
             <a href="#" className="text-slate-400 hover:text-indigo-600"><Github size={20} /></a>
           </div>
        </div>
      </footer>
      
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onComplete={handleSignupComplete}
      />

      <EmployerSignupModal
        isOpen={isEmployerSignupModalOpen}
        onClose={() => setIsEmployerSignupModalOpen(false)}
        onComplete={handleEmployerSignupComplete}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
    </div>
  );

  const renderPricingPage = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{t.PRICING_TITLE}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{t.PRICING_DESC}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border ${plan.highlight ? 'border-indigo-600 shadow-2xl ring-4 ring-indigo-50 bg-white relative' : 'border-slate-200 bg-white shadow-lg'} flex flex-col transition-transform hover:-translate-y-2 duration-300`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      {t.PRICING_POPULAR}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                </div>
                <div className="mt-4 mb-8">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 font-medium ml-1">{t.PRICING_MONTH}</span>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setIsSignupModalOpen(true)}
                  className={`w-full py-4 rounded-xl font-bold shadow-md transition-all ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25' : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
        </div>
      </div>
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <p className="text-slate-500 text-sm">{t.FOOTER_DESC}</p>
        </div>
      </footer>
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onComplete={handleSignupComplete}
      />
      <EmployerSignupModal
        isOpen={isEmployerSignupModalOpen}
        onClose={() => setIsEmployerSignupModalOpen(false)}
        onComplete={handleEmployerSignupComplete}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
    </div>
  );

  const renderDashboard = () => (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 z-30 shadow-sm flex-shrink-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('landing')}>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mr-8 hidden md:block">
              RekrutIn.ai
            </span>
          </div>

          <div className="flex items-center space-x-3">
             {/* Notification Bell (Seeker Only) */}
             {userRole === 'seeker' && (
               <div className="relative" ref={notificationRef}>
                 <button 
                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                   className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative"
                 >
                   <Bell size={20} />
                   {notifications.filter(n => !n.read).length > 0 && (
                     <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                   )}
                 </button>
                 
                 {isNotificationOpen && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-fade-in overflow-hidden">
                     <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                       {notifications.length > 0 && (
                         <button onClick={handleClearNotifications} className="text-xs text-indigo-600 hover:text-indigo-800">Clear all</button>
                       )}
                     </div>
                     <div className="max-h-80 overflow-y-auto">
                       {notifications.length === 0 ? (
                         <div className="p-6 text-center text-slate-400 text-sm">
                           No new notifications
                         </div>
                       ) : (
                         notifications.map(notification => (
                           <div 
                             key={notification.id} 
                             onClick={() => {
                               handleMarkNotificationRead(notification.id);
                               if(notification.type === 'alert') setActiveTab('alerts');
                               setIsNotificationOpen(false);
                             }}
                             className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? 'bg-indigo-50/50' : ''}`}
                           >
                             <div className="flex gap-3">
                               <div className="flex-shrink-0 mt-1">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                               </div>
                               <div>
                                  <h4 className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notification.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-2 block">{new Date(notification.timestamp).toLocaleTimeString()}</span>
                               </div>
                             </div>
                           </div>
                         ))
                       )}
                     </div>
                   </div>
                 )}
               </div>
             )}

            {userRole === 'seeker' ? (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus size={16} className="mr-2" /> Track Job
              </button>
            ) : (
              <button 
                onClick={() => setIsPostJobModalOpen(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Plus size={16} className="mr-2" /> Post Job
              </button>
            )}
            
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 ml-4">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar Layout */}
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full overflow-hidden">
        
        {/* Job Seeker Sidebar */}
        {userRole === 'seeker' && (
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full">
             {/* User Profile Widget */}
             <div className="p-6 border-b border-slate-50 flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                   {profile.name.charAt(0)}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800 truncate w-32">{profile.name}</p>
                   {profile.plan !== 'Free' ? (
                     <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full inline-block uppercase">{profile.plan} Member</p>
                   ) : (
                     <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block">Free Plan</p>
                   )}
                 </div>
               </div>
             </div>

             <nav className="space-y-2 px-4 py-6 flex-1 overflow-y-auto scrollbar-hide">
               {/* ... (Existing Seeker Nav Items) ... */}
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-2">My Workspace</div>
               
               <button
                 onClick={() => setActiveTab('tracker')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'tracker' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Rocket size={18} className={`mr-3 ${activeTab === 'tracker' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.JOB_TRACKER}
               </button>
               
               <button
                 onClick={() => setActiveTab('resumes')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'resumes' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Files size={18} className={`mr-3 ${activeTab === 'resumes' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.RESUME_MANAGER}
               </button>
               
               <button
                 onClick={() => setActiveTab('alerts')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'alerts' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Radar size={18} className={`mr-3 ${activeTab === 'alerts' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.JOB_ALERTS}
               </button>

               <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-2">Career Tools</div>

               <button
                 onClick={() => setActiveTab('profile')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'profile' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <UserCircle size={18} className={`mr-3 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.MY_PROFILE}
               </button>
               
               <button
                 onClick={() => setActiveTab('agent')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'agent' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Bot size={18} className={`mr-3 ${activeTab === 'agent' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.AI_AGENT}
               </button>
               
               <button
                 onClick={() => setActiveTab('billing')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   activeTab === 'billing' 
                   ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-700 shadow-sm border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Zap size={18} className={`mr-3 ${activeTab === 'billing' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                 {t.UPGRADE_PLAN}
               </button>
             </nav>

             <div className="p-4 border-t border-slate-50 flex-shrink-0">
               <button
                 onClick={handleLogout}
                 className="w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all text-slate-500 hover:bg-red-50 hover:text-red-600 group"
               >
                 <LogOut size={18} className="mr-3 group-hover:text-red-500" />
                 Logout
               </button>
             </div>
          </aside>
        )}

        {/* Employer Sidebar */}
        {userRole === 'employer' && (
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col pt-6 pb-6 overflow-y-auto">
             <div className="px-6 mb-6">
                <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">RECRUITER HUB</p>
                <p className="text-sm font-bold text-slate-800 mt-2 truncate">{profile.companyName || 'My Company'}</p>
             </div>
             <nav className="space-y-2 px-4">
               <button
                 onClick={() => setEmployerTab('overview')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   employerTab === 'overview' 
                   ? 'bg-gradient-to-r from-slate-100 to-white text-slate-900 shadow-sm border border-slate-200' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <LayoutDashboard size={18} className={`mr-3 ${employerTab === 'overview' ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`} />
                 📊 Dashboard
               </button>
               <button
                 onClick={() => setEmployerTab('jobs')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   employerTab === 'jobs' 
                   ? 'bg-gradient-to-r from-slate-100 to-white text-slate-900 shadow-sm border border-slate-200' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Briefcase size={18} className={`mr-3 ${employerTab === 'jobs' ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`} />
                 📢 Active Missions
               </button>
               <button
                 onClick={() => setEmployerTab('candidates')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all group ${
                   employerTab === 'candidates' 
                   ? 'bg-gradient-to-r from-slate-100 to-white text-slate-900 shadow-sm border border-slate-200' 
                   : 'text-slate-600 hover:bg-slate-50 hover:pl-4'
                 }`}
               >
                 <Target size={18} className={`mr-3 ${employerTab === 'candidates' ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`} />
                 🎯 Talent Pool
               </button>
             </nav>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 scrollbar-hide">
          {userRole === 'seeker' ? (
             // ... (Existing Seeker Views) ...
             <>
              {activeTab === 'tracker' && (
                <div className="max-w-7xl mx-auto">
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                     <h2 className="text-xl font-bold text-slate-800">Mission Overview</h2>
                     <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {/* Search Bar */}
                        <div className="relative group w-64">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow focus:shadow-sm"
                            placeholder="Search applications..."
                          />
                        </div>
                        {/* View Toggles */}
                        <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <Kanban size={16} />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <ListIcon size={16} />
                          </button>
                        </div>
                     </div>
                   </div>

                   <SeekerAnalytics jobs={jobs} />

                   {viewMode === 'board' ? (
                      jobs.length === 0 ? (
                        <JobListView 
                          jobs={jobs} 
                          onStatusChange={handleStatusChange}
                          onAnalyze={(j) => setAnalyzingJob(j)}
                          onDelete={handleDeleteJob}
                          onAddJob={() => setIsAddModalOpen(true)}
                          onJobClick={(j) => setSelectedJob(j)}
                        />
                      ) : (
                        <div className="flex overflow-x-auto pb-4 space-x-6">
                           {Object.values(JobStatus).map((status) => {
                             const statusJobs = filteredJobs.filter(j => j.status === status);
                             return (
                               <div key={status} className="w-80 flex-shrink-0">
                                 <div className="mb-3 px-1 flex justify-between items-center">
                                   <h3 className="text-sm font-bold text-slate-700 uppercase">{status}</h3>
                                   <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">{statusJobs.length}</span>
                                 </div>
                                 <div className="space-y-3">
                                    {statusJobs.map(job => (
                                      <JobCard 
                                        key={job.id} 
                                        job={job} 
                                        onMove={handleMoveJob}
                                        onAnalyze={(j) => setAnalyzingJob(j)}
                                        onDelete={handleDeleteJob}
                                        onClick={(j) => setSelectedJob(j)}
                                      />
                                    ))}
                                 </div>
                               </div>
                             );
                           })}
                        </div>
                      )
                   ) : (
                     <JobListView 
                        jobs={filteredJobs} 
                        onStatusChange={handleStatusChange}
                        onAnalyze={(j) => setAnalyzingJob(j)}
                        onDelete={handleDeleteJob}
                        onAddJob={() => setIsAddModalOpen(true)}
                        onJobClick={(j) => setSelectedJob(j)}
                     />
                   )}
                </div>
              )}

              {activeTab === 'resumes' && (
                <ResumeSection 
                  resumes={resumes} 
                  onAddResume={handleAddResume}
                  onDeleteResume={handleDeleteResume}
                  onUpdateResume={handleUpdateResume}
                  onAnalyzeResume={handleAnalyzeResume}
                  plan={profile.plan}
                  scansUsed={profile.atsScansUsed}
                />
              )}
              
              {activeTab === 'alerts' && (
                <JobAlertsSection 
                  alerts={jobAlerts}
                  matchedJobs={matchedJobs}
                  onAddAlert={handleAddAlert}
                  onDeleteAlert={handleDeleteAlert}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSection 
                  profile={profile} 
                  onUpdate={setProfile}
                />
              )}

              {activeTab === 'agent' && (
                <div className="max-w-4xl mx-auto space-y-4">
                   <SeekerAnalytics jobs={jobs} />
                   <AIAgentSection jobs={jobs} profile={profile} />
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="max-w-7xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">{t.PRICING_TITLE}</h2>
                    <p className="text-slate-500">{t.PRICING_DESC}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pricingPlans.map((plan, idx) => (
                      <div key={idx} className={`p-6 rounded-2xl border ${plan.highlight ? 'border-indigo-600 shadow-lg ring-1 ring-indigo-600 bg-white' : 'border-slate-200 bg-white shadow-sm'} flex flex-col transition-all hover:shadow-md`}>
                        {/* ... (Existing Pricing Card Content) ... */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                          <div className="mt-2 flex items-baseline text-slate-900">
                            <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                            <span className="ml-1 text-sm font-medium text-slate-500">{t.PRICING_MONTH}</span>
                          </div>
                          {plan.description && <p className="mt-2 text-xs text-slate-500">{plan.description}</p>}
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start text-xs text-slate-600">
                              <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={handleUpgradeToPro}
                          className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
                        >
                          {plan.cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // --- EMPLOYER VIEW ---
            <div className="max-w-7xl mx-auto w-full h-full">
              {employerTab === 'overview' && (
                <EmployerDashboardSummary 
                  jobs={employerJobs}
                  applications={applications}
                  onNavigate={setEmployerTab}
                />
              )}

              {employerTab === 'jobs' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                     <div>
                        <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-center">
                            <span className="block text-xl font-bold text-slate-900">{employerJobs.length}</span>
                            <span className="text-xs text-slate-500 font-medium">Active</span>
                        </div>
                     </div>
                   </div>
                   
                   {employerJobs.length === 0 ? (
                     <div className="p-20 text-center">
                       <h3 className="text-lg font-medium text-slate-900">No jobs posted yet</h3>
                       <button 
                        onClick={() => setIsPostJobModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
                      >
                        Create Job Posting
                      </button>
                     </div>
                   ) : (
                     <div className="divide-y divide-slate-100">
                       {employerJobs.map((job) => (
                         <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                  job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {job.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                                 <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                                 <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                 <span className="flex items-center gap-1"><Users size={14} /> {applications.filter(a => a.jobId === job.id).length} Applicants</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => handleViewApplicants(job.id)}
                                 className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                               >
                                 View Applicants
                               </button>
                            </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              )}

              {employerTab === 'candidates' && (
                <EmployerCandidatesView 
                  jobs={employerJobs}
                  candidates={applications}
                  selectedJobId={selectedJobId}
                  onSelectJob={setSelectedJobId}
                  onUpdateStatus={handleUpdateCandidateStatus}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddJobModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddJob}
      />
      
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onPost={handlePostJob}
        isMandatory={isMandatoryJobPost}
      />
      
      {analyzingJob && (
        <AIAnalyzerModal
          job={analyzingJob}
          isOpen={!!analyzingJob}
          onClose={() => setAnalyzingJob(null)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* Job Detail Drawer (CRM) */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateJob={handleUpdateJobDetails}
      />

      {/* Signup Modal - Onboarding */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onComplete={handleSignupComplete}
      />

      <EmployerSignupModal
        isOpen={isEmployerSignupModalOpen}
        onClose={() => setIsEmployerSignupModalOpen(false)}
        onComplete={handleEmployerSignupComplete}
      />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      
      {/* Upgrade Limit Modal */}
      <UpgradeLimitModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgradeToPro}
        featureName="AI Resume Analysis"
      />
    </div>
  );

  switch (currentView) {
    case 'admin':
      return (
        <AdminDashboard 
          onLogout={handleLogout}
          liveUsers={registeredUsers}
          employerJobs={employerJobs}
          applications={applications}
          seekerJobs={jobs}
          seekerResumes={resumes}
          importedJobs={importedJobs}
          onImportJobs={handleAdminImportJobs}
        />
      );
    case 'pricing': return renderPricingPage();
    case 'dashboard': return renderDashboard();
    default: return renderLanding();
  }
};

export default App;
