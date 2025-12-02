
import React from 'react';
import { 
  Rocket, BrainCircuit, Chrome, FileText, CheckCircle, Zap, 
  BarChart3, LayoutDashboard, Target, Users, ArrowRight 
} from 'lucide-react';

interface FeaturesPageProps {
  onSignUp: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onSignUp }) => {
  return (
    <div className="bg-slate-50 font-sans">
      
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
               {/* INTERACTIVE KANBAN VISUAL */}
               <div className="bg-slate-800/50 rounded-xl p-4 h-[320px] flex gap-3 overflow-hidden relative">
                  {/* Column 1: Applied */}
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="h-1.5 w-12 bg-slate-600 rounded"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-sm border border-slate-600">
                        <div className="h-2 w-16 bg-slate-500 rounded mb-1"></div>
                        <div className="h-1.5 w-full bg-slate-600/50 rounded"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-sm border border-slate-600 opacity-60">
                        <div className="h-2 w-14 bg-slate-500 rounded mb-1"></div>
                        <div className="h-1.5 w-10 bg-slate-600/50 rounded"></div>
                     </div>
                  </div>

                  {/* Column 2: Interview */}
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="h-1.5 w-14 bg-slate-600 rounded"></div>
                     </div>
                     {/* Moving Card Simulation */}
                     <div className="bg-slate-700 p-2 rounded shadow-lg border-l-2 border-purple-500 animate-drift relative z-10">
                        <div className="h-2 w-20 bg-slate-300 rounded mb-2"></div>
                        <div className="h-1.5 w-full bg-slate-600/50 rounded mb-1"></div>
                        <div className="h-1.5 w-2/3 bg-slate-600/50 rounded"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-sm border border-slate-600">
                        <div className="h-2 w-10 bg-slate-500 rounded mb-1"></div>
                        <div className="h-1.5 w-12 bg-slate-600/50 rounded"></div>
                     </div>
                  </div>

                  {/* Column 3: Offer */}
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="h-1.5 w-10 bg-slate-600 rounded"></div>
                     </div>
                     <div className="bg-slate-700 p-2 rounded shadow-sm border-l-2 border-green-500">
                        <div className="h-2 w-12 bg-green-200/50 rounded mb-1"></div>
                        <div className="h-1.5 w-16 bg-slate-600/50 rounded"></div>
                     </div>
                  </div>

                  {/* Cursor Effect */}
                  <div className="absolute bottom-10 right-1/3 pointer-events-none opacity-50">
                     <div className="w-8 h-8 rounded-full bg-indigo-500/30 blur-lg animate-pulse"></div>
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
            <ul className="space-y-4">
              {[
                "Instant ATS Score (0-100)",
                "Keyword gap analysis based on Job Description",
                "Formatting & structure feedback",
                "Store multiple versions for different roles"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex justify-center">
             {/* ATS SCANNER VISUAL */}
             <div className="relative h-[300px] w-[260px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
                {/* Document */}
                <div className="absolute inset-4 bg-white rounded-md p-4 flex flex-col gap-2 opacity-90">
                   <div className="flex gap-3 mb-2">
                      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                      <div className="flex flex-col gap-1 justify-center">
                         <div className="h-2 w-20 bg-slate-800 rounded"></div>
                         <div className="h-1.5 w-12 bg-slate-400 rounded"></div>
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-slate-200 rounded mt-2"></div>
                   <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   <div className="h-1.5 w-2/3 bg-slate-200 rounded"></div>
                   
                   <div className="mt-4 h-2 w-16 bg-slate-800 rounded mb-1"></div>
                   <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   <div className="h-1.5 w-3/4 bg-slate-200 rounded"></div>

                   <div className="mt-4 h-2 w-12 bg-slate-800 rounded mb-1"></div>
                   <div className="flex gap-2 flex-wrap">
                      <div className="h-4 w-12 bg-slate-100 rounded border border-slate-200"></div>
                      <div className="h-4 w-16 bg-slate-100 rounded border border-slate-200"></div>
                      <div className="h-4 w-10 bg-slate-100 rounded border border-slate-200"></div>
                   </div>
                </div>

                {/* Scan Line */}
                <div className="absolute left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] z-20 animate-scan"></div>
                <div className="absolute inset-0 bg-green-500/10 z-10 pointer-events-none mix-blend-overlay"></div>

                {/* Popups */}
                <div className="absolute right-2 top-20 z-30">
                   <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-[float_3s_infinite] flex items-center gap-1">
                      <CheckCircle size={10} /> "React" Found
                   </div>
                </div>
                <div className="absolute left-2 bottom-12 z-30">
                   <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-[float_4s_infinite] flex items-center gap-1">
                      <Zap size={10} /> Missing: "TypeScript"
                   </div>
                </div>
                
                {/* Score */}
                <div className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur text-center py-2 border-t border-slate-800 z-30">
                   <span className="text-green-400 font-mono font-bold text-xl">85/100</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Extension */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
             <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="relative z-10">
                   <Chrome size={64} className="text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                   <h3 className="text-2xl font-bold text-white mb-2">Browser Extension</h3>
                   <p className="text-slate-400 mb-6">Available for Chrome, Edge, and Brave</p>
                   <div className="flex justify-center gap-2">
                      <div className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm font-bold border border-white/5">LinkedIn</div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm font-bold border border-white/5">Glints</div>
                      <div className="bg-white/10 px-4 py-2 rounded-lg text-white text-sm font-bold border border-white/5">JobStreet</div>
                   </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-colors"></div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
              <Chrome size={14} className="mr-2" /> 1-Click Save
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Save jobs from anywhere.</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              No more copying and pasting job titles. Our browser extension automatically captures job details, salaries, and descriptions from your favorite job boards.
            </p>
            <button 
              onClick={onSignUp}
              className="text-indigo-600 font-bold flex items-center hover:underline"
            >
              Get the Extension <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Benefits */}
      <div className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Why thousands choose RekrutIn</h2>
         </div>
         <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 col-span-1 md:col-span-2 hover:shadow-lg transition-shadow">
               <BrainCircuit size={32} className="text-indigo-600 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 mb-2">AI Career Agent</h3>
               <p className="text-slate-600">
                 A context-aware chatbot that knows your profile and your job applications. Ask it to draft cover letters, prepare interview questions, or analyze your skill gaps.
               </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl border border-indigo-500 text-white shadow-xl">
               <Target size={32} className="text-yellow-300 mb-4" />
               <h3 className="text-xl font-bold mb-2">Precision Targeting</h3>
               <p className="text-indigo-100">
                 Focus only on jobs where your fit score is >80%. Save time and increase response rates.
               </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
               <BarChart3 size={32} className="text-blue-600 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 mb-2">Success Analytics</h3>
               <p className="text-slate-600">
                 Visualize your funnel. See where you drop off (Application vs Interview) and fix it.
               </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 col-span-1 md:col-span-2 hover:shadow-lg transition-shadow">
               <Users size={32} className="text-pink-600 mb-4" />
               <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiter CRM</h3>
               <p className="text-slate-600">
                 Keep track of hiring managers' names, emails, and your communication history for every single application.
               </p>
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

    </div>
  );
};
