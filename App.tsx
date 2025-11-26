import React, { useState, useEffect } from 'react';
import { 
  Menu, X, CheckCircle, BarChart3, Bot, Calendar, ArrowRight, 
  Linkedin, Github, Plus, LayoutDashboard, LogOut, ChevronDown 
} from 'lucide-react';
import { Job, JobStatus, JobAnalysis } from './types';
import { INITIAL_JOBS, FEATURES, PRICING_PLANS } from './constants';
import { supabase } from './services/supabaseClient';
import { JobCard } from './components/JobCard';
import { AddJobModal } from './components/AddJobModal';
import { AIAnalyzerModal } from './components/AIAnalyzerModal';

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
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analyzingJob, setAnalyzingJob] = useState<Job | null>(null);

  // Supabase Fetch (Simulated for this demo structure if keys are missing)
  useEffect(() => {
    const fetchJobs = async () => {
      if (supabase) {
        const { data, error } = await supabase.from('jobs').select('*');
        if (!error && data) {
           setJobs(data as unknown as Job[]);
        }
      }
    };
    fetchJobs();
  }, []);

  const handleAddJob = async (newJobData: Omit<Job, 'id' | 'created_at'>) => {
    const newJob: Job = {
      ...newJobData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);

    // Persist to Supabase if available
    if (supabase) {
      await supabase.from('jobs').insert([newJob]);
    }
  };

  const handleDeleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (supabase) {
      await supabase.from('jobs').delete().eq('id', id);
    }
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

      if (supabase) {
        await supabase.from('jobs').update({ status: newStatus }).eq('id', job.id);
      }
    }
  };

  const handleAnalysisComplete = async (jobId: string, analysis: JobAnalysis) => {
    const updatedJobs = jobs.map(j => 
      j.id === jobId ? { ...j, ai_analysis: analysis } : j
    );
    setJobs(updatedJobs);
    
    if (supabase) {
      await supabase.from('jobs').update({ ai_analysis: analysis }).eq('id', jobId);
    }
  };

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
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How It Works</a>
              <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4">
             <a href="#how-it-works" className="block py-2 text-slate-600 font-medium">How It Works</a>
             <a href="#features" className="block py-2 text-slate-600 font-medium">Features</a>
             <a href="#pricing" className="block py-2 text-slate-600 font-medium">Pricing</a>
             <button 
                onClick={() => {
                  setCurrentView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-semibold"
              >
                Get Started
              </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
          Now available for early access
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Land Your Next Job — <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Smarter, Not Harder.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          RekrutIn.ai membantu kamu melacak, menganalisis, dan mengoptimasi semua lamaran kerja. AI yang bantu kamu direkrut lebih cepat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center"
          >
            Get Started for Free <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
        
        {/* Abstract UI representation */}
        <div className="mt-16 relative mx-auto max-w-4xl">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 blur-3xl opacity-20 rounded-full transform scale-90"></div>
           <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-200 p-3 flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="p-6 grid grid-cols-3 gap-4 h-64 bg-slate-50/50">
               <div className="bg-slate-100 rounded-lg p-3 animate-pulse"></div>
               <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                  <div className="h-4 bg-indigo-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-indigo-100 rounded w-1/2"></div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                  </div>
               </div>
               <div className="bg-slate-100 rounded-lg p-3"></div>
             </div>
           </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How RekrutIn.ai Works</h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Auto Track', desc: 'Install our Chrome Extension — every time you apply on LinkedIn or Glints, RekrutIn.ai logs the job automatically.', step: '1' },
              { title: 'AI Analyze', desc: 'Our AI scans your CV and the job description, giving you a fit score and suggestions to improve your chances.', step: '2' },
              { title: 'Track & Win', desc: 'View all your applications in one place, monitor progress, and discover patterns that help you land interviews faster.', step: '3' }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all hover:shadow-lg group">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-indigo-600 text-white text-xl font-bold flex items-center justify-center rounded-xl shadow-lg">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Everything You Need to <br/> Stay Organized
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Whether you’re applying to 5 or 50 jobs, RekrutIn.ai gives you the clarity, analytics, and AI tools to stay ahead.
              </p>
              
              <div className="space-y-6">
                {FEATURES.map((feature, idx) => {
                  const Icon = { BarChart3, Bot, Calendar }[feature.icon] || CheckCircle;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{feature.title}</h4>
                        <p className="text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl p-1 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-[20px] overflow-hidden h-96 flex items-center justify-center text-slate-300">
                   {/* Simplified Dashboard visual */}
                   <div className="w-full h-full p-4 grid grid-cols-2 gap-4">
                      <div className="bg-slate-100 rounded-lg"></div>
                      <div className="bg-slate-100 rounded-lg"></div>
                      <div className="bg-slate-100 rounded-lg col-span-2 mt-4 h-32"></div>
                   </div>
                </div>
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
            <p className="text-slate-600 mt-4">Simple pricing for serious job seekers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border ${plan.highlight ? 'border-indigo-600 shadow-xl ring-4 ring-indigo-50 relative' : 'border-slate-200 bg-slate-50'} flex flex-col`}>
                {plan.highlight && (
                  <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                    : 'bg-white text-slate-900 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold text-white">RekrutIn.ai</span>
            <p className="mt-2 text-sm">Designed with 💡 in Indonesia</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
          <p className="mt-4 md:mt-0 text-sm">© 2025 RekrutIn.ai</p>
        </div>
      </footer>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('landing')}>
            <span className="text-xl font-bold text-indigo-600 mr-8">RekrutIn.ai</span>
            <nav className="hidden md:flex space-x-4">
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-md">Board</a>
              <a href="#" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={16} className="mr-2" /> New Job
            </button>
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
              JS
            </div>
            <button onClick={() => setCurrentView('landing')} className="text-slate-400 hover:text-slate-600">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full p-6 min-w-[1200px] inline-flex space-x-6 align-top">
          {Object.values(JobStatus).map((status) => {
             const statusJobs = jobs.filter(j => j.status === status);
             
             // Color coding for columns
             const colColors: Record<string, string> = {
               [JobStatus.SAVED]: 'bg-slate-200',
               [JobStatus.APPLIED]: 'bg-blue-100 text-blue-800',
               [JobStatus.INTERVIEW]: 'bg-purple-100 text-purple-800',
               [JobStatus.OFFER]: 'bg-green-100 text-green-800',
               [JobStatus.REJECTED]: 'bg-red-50 text-red-800',
             };

             return (
               <div key={status} className="w-80 flex flex-col h-[calc(100vh-140px)]">
                 <div className="flex items-center justify-between mb-3 px-1">
                   <div className="flex items-center">
                     <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{status}</h3>
                     <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${colColors[status] || 'bg-slate-200'}`}>
                       {statusJobs.length}
                     </span>
                   </div>
                 </div>
                 
                 <div className="flex-1 bg-slate-200/50 rounded-xl p-2 overflow-y-auto scrollbar-hide">
                   {statusJobs.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                       <LayoutDashboard size={32} strokeWidth={1} />
                       <span className="text-sm mt-2">No jobs</span>
                     </div>
                   ) : (
                     statusJobs.map(job => (
                       <JobCard 
                         key={job.id} 
                         job={job} 
                         onMove={handleMoveJob}
                         onAnalyze={(j) => setAnalyzingJob(j)}
                         onDelete={handleDeleteJob}
                       />
                     ))
                   )}
                 </div>
               </div>
             );
          })}
        </div>
      </main>

      {/* Modals */}
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
    </div>
  );

  return currentView === 'landing' ? renderLanding() : renderDashboard();
};

export default App;