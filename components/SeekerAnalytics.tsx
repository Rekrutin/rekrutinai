
import React, { useMemo, useState } from 'react';
import { Job, JobStatus } from '../types';
import { BarChart3, Users, XCircle, Trophy, TrendingUp, Lock, Calendar } from 'lucide-react';
import { CountUp } from './CountUp';

interface SeekerAnalyticsProps {
  jobs: Job[];
  isPro?: boolean;
  showVelocity?: boolean;
}

export const SeekerAnalytics: React.FC<SeekerAnalyticsProps> = ({ jobs, isPro = false, showVelocity = true }) => {
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
  const getPath = (key: 'applied' | 'interview' | 'offer' | 'rejected') => {
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - (d[key] / maxVal) * 80; // Leave 20% padding at top
        return `${x},${y}`;
    }).join(' L ');
    return `M ${points}`;
  };

  const getAreaPath = (key: 'applied' | 'interview' | 'offer' | 'rejected') => {
    const linePath = getPath(key);
    return `${linePath} L 100,100 L 0,100 Z`;
  };

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

      {/* PRO ANALYTICS - APPLICATION VELOCITY CHART */}
      {showVelocity && (
      <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden min-h-[320px]">
         {!isPro && (
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
         
         <div className={`flex flex-col h-full ${!isPro ? 'opacity-20 filter blur-sm select-none pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" /> Application Velocity
                </h3>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Applied</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Interview</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Offer</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Rejected</div>
                </div>
            </div>

            {/* SVG CHART */}
            <div className="flex-1 relative w-full h-[200px] mt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                    ))}

                    {/* Areas */}
                    <path d={getAreaPath('applied')} fill="url(#gradBlue)" className="opacity-20" />
                    <path d={getAreaPath('interview')} fill="url(#gradPurple)" className="opacity-20" />
                    <path d={getAreaPath('offer')} fill="url(#gradGreen)" className="opacity-20" />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Lines */}
                    <path 
                        d={getPath('applied')} 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="animate-draw-line"
                    />
                    <path 
                        d={getPath('interview')} 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.2s' }}
                    />
                    <path 
                        d={getPath('offer')} 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.4s' }}
                    />
                    <path 
                        d={getPath('rejected')} 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        className="animate-draw-line"
                        style={{ animationDelay: '0.5s' }}
                    />

                    {/* Interactive Points */}
                    {chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100;
                        const yApplied = 100 - (d.applied / maxVal) * 80;
                        
                        return (
                            <g key={i} onMouseEnter={() => setHoveredDay(i)} onMouseLeave={() => setHoveredDay(null)}>
                                <circle 
                                    cx={x} cy={yApplied} r="1.5" 
                                    fill="white" stroke="#6366f1" strokeWidth="1" 
                                    className="cursor-pointer hover:r-2 transition-all"
                                />
                                {/* Invisible hit area column */}
                                <rect x={x - 5} y="0" width="10" height="100" fill="transparent" className="cursor-pointer" />
                            </g>
                        );
                    })}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                    {chartData.map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>

                {/* Tooltip Overlay */}
                {hoveredDay !== null && (
                    <div 
                        className="absolute top-0 bg-slate-800 text-white text-xs rounded-lg p-2 shadow-xl pointer-events-none z-10 w-32"
                        style={{ 
                            left: `${(hoveredDay / (chartData.length - 1)) * 100}%`,
                            transform: `translateX(-50%) translateY(-110%)`
                        }}
                    >
                        <div className="font-bold border-b border-slate-600 pb-1 mb-1">{chartData[hoveredDay].day} Stats</div>
                        <div className="flex justify-between text-indigo-300"><span>Applied:</span> <span>{chartData[hoveredDay].applied}</span></div>
                        <div className="flex justify-between text-purple-300"><span>Interview:</span> <span>{chartData[hoveredDay].interview}</span></div>
                        <div className="flex justify-between text-green-300"><span>Offer:</span> <span>{chartData[hoveredDay].offer}</span></div>
                        <div className="flex justify-between text-red-300"><span>Rejected:</span> <span>{chartData[hoveredDay].rejected}</span></div>
                    </div>
                )}
            </div>
         </div>
      </div>
      )}
    </div>
  );
};
