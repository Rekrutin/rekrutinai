
import React, { useState } from 'react';
import { 
  Rocket, BrainCircuit, Chrome, Target, CheckCircle, 
  ArrowRight, Layout, MessageSquare, Zap, Menu, X, Sparkles, Bot, Globe
} from 'lucide-react';

interface HowItWorksPageProps {
  onSignUp: () => void;
  onLogin: () => void;
  onEmployerSignup: () => void;
  onNavigate?: (view: any) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onSignUp, onLogin, onEmployerSignup, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Consistent Navbar for sub-pages
  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span 
              onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'landing'}))}
              className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 cursor-pointer"
            >
              RekrutIn.ai
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'features'}))} className="font-medium text-slate-600 hover:text-indigo-600">Features</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'how-it-works'}))} className="font-bold text-indigo-600">How It Works</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'pricing'}))} className="font-medium text-slate-600 hover:text-indigo-600">Pricing</button>
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
               <button onClick={onEmployerSignup} className="bg-black text-white font-bold px-4 py-2 text-sm rounded-md transition-colors hover:bg-slate-800">For Employers</button>
               <button onClick={onLogin} className="text-slate-600 hover:text-indigo-600 font-bold px-4 py-2 text-sm transition-colors">Login</button>
               <button onClick={onSignUp} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/20 text-sm">Sign Up</button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="bg-white font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 text-center bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6 shadow-sm">
            <Zap size={14} className="mr-2 text-indigo-500" /> The RekrutIn Workflow
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            From Application to Offer <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">in 4 Simple Steps</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We've deconstructed the hiring process into a science. Here is exactly how RekrutIn helps you win.
          </p>
        </div>
      </div>

      {/* Step 1: Capture & Centralize */}
      <div className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                    <Chrome size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-3xl font-extrabold text-slate-900">Capture & Centralize</h3>
                </div>
             </div>
             <p className="text-xl text-slate-600 mb-8 leading-relaxed">
               The chaos starts when you have 20 tabs open. RekrutIn consolidates everything into one powerful command center.
             </p>
             <ul className="space-y-5">
               <li className="flex gap-4">
                 <div className="mt-1 bg-blue-50 p-1.5 rounded-lg text-blue-600 h-fit border border-blue-100"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">One-Click Save</h4>
                   <p className="text-slate-500">Our extension works on LinkedIn, Glints, and JobStreet. Scrape salaries and descriptions instantly.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-blue-50 p-1.5 rounded-lg text-blue-600 h-fit border border-blue-100"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">Unified View</h4>
                   <p className="text-slate-500">Every application, no matter the source, is formatted and organized in your private dashboard.</p>
                 </div>
               </li>
             </ul>
          </div>
          
          {/* Visual: Browser Extension Mock based on Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] opacity-10 blur-2xl transition duration-1000 group-hover:opacity-20"></div>
            <div className="bg-[#1e1e2e] rounded-2xl p-0 shadow-2xl relative overflow-hidden border border-slate-700/50">
                {/* Browser Bar */}
                <div className="flex items-center gap-3 bg-[#2b2b3b] px-4 py-3 border-b border-slate-800">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    {/* Fixed: Globe icon added to lucide-react import */}
                    <div className="flex-1 max-w-md mx-auto bg-[#1e1e2e] rounded-lg px-4 py-1.5 text-xs text-slate-400 font-mono flex items-center gap-2 border border-slate-700/50">
                        <Globe size={10} className="text-slate-500" />
                        linkedin.com/jobs/view/3821094...
                    </div>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles size={16} className="text-white" />
                    </div>
                </div>
                
                {/* Webpage Content Representation */}
                <div className="bg-white p-8 min-h-[340px] relative">
                    <div className="max-w-xs space-y-4">
                        <div className="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
                        <div className="h-4 w-1/2 bg-slate-50 rounded-lg"></div>
                        <div className="pt-6 space-y-3">
                            <div className="h-2 w-full bg-slate-50 rounded"></div>
                            <div className="h-2 w-full bg-slate-50 rounded"></div>
                            <div className="h-2 w-5/6 bg-slate-50 rounded"></div>
                        </div>
                    </div>
                    
                    {/* RekrutIn Extension Card */}
                    <div className="absolute top-8 right-8 w-64 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-5 animate-float border-t-4 border-t-indigo-600">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <span className="text-sm font-extrabold text-slate-800">RekrutIn AI</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="space-y-3 mb-5">
                            <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                            <div className="h-2 w-full bg-slate-50 rounded"></div>
                        </div>
                        <button className="w-full bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                            Track Application
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Analyze & Optimize */}
      <div className="py-24 px-4 max-w-7xl mx-auto bg-slate-50 rounded-[3rem] my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative flex justify-center">
             <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <BrainCircuit size={20} />
                        </div>
                        <h4 className="font-bold text-slate-800">AI Match Score</h4>
                   </div>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">85% Match</span>
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                         <span>Hard Skills Alignment</span>
                         <span className="text-indigo-600">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                         <div className="bg-indigo-600 h-3 rounded-full w-[92%] transition-all duration-1000"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                         <span>Experience Relevance</span>
                         <span className="text-purple-600">74%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                         <div className="bg-purple-600 h-3 rounded-full w-[74%] transition-all duration-1000 delay-300"></div>
                      </div>
                   </div>
                </div>
                <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 blur-2xl rounded-full"></div>
                   <p className="text-sm text-indigo-900 font-bold flex gap-2 relative z-10">
                      <Sparkles size={16} className="text-indigo-500" /> AI Recommendation:
                   </p>
                   <p className="text-sm text-indigo-700 mt-1 leading-relaxed">Mention "Strategic Planning" to increase your score by 12%.</p>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-200">
                    <BrainCircuit size={24} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">Analyze & Optimize</h3>
             </div>
             <p className="text-xl text-slate-600 mb-8 leading-relaxed">
               Don't apply blindly. Our AI compares your resume against the job description to predict your success before you even hit send.
             </p>
             <ul className="space-y-5">
               <li className="flex gap-4">
                 <div className="mt-1 bg-purple-50 p-1.5 rounded-lg text-purple-600 border border-purple-100 h-fit"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">Gap Detection</h4>
                   <p className="text-slate-500">We highlight keywords and skills that the ATS bots are looking for but you missed.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-purple-50 p-1.5 rounded-lg text-purple-600 border border-purple-100 h-fit"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">Instant Rewriter</h4>
                   <p className="text-slate-500">Generate a tailored cover letter that bridges your gaps and tells a compelling story.</p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </div>

      {/* Step 3: Organize & Track */}
      <div className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                    <Layout size={24} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900">Organize & Track</h3>
             </div>
             <p className="text-xl text-slate-600 mb-8 leading-relaxed">
               Visualizing your progress makes the job hunt feel less overwhelming. Track every stage with clarity.
             </p>
             <ul className="space-y-5">
               <li className="flex gap-4">
                 <div className="mt-1 bg-indigo-50 p-1.5 rounded-lg text-indigo-600 border border-indigo-100 h-fit"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">Smart Timeline</h4>
                   <p className="text-slate-500">Move jobs through "Applied", "Interview", and "Offer" status. It's progress you can see.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-indigo-50 p-1.5 rounded-lg text-indigo-600 border border-indigo-100 h-fit"><CheckCircle size={18} /></div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-lg">Reminders</h4>
                   <p className="text-slate-500">We'll nudge you when it's time to send a thank-you note or follow up with a recruiter.</p>
                 </div>
               </li>
             </ul>
          </div>
          
          {/* Visual: Pipeline Mock */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 relative overflow-hidden h-[360px] group">
             <div className="flex gap-6 h-full">
                <div className="w-1/3 flex flex-col gap-4">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applied</div>
                   <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-40"></div>
                   <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"></div>
                </div>
                <div className="w-1/3 flex flex-col gap-4">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview</div>
                   <div className="bg-white p-4 rounded-xl border-l-4 border-l-indigo-500 shadow-xl animate-drift z-10">
                      <div className="h-2 w-16 bg-slate-800 rounded mb-2"></div>
                      <div className="h-1.5 w-full bg-slate-100 rounded"></div>
                   </div>
                </div>
                <div className="w-1/3 flex flex-col gap-4">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offer</div>
                   <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-20"></div>
                </div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Step 4: Execute & Win */}
      <div className="py-24 px-4 max-w-7xl mx-auto bg-slate-900 text-white rounded-[3rem] mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/40 to-transparent"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1 flex justify-center">
             <div className="w-full max-w-md bg-slate-800/80 backdrop-blur rounded-3xl p-6 border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                   <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                      <Target size={24} className="text-indigo-400" />
                   </div>
                   <div>
                      <h4 className="font-extrabold text-lg">Interview Agent</h4>
                      <p className="text-xs text-green-400 font-bold flex items-center gap-1.5 uppercase">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Analysis Ready
                      </p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex gap-3">
                      <div className="px-4 py-3 bg-slate-700 rounded-2xl rounded-tl-none text-sm text-slate-200">
                         What should I prepare for my Google PM interview?
                      </div>
                   </div>
                   <div className="flex gap-3 justify-end">
                      <div className="px-4 py-3 bg-indigo-600 rounded-2xl rounded-tr-none text-sm text-white shadow-lg shadow-indigo-900/50">
                         Based on your profile, focus on: 1. Strategic Prioritization and 2. Stakeholder Management. I've drafted 5 practice questions for you...
                      </div>
                   </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                   <div className="h-12 bg-slate-700/50 rounded-xl w-full animate-pulse border border-slate-600/30"></div>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2">
             <h3 className="text-4xl font-extrabold mb-8 flex items-center gap-3">
               <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 border border-green-500/30">
                 <Target size={24} />
               </div>
               Execute & Win
             </h3>
             <p className="text-xl text-slate-400 mb-10 leading-relaxed">
               The final mile is the hardest. RekrutIn gives you the edge with data-backed preparation tools.
             </p>
             <ul className="space-y-6 mb-10">
               <li className="flex gap-4 items-start">
                 <CheckCircle size={24} className="text-green-400 mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-white text-xl">Interview Simulator</h4>
                   <p className="text-slate-400">Practice role-specific questions generated by AI based on the job description.</p>
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <CheckCircle size={24} className="text-green-400 mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-white text-xl">Salary Intelligence</h4>
                   <p className="text-slate-400">Negotiate with confidence using real-time salary benchmarks for your target role.</p>
                 </div>
               </li>
             </ul>
             <button 
               onClick={onSignUp}
               className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-slate-200 transition-all hover:scale-105 shadow-xl flex items-center gap-2 group"
             >
               Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 px-4 max-w-4xl mx-auto">
         <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-16">Frequently Asked Questions</h2>
         <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:bg-white hover:shadow-xl transition-all">
               <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-3">
                  <MessageSquare size={20} className="text-indigo-500" />
                  Is RekrutIn really free?
               </h3>
               <p className="text-slate-600 leading-relaxed">
                  Yes! Our Starter plan allows you to track up to 30 applications and use the browser extension 20 times. For power users, our Pro and Accelerator plans offer unlimited everything.
               </p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:bg-white hover:shadow-xl transition-all">
               <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-3">
                  <MessageSquare size={20} className="text-indigo-500" />
                  How secure is my data?
               </h3>
               <p className="text-slate-600 leading-relaxed">
                  Your privacy is our priority. We encrypt your data and never sell it to third parties. We use your information solely to provide personalized AI career advice.
               </p>
            </div>
         </div>
      </div>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <p className="text-slate-500 text-sm">© 2025 RekrutIn.ai — Designed with 💡 in Indonesia</p>
        </div>
      </footer>
    </div>
  );
};
