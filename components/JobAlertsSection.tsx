
import React, { useState } from 'react';
import { JobAlert, ExternalJobMatch } from '../types';
import { Bell, MapPin, Search, Trash2, Plus, Briefcase, ExternalLink, Clock, Globe, BrainCircuit, Linkedin, CheckCircle, Zap, Code, PenTool, TrendingUp, Monitor } from 'lucide-react';

interface JobAlertsSectionProps {
  alerts: JobAlert[];
  matchedJobs: ExternalJobMatch[];
  onAddAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
}

export const JobAlertsSection: React.FC<JobAlertsSectionProps> = ({ alerts, matchedJobs, onAddAlert, onDeleteAlert }) => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState<JobAlert['frequency']>('Instant');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords) {
      setIsScanning(true);
      // Simulate scanning delay
      setTimeout(() => {
        onAddAlert({
          keywords,
          location,
          frequency
        });
        setKeywords('');
        setLocation('');
        setFrequency('Instant');
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleQuickCategory = (category: string) => {
    setKeywords(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'LinkedIn': return <Linkedin size={14} className="text-[#0077b5]" />;
      case 'Glints': return <div className="w-3.5 h-3.5 bg-[#FFF200] rounded-full flex items-center justify-center text-[8px] font-bold text-black">G</div>;
      case 'JobStreet': return <div className="w-3.5 h-3.5 bg-[#1C3E96] rounded-full flex items-center justify-center text-[8px] font-bold text-white">J</div>;
      default: return <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] font-bold text-white">R</div>;
    }
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const POPULAR_CATEGORIES = [
    { name: 'Engineering', icon: <Code size={18} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { name: 'Marketing', icon: <TrendingUp size={18} />, color: 'bg-pink-50 text-pink-600 border-pink-100' },
    { name: 'Design', icon: <PenTool size={18} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Remote Jobs', icon: <Globe size={18} />, color: 'bg-green-50 text-green-600 border-green-100' },
    { name: 'Operations', icon: <Zap size={18} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { name: 'Tech', icon: <Monitor size={18} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Hero Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner / Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white p-8 pb-6 border-b border-slate-100 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Find your next opportunity</h2>
          <p className="text-slate-500">Search and create alerts from over 50,000+ jobs across LinkedIn, Glints, and more.</p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
             {/* Keyword Input */}
             <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Job title, skill, or company"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-base shadow-sm hover:border-indigo-300 transition-colors"
                />
             </div>

             {/* Location Input */}
             <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="All Cities / Provinces"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-base shadow-sm hover:border-indigo-300 transition-colors"
                />
             </div>

             {/* Action Button */}
             <button 
                type="submit"
                disabled={isScanning}
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 min-w-[160px]"
             >
                {isScanning ? (
                  <span className="flex items-center animate-pulse">Scanning...</span>
                ) : (
                  <>Create Alert <Bell size={18} /></>
                )}
             </button>
          </form>

          {/* Popular Categories */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-500 mb-4">Popular Job Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleQuickCategory(cat.name)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-md ${cat.color}`}
                >
                  {cat.icon}
                  <span className="text-xs font-bold">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts & Connected Sources */}
      <div className="flex flex-col md:flex-row gap-6">
         {/* Active Alerts List */}
         <div className="flex-1">
           <div className="flex items-center gap-2 mb-3 px-1">
              <Bell size={16} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Your Active Alerts</h3>
           </div>
           
           {alerts.length === 0 ? (
             <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-400 text-sm">
               No alerts set. Create one above to get notified.
             </div>
           ) : (
             <div className="flex flex-wrap gap-3">
               {alerts.map(alert => (
                 <div key={alert.id} className="bg-white pl-3 pr-2 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3 group hover:border-indigo-300 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{alert.keywords}</p>
                      <p className="text-xs text-slate-500">{alert.location || 'Anywhere'}</p>
                    </div>
                    <button 
                      onClick={() => onDeleteAlert(alert.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Alert"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               ))}
             </div>
           )}
         </div>

         {/* Connected Status */}
         <div className="flex items-center justify-end gap-3 self-end md:self-center">
            <span className="text-xs text-slate-400 font-medium">Scanning from:</span>
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0077b5] flex items-center justify-center text-white relative z-30" title="LinkedIn">
                   <Linkedin size={16} />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#FFF200] flex items-center justify-center text-black font-bold text-xs relative z-20" title="Glints">G</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#1C3E96] flex items-center justify-center text-white font-bold text-xs relative z-10" title="JobStreet">J</div>
             </div>
         </div>
      </div>

      {/* Live Matches Feed */}
      <div>
         <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              Live Matches <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{matchedJobs.length}</span>
            </h3>
            <div className="flex gap-2 text-sm">
               <span className="text-slate-500">Sort by:</span>
               <select className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer">
                 <option>Highest Match</option>
                 <option>Newest</option>
               </select>
            </div>
         </div>

         {matchedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search size={32} className="text-slate-300" />
               </div>
               <h3 className="text-slate-900 font-medium">Scanning for matches...</h3>
               <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                 We're searching LinkedIn, Glints, and more. Try adding broader keywords if this takes too long.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden flex flex-col">
                  {/* Top Bar / Source */}
                  <div className="px-5 pt-5 flex justify-between items-start">
                     <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {getSourceIcon(job.source)}
                        {job.source}
                     </span>
                     <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold ${getFitScoreColor(job.aiFitScore)}`}>
                        <BrainCircuit size={14} />
                        {job.aiFitScore}% Fit
                     </div>
                  </div>

                  {/* Main Info */}
                  <div className="px-5 mt-3 flex-1">
                     <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                       {job.title}
                     </h3>
                     <p className="text-slate-600 font-medium text-sm mb-3">{job.company}</p>
                     
                     <div className="flex flex-wrap gap-y-2 text-xs text-slate-500 mb-4">
                        <span className="flex items-center w-1/2"><Briefcase size={12} className="mr-1.5 text-slate-400" /> {job.type}</span>
                        <span className="flex items-center w-1/2"><MapPin size={12} className="mr-1.5 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center w-1/2 mt-1"><Clock size={12} className="mr-1.5 text-slate-400" /> {new Date(job.postedAt).toLocaleDateString()}</span>
                        {job.salary_range && <span className="flex items-center w-1/2 mt-1 font-semibold text-slate-700">{job.salary_range}</span>}
                     </div>

                     <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                       {job.description}
                     </p>
                  </div>

                  {/* Footer Action */}
                  <div className="p-4 border-t border-slate-50 mt-auto flex gap-3">
                     <button className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                       View Details
                     </button>
                     <button className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1">
                       Easy Apply <ExternalLink size={12} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
         )}
      </div>
    </div>
  );
};
