
import React, { useState } from 'react';
import { 
  Rocket, BrainCircuit, Chrome, FileText, CheckCircle, Zap, 
  BarChart3, Target, Users, ArrowRight, Menu, X, Bot
} from 'lucide-react';

interface FeaturesPageProps {
  onSignUp: () => void;
  onLogin: () => void;
  onEmployerSignup: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onSignUp, onLogin, onEmployerSignup }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'features'}))} className="font-bold text-indigo-600">Features</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'how-it-works'}))} className="font-medium text-slate-600 hover:text-indigo-600">How It Works</button>
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
    <div className="bg-slate-50 font-sans">
      <Navbar />
      
      {/* Hero Header */}
      <div className="pt-32 pb-16 px-4 text-center bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
          The Operating System for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Your Career Growth</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          RekrutIn isn't just a spreadsheet replacement. It's a suite of AI-powered tools designed to get you hired 85% faster.
        </p>
        <button 
          onClick={onSignUp}
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-transform hover:scale-105"
        >
          Get Started for Free
        </button>
      </div>

      {/* Feature 1: Tracker */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800 rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="bg-slate-800/50 rounded-xl p-4 h-[320px] flex gap-3 overflow-hidden relative">
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="h-1.5 w-12 bg-slate-600 rounded"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-sm border border-slate-600">
                        <div className="h-2 w-16 bg-slate-500 rounded mb-1"></div>
                        <div className="h-1.5 w-full bg-slate-600/50 rounded"></div>
                     </div>
                  </div>
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="h-1.5 w-14 bg-slate-600 rounded"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-lg border-l-2 border-purple-500 animate-drift relative z-10">
                        <div className="h-2 w-20 bg-slate-300 rounded mb-2"></div>
                        <div className="h-1.5 w-full bg-slate-600/50 rounded mb-1"></div>
                        <div className="h-1.5 w-2/3 bg-slate-600/50 rounded"></div>
                     </div>
                  </div>
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="h-1.5 w-10 bg-slate-600 rounded"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
              <Rocket size={14} className="mr-2" /> Application Tracker
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Stop losing track of your applications.</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Manual spreadsheets are prone to error. RekrutIn provides a centralized command center for every job you apply to.
            </p>
            <ul className="space-y-4">
              {[
                "Visualize progress with Kanban or List views",
                "Track deadlines for Online Assessments",
                "Set follow-up reminders automatically",
                "Log recruiter contacts and interview notes"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Feature 2: Resume AI */}
      <div className="py-20 px-4 max-w-7xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm my-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent -z-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
              <FileText size={14} className="mr-2" /> AI Resume Optimizer
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Beat the ATS with AI-driven insights.</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Don't let a robot reject your CV. Our ATS analyzer scores your resume against specific job descriptions and suggests keywords to improve it.
            </p>
          </div>
          <div className="relative flex justify-center">
             <div className="relative h-[300px] w-[260px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
                <div className="absolute inset-4 bg-white rounded-md p-4 flex flex-col gap-2 opacity-90">
                   <div className="h-1.5 w-full bg-slate-200 rounded mt-2"></div>
                   <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   <div className="h-1.5 w-2/3 bg-slate-200 rounded"></div>
                </div>
                <div className="absolute left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] z-20 animate-scan"></div>
                <div className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur text-center py-2 border-t border-slate-800 z-30">
                   <span className="text-green-400 font-mono font-bold text-xl">85/100</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-24 px-4 bg-slate-900 text-center">
         <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to upgrade your job search?
         </h2>
         <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
            Join thousands of candidates who are landing jobs faster with RekrutIn.ai.
         </p>
         <button 
            onClick={onSignUp}
            className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-all hover:-translate-y-1"
         >
            Start Your Free Trial
         </button>
      </div>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <p className="text-slate-500 text-sm">© 2025 RekrutIn.ai — Designed with 💡 in Indonesia</p>
        </div>
      </footer>
    </div>
  );
};
