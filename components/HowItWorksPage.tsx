
import React from 'react';
import { 
  Rocket, BrainCircuit, Chrome, Target, CheckCircle, 
  ArrowRight, Search, Layout, MessageSquare, Zap 
} from 'lucide-react';

interface HowItWorksPageProps {
  onSignUp: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onSignUp }) => {
  return (
    <div className="bg-white font-sans">
      
      {/* Hero */}
      <div className="pt-32 pb-20 px-4 text-center bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <Zap size={14} className="mr-2" /> The RekrutIn Workflow
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            From Application to Offer <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">in 4 Simple Steps</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We've deconstructed the hiring process into a science. Here is exactly how RekrutIn helps you win.
          </p>
        </div>
      </div>

      {/* Step 1: Capture */}
      <div className="py-24 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -left-12 -top-12 text-[120px] font-black text-slate-100 -z-10 select-none">01</div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                 <Chrome size={20} />
               </div>
               Capture & Centralize
             </h3>
             <p className="text-lg text-slate-600 mb-6 leading-relaxed">
               The chaos starts when you have 20 tabs open. RekrutIn consolidates everything.
             </p>
             <ul className="space-y-4">
               <li className="flex gap-4">
                 <div className="mt-1 bg-blue-50 p-1 rounded text-blue-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">One-Click Save</h4>
                   <p className="text-slate-500 text-sm">Use our extension on LinkedIn, Glints, or JobStreet. We scrape the salary, description, and role instantly.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-blue-50 p-1 rounded text-blue-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">Manual Entry</h4>
                   <p className="text-slate-500 text-sm">Have a unique link? Paste it into the dashboard, and we'll format it for you.</p>
                 </div>
               </li>
             </ul>
          </div>
          
          {/* Visual: Browser Extension Mock */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
             {/* Browser Bar */}
             <div className="flex items-center gap-2 mb-4 bg-slate-800 p-3 rounded-lg">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 bg-slate-900 rounded px-3 py-1 text-xs text-slate-400 font-mono text-center">
                   linkedin.com/jobs/view/382...
                </div>
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                   <img src="https://via.placeholder.com/20" className="w-4 h-4 rounded-full" alt="R" />
                </div>
             </div>
             
             {/* Webpage Content */}
             <div className="bg-white rounded-lg p-4 h-[200px] relative">
                <div className="h-4 w-1/3 bg-slate-800 rounded mb-2"></div>
                <div className="h-3 w-1/4 bg-slate-400 rounded mb-6"></div>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-slate-200 rounded"></div>
                   <div className="h-2 w-full bg-slate-200 rounded"></div>
                   <div className="h-2 w-2/3 bg-slate-200 rounded"></div>
                </div>
                
                {/* Extension Popup Animation */}
                <div className="absolute top-2 right-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg p-3 animate-[float_4s_infinite]">
                   <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                      <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                      <span className="text-xs font-bold text-slate-800">RekrutIn</span>
                   </div>
                   <div className="h-2 w-20 bg-slate-200 rounded mb-1"></div>
                   <div className="h-2 w-16 bg-slate-100 rounded mb-3"></div>
                   <button className="w-full bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded">
                      Track Job
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Step 2: Analyze */}
      <div className="py-24 px-4 max-w-7xl mx-auto border-b border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative flex justify-center">
             {/* Visual: Analysis Radar */}
             <div className="w-[320px] bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="font-bold text-slate-800">Fit Analysis</h4>
                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">85% Match</span>
                </div>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                         <span>Hard Skills</span>
                         <span>90%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                         <div className="bg-indigo-500 h-2 rounded-full w-[90%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                         <span>Experience</span>
                         <span>70%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                         <div className="bg-purple-500 h-2 rounded-full w-[70%]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                         <span>Keywords</span>
                         <span>100%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                         <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                   </div>
                </div>
                <div className="mt-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                   <p className="text-xs text-yellow-800 font-medium flex gap-2">
                      <Zap size={14} /> Tip: Add "GraphQL" to your skills section.
                   </p>
                </div>
             </div>
          </div>

          <div className="order-1 md:order-2 relative">
             <div className="absolute -left-12 -top-12 text-[120px] font-black text-slate-200 -z-10 select-none">02</div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                 <BrainCircuit size={20} />
               </div>
               Analyze & Optimize
             </h3>
             <p className="text-lg text-slate-600 mb-6 leading-relaxed">
               Don't apply blindly. Our AI compares your resume against the specific job description to predict your success.
             </p>
             <ul className="space-y-4">
               <li className="flex gap-4">
                 <div className="mt-1 bg-purple-50 p-1 rounded text-purple-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">Gap Detection</h4>
                   <p className="text-slate-500 text-sm">We highlight missing keywords that the Applicant Tracking System (ATS) is looking for.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-purple-50 p-1 rounded text-purple-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">AI Cover Letter</h4>
                   <p className="text-slate-500 text-sm">Generate a tailored cover letter that bridges your skill gaps in seconds.</p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </div>

      {/* Step 3: Organize */}
      <div className="py-24 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -left-12 -top-12 text-[120px] font-black text-slate-100 -z-10 select-none">03</div>
             <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                 <Layout size={20} />
               </div>
               Organize & Track
             </h3>
             <p className="text-lg text-slate-600 mb-6 leading-relaxed">
               Move applications through the pipeline visually. Never forget a follow-up or a deadline.
             </p>
             <ul className="space-y-4">
               <li className="flex gap-4">
                 <div className="mt-1 bg-indigo-50 p-1 rounded text-indigo-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">Drag-and-Drop Pipeline</h4>
                   <p className="text-slate-500 text-sm">Move jobs from "Applied" to "Interview" to "Offer". It feels like progress.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 bg-indigo-50 p-1 rounded text-indigo-600 h-fit"><CheckCircle size={16} /></div>
                 <div>
                   <h4 className="font-bold text-slate-800">Smart Reminders</h4>
                   <p className="text-slate-500 text-sm">We'll nudge you when it's time to send a thank-you email or check in with a recruiter.</p>
                 </div>
               </li>
             </ul>
          </div>
          
          {/* Visual: Kanban Animation */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden h-[300px]">
             <div className="flex gap-4 h-full">
                {/* Column 1 */}
                <div className="w-1/3 flex flex-col gap-3">
                   <div className="text-xs font-bold text-slate-400 uppercase">Applied</div>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm opacity-50"></div>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm"></div>
                </div>
                {/* Column 2 */}
                <div className="w-1/3 flex flex-col gap-3">
                   <div className="text-xs font-bold text-slate-400 uppercase">Interview</div>
                   <div className="bg-white p-3 rounded-lg border-l-4 border-l-purple-500 shadow-md animate-float relative z-10">
                      <div className="h-2 w-16 bg-slate-800 rounded mb-2"></div>
                      <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                   </div>
                </div>
                {/* Column 3 */}
                <div className="w-1/3 flex flex-col gap-3">
                   <div className="text-xs font-bold text-slate-400 uppercase">Offer</div>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-green-500"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Step 4: Succeed */}
      <div className="py-24 px-4 max-w-7xl mx-auto bg-slate-900 text-white rounded-3xl mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/50 to-transparent"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 md:order-1 flex justify-center">
             <div className="w-full max-w-sm bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
                   <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Target size={16} className="text-white" />
                   </div>
                   <div>
                      <h4 className="font-bold">Interview Prep Agent</h4>
                      <p className="text-xs text-slate-400">Online</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <div className="p-3 bg-slate-700 rounded-2xl rounded-tl-none text-sm text-slate-300">
                         What are common interview questions for this Product Manager role?
                      </div>
                   </div>
                   <div className="flex gap-3 justify-end">
                      <div className="p-3 bg-indigo-600 rounded-2xl rounded-tr-none text-sm text-white">
                         Based on the job description, prepare for: "How do you prioritize features?" and "Describe a time you managed stakeholder conflict."
                      </div>
                   </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                   <div className="h-10 bg-slate-700 rounded-lg w-full animate-pulse"></div>
                </div>
             </div>
          </div>

          <div className="order-1 md:order-2">
             <div className="text-[120px] font-black text-slate-800 -z-10 select-none leading-none mb-4">04</div>
             <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
               <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                 <Target size={20} />
               </div>
               Execute & Win
             </h3>
             <p className="text-lg text-slate-400 mb-8 leading-relaxed">
               The final mile is the hardest. RekrutIn gives you the edge with personalized preparation tools.
             </p>
             <ul className="space-y-4 mb-8">
               <li className="flex gap-4 items-start">
                 <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold">Interview Simulator</h4>
                   <p className="text-slate-400 text-sm">Practice answering role-specific questions generated by AI.</p>
                 </div>
               </li>
               <li className="flex gap-4 items-start">
                 <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold">Salary Negotiation Stats</h4>
                   <p className="text-slate-400 text-sm">Know your worth with data-backed salary ranges for your role and location.</p>
                 </div>
               </li>
             </ul>
             <button 
               onClick={onSignUp}
               className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
             >
               Start Your Journey <ArrowRight size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
         <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-500" />
                  Is RekrutIn really free?
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                  Yes! Our Free plan lets you track up to 10 active applications and analyze your resume twice. It's perfect for casual job seekers. For power users, the Pro plan unlocks unlimited tracking and advanced AI features.
               </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-500" />
                  Does the browser extension work on all sites?
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                  We officially support LinkedIn, Glints, and JobStreet for one-click parsing. For other sites like Indeed or company career pages, you can easily use the "Manual Add" feature to paste the link and text.
               </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-500" />
                  Is my data private?
               </h3>
               <p className="text-slate-600 text-sm leading-relaxed">
                  Absolutely. Your resume and application data are yours. We do not sell your personal data to recruiters. We only use your data to generate insights for YOU.
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};
