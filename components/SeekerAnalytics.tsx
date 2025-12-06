
import React, { useMemo, useState } from 'react';
import { Job, JobStatus } from '../types';
import { BarChart3, Users, XCircle, Trophy, TrendingUp, Lock, Sparkles } from 'lucide-react';
import { CountUp } from './CountUp';

interface SeekerAnalyticsProps {
  jobs: Job[];
  isPro?: boolean;
  showVelocity?: boolean;
  mode?: 'full' | 'summary' | 'chart';
  size?: 'normal' | 'small';
}

export const SeekerAnalytics: React.FC<SeekerAnalyticsProps> = ({ 
  jobs, 
  isPro = false, 
  showVelocity = true,
  mode = 'full',
  size = 'normal'
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const total = jobs.length;
  
  const interviews = jobs.filter(j => 
    j.status === JobStatus.INTERVIEW || j.status === JobStatus.OFFER
  ).length;

  const offers = jobs.filter(j => j.status === JobStatus.OFFER).length;
  const rejected = jobs.filter(j => j.status === JobStatus.REJECTED).length;

  // Rate Calculations
  const interviewRate = total > 0 ? (interviews / total) * 100 : 0;
  const offerSuccessRate = interviews > 0 ? (offers / interviews) * 100 : 0;
  const rejectionRate = total > 0 ? (rejected/total)*100 : 0;

  // --- CHART DATA GENERATION ---
  const chartData = useMemo(() => {
    const days = 7;
    const today = new Date();
    const data = [];

    // Initialize last 7 days
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        data.push({
            date: dateStr,
            day: dayName,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0
        });
    }

    // Populate data from jobs timeline
    // Note: This relies on timeline being populated. Fallback to createdAt if timeline missing.
    jobs.forEach(job => {
        const events = job.timeline || [{ status: job.status, date: job.created_at }];
        
        events.forEach(event => {
            const eventDate = event.date.split('T')[0];
            const dayStat = data.find(d => d.date === eventDate);
            
            if (dayStat) {
                if (event.status === JobStatus.APPLIED || event.status === JobStatus.SAVED) dayStat.applied++;
                if (event.status === JobStatus.INTERVIEW) dayStat.interview++;
                if (event.status === JobStatus.OFFER) dayStat.offer++;
                if (event.status === JobStatus.REJECTED) dayStat.rejected++;
            }
        });
    });

    return data;
  }, [jobs]);

  // Determine Max Value for Chart Scaling
  const maxVal = Math.max(
    ...chartData.map(d => Math.max(d.applied, d.interview, d.offer, d.rejected)),
    5 // Minimum scale
  );

  // SVG Helper
  const getCoordinates = (key: 'applied' | 'interview' | 'offer' | 'rejected') => {
    return chartData.map((d, i) => ({
        x: (i / (chartData.length - 1)) * 100,
        y: 100 - (d[key] / (maxVal || 1)) * 80 // Leave 20% padding at top
    }));
  };

  // Build a cubic bezier spline path
  const buildSmoothPath = (key: 'applied' | 'interview' | 'offer' | 'rejected') => {
      const coords = getCoordinates(key);
      if (coords.length === 0) return "";
      
      let d = `M ${coords[0].x},${coords[0].y}`;
      
      for (let i = 0; i < coords.length - 1; i++) {
          const p0 = i > 0 ? coords[i - 1] : coords[0];
          const p1 = coords[i];
          const p2 = coords[i + 1];
          const p3 = i !== coords.length - 2 ? coords[i + 2] : p2;

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;

          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
  };

  const getAreaPath = (key: 'applied' | 'interview' | 'offer' | 'rejected') => {
    const linePath = buildSmoothPath(key);
    return `${linePath} L 100,100 L 0,100 Z`;
  };

  const showSummary = mode === 'full' || mode === 'summary';
  const showChart = (mode === 'full' || mode === 'chart') && showVelocity;

  return (
    <div className={`space-y-6 animate-fade-in ${showSummary && showChart ? 'mb-6' : ''}`}>
      {showSummary && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applied</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              <CountUp end={total} duration={1500} />
            </p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
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

        {/* Offer Success Rate */}
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
      )}

      {/* PRO ANALYTICS - APPLICATION VELOCITY CHART */}
      {showChart && (
        <>
          {/* MICRO-CARD UPSELL (When size=small AND not pro) */}
          {size === 'small' && !isPro ? (
            <div className="w-full max-w-[340px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center transition-all hover:shadow-md">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Unlock Pro Insights</h3>
                <p className="text-xs text-slate-500 mb-4 px-2 leading-relaxed">
                    Visualize your application velocity and success trends.
                </p>
                <button className="bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-slate-800 transition-transform active:scale-95 shadow-sm">
                    Upgrade to Pro
                </button>
            </div>
          ) : (
            /* STANDARD CHART / PRO SMALL CHART */
            <div className={`relative rounded-xl border transition-all overflow-hidden ${
                size === 'small' 
                    ? 'bg-white border-slate-200 shadow-sm max-w-[360px] mx-auto' 
                    : 'bg-white border-slate-200 shadow-sm min-h-[280px]'
            }`}>
                {!isPro && size !== 'small' && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-indigo-100 m-2 rounded-lg">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Unlock Pro Insights</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1 mb-4">
                        See detailed velocity charts for Applied vs Interview vs Offer trends.
                    </p>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">
                        Upgrade to Pro
                    </button>
                </div>
                )}
                
                <div className={`flex flex-col h-full ${!isPro && size !== 'small' ? 'opacity-20 filter blur-sm select-none pointer-events-none' : ''} ${size === 'small' ? 'p-4' : 'p-6'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-bold text-slate-800 flex items-center gap-2 ${size === 'small' ? 'text-xs' : 'text-base'}`}>
                            <TrendingUp size={size === 'small' ? 16 : 20} className="text-indigo-600" /> 
                            {size === 'small' ? 'Velocity' : 'Application Velocity'}
                        </h3>
                        {size === 'normal' && (
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Applied</div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Interview</div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Offer</div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Rejected</div>
                        </div>
                        )}
                    </div>

                    {/* SVG CHART */}
                    <div className={`flex-1 relative w-full ${size === 'small' ? 'h-[100px]' : 'h-[200px]'} mt-auto`}>
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* ... Gradients & Filters ... */}
                            <defs>
                                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Only show grid in normal size */}
                            {size === 'normal' && [0, 25, 50, 75, 100].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2 2" />
                            ))}

                            {/* Areas */}
                            <path d={getAreaPath('applied')} fill="url(#gradBlue)" className="transition-all duration-500" />
                            <path d={getAreaPath('interview')} fill="url(#gradPurple)" className="transition-all duration-500" />
                            <path d={getAreaPath('offer')} fill="url(#gradGreen)" className="transition-all duration-500" />

                            {/* Lines */}
                            <path 
                                d={buildSmoothPath('applied')} 
                                fill="none" stroke="#6366f1" strokeWidth={size === 'small' ? 2 : 3} strokeLinecap="round" strokeLinejoin="round"
                                strokeDasharray="1000" strokeDashoffset="1000" className="animate-draw-line"
                            />
                            <path 
                                d={buildSmoothPath('interview')} 
                                fill="none" stroke="#a855f7" strokeWidth={size === 'small' ? 2 : 3} strokeLinecap="round" strokeLinejoin="round"
                                strokeDasharray="1000" strokeDashoffset="1000" className="animate-draw-line" style={{ animationDelay: '0.2s' }}
                            />
                            {/* ... other paths ... */}
                        </svg>
                    </div>
                </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
