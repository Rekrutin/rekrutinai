
import React from 'react';
import { Job, JobStatus } from '../types';
import { BarChart3, Users, XCircle, Trophy, TrendingUp } from 'lucide-react';
import { CountUp } from './CountUp';

interface SeekerAnalyticsProps {
  jobs: Job[];
}

export const SeekerAnalytics: React.FC<SeekerAnalyticsProps> = ({ jobs }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
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
  );
};
