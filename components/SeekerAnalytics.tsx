
import React from 'react';
import { Job, JobStatus } from '../types';
import { BarChart3, Users, XCircle, Trophy, TrendingUp, Lock } from 'lucide-react';
import { CountUp } from './CountUp';

interface SeekerAnalyticsProps {
  jobs: Job[];
  isPro?: boolean;
}

export const SeekerAnalytics: React.FC<SeekerAnalyticsProps> = ({ jobs, isPro = false }) => {
  const total = jobs.length;
  
  const interviews = jobs.filter(j => 
    j.status === JobStatus.INTERVIEW || j.status === JobStatus.OFFER
  ).length;

  const offers = jobs.filter(j => j.status === JobStatus.OFFER).length;
  const rejected = jobs.filter(j => j.status === JobStatus.REJECTED).length;

  // Rate Calculations
  const interviewRate = total > 0 ? (interviews / total) * 100 : 0;
  
  // Conversion from Interview to Offer
  const offerSuccessRate = interviews > 0 ? (offers / interviews) * 100 : 0;

  const rejectionRate = total > 0 ? (rejected/total)*100 : 0;

  return (
    <div className="space-y-6 animate-fade-in mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applied</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              <CountUp end={total} duration={1500} />
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
        </div>

        {/* Interview Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interview Rate</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900">
                <CountUp end={interviewRate} suffix="%" decimals={0} />
              </p>
              <span className="text-xs text-slate-400 mb-1">({interviews} jobs)</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Offer Success Rate (Post Interview) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Offer Success</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900">
                <CountUp end={offerSuccessRate} suffix="%" decimals={0} />
              </p>
              <span className="text-xs text-slate-400 mb-1">of interviews</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center relative z-10">
            <Trophy size={20} />
          </div>
          {/* Subtle background decoration for high success */}
          {offerSuccessRate > 50 && (
             <div className="absolute right-0 bottom-0 opacity-10 text-green-500 transform translate-x-2 translate-y-2">
               <TrendingUp size={64} />
             </div>
          )}
        </div>

         {/* Rejections */}
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900">
                <CountUp end={rejected} duration={1000} />
              </p>
              <span className="text-xs text-red-400 mb-1">
                <CountUp end={rejectionRate} suffix="%" decimals={0} />
              </span>
            </div>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* PRO ANALYTICS SECTION */}
      <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
         {!isPro && (
           <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                 <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Unlock Pro Insights</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-1 mb-4">
                See detailed breakdowns of your application velocity and CV performance.
              </p>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">
                Upgrade to Pro
              </button>
           </div>
         )}
         
         <div className={!isPro ? 'opacity-30 filter blur-sm select-none pointer-events-none' : ''}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <TrendingUp size={18} className="text-indigo-600" /> Application Velocity
            </h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
               {[2, 5, 3, 8, 4, 1, 6].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-50 rounded-t relative group">
                     <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t" style={{ height: `${h * 10}%` }}></div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
               <span>Mon</span>
               <span>Sun</span>
            </div>
         </div>
      </div>
    </div>
  );
};
