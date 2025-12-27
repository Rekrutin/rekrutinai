
import React from 'react';
import { EmployerJob, CandidateApplication } from '../types.ts';
import { Users, Briefcase, FileText, TrendingUp, Clock, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

interface EmployerDashboardSummaryProps {
  jobs: EmployerJob[];
  applications: CandidateApplication[];
  onNavigate: (tab: 'jobs' | 'candidates') => void;
}

export const EmployerDashboardSummary: React.FC<EmployerDashboardSummaryProps> = ({ jobs, applications, onNavigate }) => {
  // Key Metrics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const totalApplicants = applications.length;
  const interviewsCount = applications.filter(a => a.status === 'Interview').length;

  // Recent Applications (Last 5)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Jobs Nearing Close Date (Mock Logic: Created > 20 days ago and still Active)
  // Assuming a 30-day standard posting cycle
  const urgentJobs = jobs
    .filter(j => {
      const daysSinceCreation = (Date.now() - new Date(j.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return j.status === 'Active' && daysSinceCreation > 20;
    })
    .map(j => ({
      ...j,
      daysRemaining: Math.max(0, 30 - Math.floor((Date.now() - new Date(j.created_at).getTime()) / (1000 * 60 * 60 * 24)))
    }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening with your recruitment.</p>
        </div>
        <div className="flex gap-2">
            <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                System Operational
            </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Briefcase size={20} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2 this week</span>
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">{activeJobs}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Active Jobs</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Users size={20} />
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+15% vs last mo</span>
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">{totalApplicants}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Applicants</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <CheckCircle size={20} />
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Action Needed</span>
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">{interviewsCount}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Interviews Scheduled</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <TrendingUp size={20} />
                </div>
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">85%</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Avg. AI Fit Score</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Jobs (Nearing Close Date) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                <h3 className="font-bold text-slate-800">Expiring Soon (Action Required)</h3>
             </div>
             <button onClick={() => onNavigate('jobs')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                View All Jobs <ArrowRight size={12} className="ml-1" />
             </button>
           </div>
           
           <div className="p-0">
             {urgentJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                   Great! No jobs are currently expiring soon.
                </div>
             ) : (
                <div className="divide-y divide-slate-100">
                  {urgentJobs.map(job => (
                    <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                       <div>
                         <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                         <p className="text-xs text-slate-500 mt-1">{job.location} • {job.type}</p>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-lg font-bold text-orange-600">{job.daysRemaining} Days</p>
                             <p className="text-[10px] text-slate-400 uppercase font-bold">Remaining</p>
                          </div>
                          <div className="text-right hidden sm:block">
                             <p className="text-lg font-bold text-slate-800">{job.applicants_count}</p>
                             <p className="text-[10px] text-slate-400 uppercase font-bold">Applicants</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-2">
                 <FileText size={18} className="text-indigo-500" />
                 <h3 className="font-bold text-slate-800">Recent Applicants</h3>
               </div>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
               {recentApplications.map(app => {
                 const job = jobs.find(j => j.id === app.jobId);
                 return (
                   <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                         <span className="font-bold text-slate-800 text-sm">{app.candidateName}</span>
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            app.aiFitScore >= 80 ? 'bg-green-50 text-green-700 border-green-100' : 
                            app.aiFitScore >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                            'bg-red-50 text-red-700 border-red-100'
                         }`}>
                           {app.aiFitScore}% Fit
                         </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Applied for <span className="text-indigo-600 font-medium">{job?.title || 'Unknown Job'}</span></p>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                         <Clock size={10} /> {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                   </div>
                 );
               })}
               <button 
                onClick={() => onNavigate('candidates')}
                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
               >
                 View All Candidates
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};
