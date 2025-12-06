
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, CheckCircle, BarChart3, Bot, Calendar, ArrowRight, 
  Linkedin, Github, Plus, LayoutDashboard, LogOut, ChevronDown, 
  Briefcase, Users, Search, List as ListIcon, Kanban, FileText, UserCircle, Sparkles, Bell, CreditCard,
  MapPin, TrendingUp, Rocket, Files, Zap, Target, Radar, Building2, ExternalLink, Trash2, BrainCircuit, Chrome
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
    atsScansUsed: 0
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
    // Check subscription limits
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
    
    // PERSIST TO SUPABASE
    if (supabase) {
      const { error } = await supabase.from('jobs').insert([newJob]);
      if (error) console.error("Failed to sync job to DB", error);
    }
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
      if (supabase) await supabase.from('jobs').update({ status: newStatus, timeline: updatedJob.timeline }).eq('id', job.id);
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
    if (supabase) await supabase.from('jobs').update({ status: newStatus, timeline: updatedJob.timeline }).eq('id', id);
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

  const handleUpdateJobDetails = async (id: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    setJobs(updatedJobs);
    
    if(selectedJob?.id === id) {
      setSelectedJob(prev => prev ? { ...prev, ...updates } : null);
    }
    
    if (supabase) {
      await supabase.from('jobs').update(updates).eq('id', id);
    }
  };

  const handleMarkAssessmentComplete = (jobId: string) => {
    handleUpdateJobDetails(jobId, {
        assessment: {
            // @ts-ignore: We need to access previous assessment state but cleaner to just use full update logic
            ...jobs.find(j => j.id === jobId)?.assessment!,
            status: 'Completed'
        }
    });
  };

  // --- Resume Actions ---
  const handleAddResume = async (resume: Resume) => {
    setResumes(prev => [resume, ...prev]);
    if (supabase) {
      const { error } = await supabase.from('resumes').insert([resume]);
      if(error) console.error("Failed to sync resume to DB", error);
    }
  };
  
  const handleDeleteResume = async (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (supabase) await supabase.from('resumes').delete().eq('id', id);
  };
  
  const handleUpdateResume = async (id: string, updates: Partial<Resume>) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    if (supabase) await supabase.from('resumes').update(updates).eq('id', id);
  };

  // Limit Check for ATS Analysis
  const handleAnalyzeResume = async (resume: Resume) => {
    if (!subscription.canUseAI) {
      setUpgradeFeatureName('Unlimited ATS Analysis');
      setIsUpgradeModalOpen(true);
      return;
    }
    try {
      const result = await analyzeResumeATS(resume.content);
      await handleUpdateResume(resume.id, {
        atsScore: result.score,
        atsAnalysis: result.feedback
      });
      setProfile(prev => {
        const updated = { ...prev, atsScansUsed: prev.atsScansUsed + 1 };
        if (supabase) {
           supabase.from('profiles').update({ ats_scans_used: updated.atsScansUsed }).eq('email', profile.email);
        }
        return updated;
      });
    } catch (error) {
      console.error("Analysis failed", error);
    }
  };

  const handlePaymentAndUpgrade = async (plan: PlanType = 'Pro') => {
    // 1. Create Checkout
    const session = await createCheckoutSession(plan, profile.email);
    // In a real app, window.location.href = session.checkoutUrl
    
    // 2. Simulate Success
    const updatedProfile = { ...profile, plan };
    setProfile(updatedProfile);
    setIsUpgradeModalOpen(false);
    
    if (supabase) {
      await supabase.from('profiles').update({ plan }).eq('email', profile.email);
    }
    
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: `Welcome to ${plan}! 🌟`,
      message: 'You now have unlocked premium features.',
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
    setUserDatabase(prev => [...prev, newProfile]);

    // 4. Close Signup and FORCE OPEN POST JOB MODAL (Rule 1)
    setIsEmployerSignupModalOpen(false);
    setIsMandatoryJobPost(true);
    setIsPostJobModalOpen(true);
  };

  // --- Admin Actions ---
  const handleAdminImportJobs = (newJobs: ExternalJobMatch[]) => {
    setImportedJobs(prev => [...newJobs, ...prev]);
  };

  const handleAdminDeleteUser = (email: string) => {
    setUserDatabase(prev => prev.filter(u => u.email !== email));
  };

  const handleAdminDeleteResume = (id: string) => {
    // For demo: if it matches a seeker resume, delete it
    if (resumes.some(r => r.id === id)) {
      handleDeleteResume(id);
    }
  };

  const handleAdminDeleteJob = (id: string) => {
    // For demo: if it matches a seeker tracked job
    if (jobs.some(j => j.id === id)) {
      handleDeleteJob(id);
    }
  };
  
  // --- Auth & Signup Flow ---
  const handleSignupComplete = async (newProfile: UserProfile, initialResume: Resume, password?: string) => {
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
    
    // Update Local State
    setProfile(completeProfile);
    setJobs([]); 
    setResumes([analyzedResume]);
    
    // PERSIST TO SUPABASE
    if (supabase && password) {
      try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newProfile.email,
          password: password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Insert Profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: newProfile.email,
            name: newProfile.name,
            title: newProfile.title,
            summary: newProfile.summary,
            skills: newProfile.skills,
            plan: 'Free',
            ats_scans_used: 1
          });
          if (profileError) console.error("Profile insert error", profileError);

          // 3. Insert Resume
          const { error: resumeError } = await supabase.from('resumes').insert({
            ...analyzedResume,
            user_id: authData.user.id
          });
          if (resumeError) console.error("Resume insert error", resumeError);
        }
      } catch (err) {
        console.error("Supabase Signup Error:", err);
        // Fallback handled by local state updates below
      }
    }
    
    // Fallback: Local Database
    setUserDatabase(prev => [...prev, completeProfile]);

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

  const handleLogin = async (email: string, password?: string) => {
    // ADMIN CHECK
    if (email === 'admin@rekrutin.ai') {
      setUserRole('admin');
      setCurrentView('admin');
      setIsLoginModalOpen(false);
      return;
    }

    let loginSuccess = false;

    // TRY SUPABASE LOGIN
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!error && data.user) {
          loginSuccess = true;
          
          // Fetch Profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileData) {
            // Map DB fields to State
            setProfile({
                name: profileData.name,
                title: profileData.title,
                email: profileData.email,
                summary: profileData.summary,
                skills: profileData.skills || [],
                plan: profileData.plan as PlanType,
                atsScansUsed: profileData.ats_scans_used || 0,
                extensionToken: profileData.extension_token
            });
          }

          // Fetch Jobs
          const { data: jobsData } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', data.user.id);
          if (jobsData) setJobs(jobsData as unknown as Job[]);

          // Fetch Resumes
          const { data: resumesData } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', data.user.id);
          if (resumesData) setResumes(resumesData as Resume[]);
        }
      } catch (err) {
        console.error("Supabase Login Error:", err);
      }
    }

    // FALLBACK: LOCAL DB CHECK
    if (!loginSuccess) {
        const foundUser = userDatabase.find(u => u.email === email);
        if (foundUser) {
            loginSuccess = true;
            setProfile(foundUser);
            // Restore User Data (Jobs, Resumes) from storage
            try {
                const savedData = localStorage.getItem(`rekrutin_data_${email}`);
                if (savedData) {
                const parsed = JSON.parse(savedData);
                setJobs(parsed.jobs || []);
                setResumes(parsed.resumes || []);
                setJobAlerts(parsed.alerts || []);
                } else {
                setJobs([]);
                setResumes([]);
                setJobAlerts([]);
                }
            } catch (e) { console.error("Error loading user data", e); }
        }
    }

    if (loginSuccess) {
      setIsLoginModalOpen(false);
      // Determine Role
      setUserRole('seeker'); // Default to seeker for now unless employer logic is robust
      setCurrentView('dashboard');
      setActiveTab('tracker');
    } else {
      alert("Account not found or incorrect password.");
      setIsLoginModalOpen(false);
    }
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setIsNotificationOpen(false);
    setIsMandatoryJobPost(false);
    if (supabase) supabase.auth.signOut();
    
    setProfile({
      name: 'Guest', title: '', email: '', summary: '', skills: [], plan: 'Free', atsScansUsed: 0
    });
    setJobs([]);
    setResumes([]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const handleExtensionJobAdded = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Extension Sync Success 🔗',
      message: `Successfully captured "${job.title}" from ${job.company}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system'
    }, ...prev]);
  };

  // ... (Navbar, renderScrollingJobRow, renderLanding, renderPricingPage remain the same except for wiring up buttons) ...
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
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-slate-600 font-bold text-xs px-2 py-1 hover:text-indigo-600"
            >
              {t.NAV_LOGIN}
            </button>
            <button 
              onClick={() => setIsSignupModalOpen(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
            >
              {t.NAV_SIGNUP}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <button 
              onClick={() => { setCurrentView('features'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-slate-600 font-medium py-2 hover:bg-slate-50 rounded-lg px-2"
            >
              {t.NAV_FEATURES}
            </button>
            <button 
              onClick={() => { setCurrentView('how-it-works'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-slate-600 font-medium py-2 hover:bg-slate-50 rounded-lg px-2"
            >
              {t.NAV_HOW_IT_WORKS}
            </button>
            <button 
              onClick={() => { setCurrentView('pricing'); setIsMobileMenuOpen(false); }} 
              className="block w-full text-left text-slate-600 font-medium py-2 hover:bg-slate-50 rounded-lg px-2"
            >
              {t.NAV_PRICING}
            </button>
            
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between px-2">
               <span className="text-slate-500 font-medium text-sm">Language / Bahasa</span>
               <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 transition-colors text-sm font-bold text-slate-700"
               >
                  <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇮🇩'}</span>
                  <span>{language === 'en' ? 'EN' : 'ID'}</span>
               </button>
            </div>
            
            <div className="border-t border-slate-100 pt-4 px-2">
                <button 
                onClick={() => setIsEmployerSignupModalOpen(true)}
                className="text-slate-500 hover:text-slate-800 font-semibold text-sm w-full text-left py-2"
              >
                {t.NAV_EMPLOYERS}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  const renderScrollingJobRow = (job: Job) => {
    // ... same as before
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
    // ... same as before, just updated Navbar usage is implicit
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* ... (Hero content same as existing) ... */}
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

          {/* ... (Search bar & Stats - Same as existing) ... */}
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
          {/* ... floating badges ... */}
        </div>
      </section>

      {/* ... Product Preview Section ... */}
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
                   <SeekerAnalytics jobs={INITIAL_JOBS} isPro={true} mode="summary" />
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

      {/* ... Features & Footer ... */}
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

  const renderFeaturesPage = () => (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FeaturesPage onSignUp={() => setIsSignupModalOpen(true)} />
    </div>
  );

  const renderHowItWorksPage = () => (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HowItWorksPage onSignUp={() => setIsSignupModalOpen(true)} />
    </div>
  );

  const renderPricingPage = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t.PRICING_TITLE}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16">{t.PRICING_DESC}</p>
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

  const renderDashboard = () => {
    if (userRole === 'employer') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                {/* Employer Navbar */}
                <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-slate-900">RekrutIn<span className="text-indigo-600">.Employer</span></span>
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-100">BETA</span>
                     </div>
                     <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-1">
                           <button 
                             onClick={() => setEmployerTab('overview')}
                             className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${employerTab === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                           >
                             Overview
                           </button>
                           <button 
                             onClick={() => setEmployerTab('jobs')}
                             className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${employerTab === 'jobs' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                           >
                             Job Postings
                           </button>
                           <button 
                             onClick={() => setEmployerTab('candidates')}
                             className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${employerTab === 'candidates' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                           >
                             Candidates
                           </button>
                        </nav>
                        <button 
                           onClick={() => setIsPostJobModalOpen(true)}
                           className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                           <Plus size={16} /> Post Job
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer" onClick={handleLogout} title="Logout">
                           {profile.companyName ? profile.companyName.charAt(0) : 'E'}
                        </div>
                     </div>
                </header>

                <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                    {employerTab === 'overview' || employerTab === 'jobs' ? (
                       <EmployerDashboardSummary 
                          jobs={employerJobs} 
                          applications={applications} 
                          onNavigate={setEmployerTab}
                       />
                    ) : (
                       <EmployerCandidatesView 
                          jobs={employerJobs} 
                          candidates={applications} 
                          selectedJobId={selectedJobId} 
                          onSelectJob={setSelectedJobId} 
                          onUpdateStatus={handleUpdateCandidateStatus}
                       />
                    )}
                </main>

                <PostJobModal 
                   isOpen={isPostJobModalOpen}
                   onClose={() => setIsPostJobModalOpen(false)}
                   onPost={handlePostJob}
                   isMandatory={isMandatoryJobPost}
                />
            </div>
        );
    }

    // Seeker Dashboard
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
             {/* Sidebar */}
             <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-100">
                   <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                     RekrutIn.ai
                   </span>
                </div>
                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                   <div className="mb-6 px-3">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                            {profile.name.charAt(0)}
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{profile.name}</p>
                            <p className="text-xs text-slate-500 truncate">{profile.title}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className={`w-2 h-2 rounded-full ${subscription.isPro ? 'bg-indigo-500' : 'bg-slate-400'}`}></span>
                          <span className="font-semibold text-slate-600">{subscription.plan} Plan</span>
                          {!subscription.isPro && (
                             <button onClick={() => setIsUpgradeModalOpen(true)} className="ml-auto text-indigo-600 font-bold hover:underline">Upgrade</button>
                          )}
                      </div>
                   </div>

                   <button 
                     onClick={() => setActiveTab('tracker')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tracker' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <LayoutDashboard size={18} /> {t.JOB_TRACKER}
                   </button>
                   <button 
                     onClick={() => setActiveTab('resumes')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'resumes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <FileText size={18} /> {t.RESUME_MANAGER}
                   </button>
                   <button 
                     onClick={() => setActiveTab('alerts')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <Bell size={18} /> {t.JOB_ALERTS}
                   </button>
                   <button 
                     onClick={() => setActiveTab('agent')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'agent' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <Sparkles size={18} /> {t.AI_AGENT}
                   </button>
                   <button 
                     onClick={() => setActiveTab('extension')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'extension' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <Chrome size={18} /> Extension
                   </button>
                   <button 
                     onClick={() => setActiveTab('profile')}
                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <UserCircle size={18} /> {t.MY_PROFILE}
                   </button>
                </div>
                <div className="p-4 border-t border-slate-200">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors w-full px-3 py-2 rounded-lg hover:bg-red-50">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
             </aside>

             {/* Main Content Area */}
             <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                 {/* Top Bar Mobile */}
                 <div className="md:hidden flex items-center justify-between mb-6">
                    <span className="text-lg font-extrabold text-indigo-600">RekrutIn</span>
                    <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsLoginModalOpen(true)}
                          className="text-slate-600 font-bold text-xs px-2 py-1 hover:text-indigo-600"
                        >
                          {t.NAV_LOGIN}
                        </button>
                        <button 
                          onClick={() => setIsSignupModalOpen(true)}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          {t.NAV_SIGNUP}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                           <Menu size={24} />
                        </button>
                    </div>
                 </div>
                 {/* Mobile Menu Overlay */}
                 {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-white p-4 animate-fade-in">
                        <div className="flex justify-end mb-4">
                           <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                        </div>
                        <nav className="space-y-2">
                           <button onClick={() => {setActiveTab('tracker'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg bg-slate-50 font-bold">Tracker</button>
                           <button onClick={() => {setActiveTab('resumes'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg bg-slate-50 font-bold">Resumes</button>
                           <button onClick={() => {setActiveTab('alerts'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg bg-slate-50 font-bold">Alerts</button>
                           <button onClick={() => {setActiveTab('agent'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg bg-slate-50 font-bold">AI Agent</button>
                           <button onClick={handleLogout} className="block w-full text-left py-3 px-4 rounded-lg bg-red-50 text-red-600 font-bold mt-8">Sign Out</button>
                        </nav>
                    </div>
                 )}

                 {/* Notifications Bell */}
                 <div className="flex justify-end mb-6 relative" ref={notificationRef}>
                    <button 
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all"
                    >
                       <Bell size={20} />
                       {notifications.some(n => !n.read) && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                       )}
                    </button>
                    
                    {isNotificationOpen && (
                       <div className="absolute top-10 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-30 animate-fade-in overflow-hidden">
                          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                             <h4 className="font-bold text-xs text-slate-700 uppercase">Notifications</h4>
                             {notifications.length > 0 && (
                                <button onClick={handleClearNotifications} className="text-xs text-indigo-600 hover:underline">Clear all</button>
                             )}
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                             {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                             ) : (
                                notifications.map(notif => (
                                   <div 
                                      key={notif.id} 
                                      className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : 'bg-indigo-50/30'}`}
                                      onClick={() => handleMarkNotificationRead(notif.id)}
                                   >
                                      <p className="text-sm font-bold text-slate-800 mb-0.5">{notif.title}</p>
                                      <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>
                                      <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                   </div>
                                ))
                             )}
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Tab Content */}
                 <div className="max-w-5xl mx-auto">
                    {activeTab === 'tracker' && (
                       <div className="space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div>
                                <h1 className="text-2xl font-bold text-slate-900">Job Application Tracker</h1>
                                <p className="text-slate-500 text-sm">Manage your pipeline and track every opportunity.</p>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                                   <button 
                                      onClick={() => setViewMode('list')}
                                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                      <ListIcon size={18} />
                                   </button>
                                   <button 
                                      onClick={() => setViewMode('board')}
                                      className={`p-1.5 rounded ${viewMode === 'board' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                      <Kanban size={18} />
                                   </button>
                                </div>
                                <button 
                                   onClick={() => setIsAddModalOpen(true)}
                                   className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                   <Plus size={18} /> Add Job
                                </button>
                             </div>
                          </div>

                          {/* Analytics Summary */}
                          <SeekerAnalytics jobs={jobs} isPro={subscription.isPro} mode="summary" />

                          {/* Search */}
                          <div className="relative">
                             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                                type="text" 
                                placeholder="Search your jobs..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                             />
                          </div>

                          {/* Assessment Tracker Widget */}
                          <AssessmentTracker 
                             jobs={jobs} 
                             onMarkComplete={handleMarkAssessmentComplete} 
                             onOpenJob={setSelectedJob} 
                          />

                          {/* Job List / Board */}
                          {viewMode === 'list' ? (
                             <JobListView 
                                jobs={filteredJobs} 
                                onStatusChange={handleStatusChange}
                                onAnalyze={(job) => { setAnalyzingJob(job); }}
                                onDelete={handleDeleteJob}
                                onAddJob={() => setIsAddModalOpen(true)}
                                onJobClick={setSelectedJob}
                             />
                          ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredJobs.map(job => (
                                   <JobCard 
                                      key={job.id} 
                                      job={job} 
                                      onMove={handleMoveJob}
                                      onAnalyze={(job) => { setAnalyzingJob(job); }}
                                      onDelete={handleDeleteJob}
                                      onClick={setSelectedJob}
                                   />
                                ))}
                             </div>
                          )}

                          {/* Analytics Chart (Bottom) */}
                          <SeekerAnalytics jobs={jobs} isPro={subscription.isPro} mode="chart" />
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

                    {activeTab === 'profile' && (
                       <ProfileSection profile={profile} onUpdate={(p) => { setProfile(p); }} />
                    )}

                    {activeTab === 'agent' && (
                       <div className="max-w-4xl mx-auto">
                          <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Career Agent</h1>
                          <p className="text-slate-500 mb-6 text-sm">Your personal career coach, powered by Gemini 2.5.</p>
                          <AIAgentSection jobs={jobs} profile={profile} />
                       </div>
                    )}

                    {activeTab === 'alerts' && (
                        <JobAlertsSection 
                           alerts={jobAlerts} 
                           matchedJobs={matchedJobs}
                           onAddAlert={handleAddAlert}
                           onDeleteAlert={handleDeleteAlert}
                        />
                    )}

                    {activeTab === 'extension' && (
                        <ExtensionPage 
                           profile={profile}
                           jobs={jobs}
                           onJobAdded={handleExtensionJobAdded}
                        />
                    )}
                 </div>
             </main>

             {/* Modals & Drawers */}
             <AddJobModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddJob}
             />

             {analyzingJob && (
                <AIAnalyzerModal 
                   job={analyzingJob}
                   isOpen={!!analyzingJob}
                   onClose={() => setAnalyzingJob(null)}
                   onAnalysisComplete={handleAnalysisComplete}
                />
             )}

             <JobDetailDrawer 
                job={selectedJob}
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                onUpdateJob={handleUpdateJobDetails}
                isPro={subscription.isPro}
                onUpgrade={() => {
                   setSelectedJob(null);
                   setIsUpgradeModalOpen(true);
                   setUpgradeFeatureName('AI Success Probability');
                }}
             />

             <UpgradeLimitModal 
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={() => handlePaymentAndUpgrade('Pro')}
                featureName={upgradeFeatureName}
             />
        </div>
    );
  };

  switch (currentView) {
    case 'admin':
      return (
        <AdminDashboard 
          onLogout={handleLogout}
          liveUsers={userDatabase.map(u => u.email)}
          employerJobs={employerJobs}
          applications={applications}
          seekerJobs={jobs}
          seekerResumes={resumes}
          importedJobs={importedJobs}
          onImportJobs={handleAdminImportJobs}
          onDeleteUser={handleAdminDeleteUser}
          onDeleteResume={handleAdminDeleteResume}
          onDeleteJob={handleAdminDeleteJob}
        />
      );
    case 'pricing': return renderPricingPage();
    case 'features': return renderFeaturesPage();
    case 'how-it-works': return renderHowItWorksPage();
    case 'dashboard': return renderDashboard();
    default: return renderLanding();
  }
};

export default App;
