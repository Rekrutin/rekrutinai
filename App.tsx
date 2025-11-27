import React, { useState, useEffect } from 'react';
import { 
  Menu, X, CheckCircle, BarChart3, Bot, Calendar, ArrowRight, 
  Linkedin, Github, Plus, LayoutDashboard, LogOut, ChevronDown, 
  Briefcase, Users, Search, List as ListIcon, Kanban, FileText, UserCircle, Sparkles
} from 'lucide-react';
import { Job, JobStatus, JobAnalysis, UserRole, EmployerJob, DashboardTab, UserProfile, Resume } from './types';
import { INITIAL_JOBS, FEATURES, PRICING_PLANS, INITIAL_EMPLOYER_JOBS } from './constants';
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
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [userRole, setUserRole] = useState<UserRole>('seeker');
  
  // Job Seeker State
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<DashboardTab>('tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null);

  // New Features State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    title: 'Software Engineer',
    email: 'alex@example.com',
    summary: 'Passionate developer with 5 years of experience in React and Node.js.',
    skills: ['React', 'TypeScript', 'Tailwind', 'Node.js']
  });
  const [resumes, setResumes] = useState<Resume[]>([
    { 
      id: '1', 
      name: 'Software Engineer CV', 
      content: 'Experience: 5 years React... Education: BSc CS...', 
      uploadDate: new Date().toISOString(),
      atsScore: 78,
      atsAnalysis: ['Good use of keywords', 'Add more quantifiable metrics']
    }
  ]);

  // Employer State
  const [employerJobs, setEmployerJobs] = useState<EmployerJob[]>(INITIAL_EMPLOYER_JOBS);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Supabase Fetch (Simulated)
  useEffect(() => {
    const fetchJobs = async () => {
      if (supabase) {
        if (userRole === 'seeker') {
          const { data, error } = await supabase.from('jobs').select('*');
          if (!error && data) setJobs(data as unknown as Job[]);
        } else {
          const { data, error } = await supabase.from('employer_jobs').select('*');
          if (!error && data) setEmployerJobs(data as unknown as EmployerJob[]);
        }
      }
    };
    fetchJobs();
  }, [userRole]);

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
      created_at: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
    if (supabase) await supabase.from('jobs').insert([newJob]);
  };

  const handleDeleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (supabase) await supabase.from('jobs').delete().eq('id', id);
  }

  const handleMoveJob = async (job: Job, direction: 'next' | 'prev') => {
    const statusOrder = Object.values(JobStatus);
    const currentIndex = statusOrder.indexOf(job.status);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const newStatus = statusOrder[newIndex];
      const updatedJobs = jobs.map(j => 
        j.id === job.id ? { ...j, status: newStatus } : j
      );
      setJobs(updatedJobs);
      if (supabase) await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    const updatedJobs = jobs.map(j => 
      j.id === id ? { ...j, status: newStatus } : j
    );
    setJobs(updatedJobs);
    if (supabase) await supabase.from('jobs').update({ status: newStatus }).eq('id', id);
  };

  const handleAnalysisComplete = async (jobId: string, analysis: JobAnalysis) => {
    const updatedJobs = jobs.map(j => 
      j.id === jobId ? { ...j, ai_analysis: analysis } : j
    );
    setJobs(updatedJobs);
    if (supabase) await supabase.from('jobs').update({ ai_analysis: analysis }).eq('id', jobId);
  };

  // --- Resume Actions ---
  const handleAddResume = (resume: Resume) => setResumes(prev => [resume, ...prev]);
  const handleDeleteResume = (id: string) => setResumes(prev => prev.filter(r => r.id !== id));
  const handleUpdateResume = (id: string, updates: Partial<Resume>) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
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
  }

  // --- Render Helpers ---

  const renderLanding = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                RekrutIn.ai
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
              <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              
              <div className="flex items-center space-x-2 border-l pl-6 border-slate-200">
                 <button 
                  onClick={() => {
                    setUserRole('seeker');
                    setCurrentView('dashboard');
                  }}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
                >
                  Job Seeker Login
                </button>
                 <button 
                  onClick={() => {
                    setUserRole('employer');
                    setCurrentView('dashboard');
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 text-sm"
                >
                  Employer Login
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
          Now supporting both Seekers and Employers
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Land Your Next Job <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Smarter, Not Harder.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          RekrutIn.ai helps candidates track applications and employers find top talent. The all-in-one recruitment platform powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              setUserRole('seeker');
              setCurrentView('dashboard');
            }}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center"
          >
            I'm a Job Seeker <ArrowRight className="ml-2" size={20} />
          </button>
           <button 
            onClick={() => {
              setUserRole('employer');
              setCurrentView('dashboard');
            }}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
          >
            I'm an Employer
          </button>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl shadow-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
              </div>
              <div className="p-4 md:p-8 bg-slate-50/50">
                 <SeekerAnalytics jobs={INITIAL_JOBS} />
                 <JobListView 
                    jobs={INITIAL_JOBS} 
                    onStatusChange={() => {}} 
                    onAnalyze={() => {}} 
                    onDelete={() => {}} 
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Plan</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_PLANS.map((plan, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border ${plan.highlight ? 'border-indigo-600 shadow-xl ring-4 ring-indigo-50' : 'border-slate-200 bg-slate-50'} flex flex-col`}>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start text-xs text-slate-700">
                      <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    setUserRole('seeker');
                    setCurrentView('dashboard');
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm ${plan.highlight ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 border'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('landing')}>
            <span className="text-xl font-bold text-indigo-600 mr-8 hidden md:block">RekrutIn.ai</span>
            
            {/* Role Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setUserRole('seeker')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  userRole === 'seeker' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Job Seeker
              </button>
              <button 
                onClick={() => setUserRole('employer')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  userRole === 'employer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Employer
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
            
            <button onClick={() => setCurrentView('landing')} className="text-slate-400 hover:text-slate-600 ml-4">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar Layout */}
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full overflow-hidden">
        
        {/* Job Seeker Sidebar */}
        {userRole === 'seeker' && (
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col pt-6 pb-6">
             <nav className="space-y-1 px-3">
               <button
                 onClick={() => setActiveTab('tracker')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === 'tracker' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <LayoutDashboard size={18} className="mr-3" />
                 Job Tracker
               </button>
               <button
                 onClick={() => setActiveTab('resumes')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === 'resumes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <FileText size={18} className="mr-3" />
                 Resume Manager
               </button>
               <button
                 onClick={() => setActiveTab('profile')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <UserCircle size={18} className="mr-3" />
                 My Profile
               </button>
               <button
                 onClick={() => setActiveTab('agent')}
                 className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === 'agent' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <Sparkles size={18} className="mr-3" />
                 AI Career Agent
               </button>
             </nav>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50/50 p-6">
          {userRole === 'seeker' ? (
            <>
              {activeTab === 'tracker' && (
                <div className="max-w-7xl mx-auto">
                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                     <h2 className="text-xl font-bold text-slate-800">Overview</h2>
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
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
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
                                    />
                                  ))}
                               </div>
                             </div>
                           );
                         })}
                      </div>
                   ) : (
                     <JobListView 
                        jobs={filteredJobs} 
                        onStatusChange={handleStatusChange}
                        onAnalyze={(j) => setAnalyzingJob(j)}
                        onDelete={handleDeleteJob}
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
            </>
          ) : (
            // --- EMPLOYER VIEW ---
            <div className="max-w-7xl mx-auto w-full">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <div>
                      <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
                   </div>
                   <div className="px-4 py-2 bg-slate-50 rounded-lg text-center">
                      <span className="block text-xl font-bold text-slate-900">{employerJobs.length}</span>
                      <span className="text-xs text-slate-500 font-medium">Active</span>
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
                               <span className="flex items-center gap-1"><Users size={14} /> {job.applicants_count} Applicants</span>
                            </div>
                          </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
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
      />
      
      {analyzingJob && (
        <AIAnalyzerModal
          job={analyzingJob}
          isOpen={!!analyzingJob}
          onClose={() => setAnalyzingJob(null)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </div>
  );

  return currentView === 'landing' ? renderLanding() : renderDashboard();
};

export default App;