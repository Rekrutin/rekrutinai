import React, { useState } from 'react';
import { JobAlert, EmployerJob } from '../types';
import { Bell, MapPin, Search, Trash2, Plus, Briefcase, ExternalLink, Clock } from 'lucide-react';

interface JobAlertsSectionProps {
  alerts: JobAlert[];
  matchedJobs: EmployerJob[];
  onAddAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
}

export const JobAlertsSection: React.FC<JobAlertsSectionProps> = ({ alerts, matchedJobs, onAddAlert, onDeleteAlert }) => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState<JobAlert['frequency']>('Instant');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords) {
      onAddAlert({
        keywords,
        location,
        frequency
      });
      setKeywords('');
      setLocation('');
      setFrequency('Instant');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create & Manage Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Create Alert</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Keywords</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Jakarta"
                    className="w-full pl-9 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as JobAlert['frequency'])}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Instant">Instant Notification</option>
                  <option value="Daily">Daily Summary</option>
                  <option value="Weekly">Weekly Summary</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} className="mr-2" /> Set Alert
              </button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-600 pl-1">Active Alerts</h3>
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 pl-1">No alerts set up yet.</p>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center group">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{alert.keywords}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-0.5">
                      <span className="mr-2">{alert.location || 'Anywhere'}</span>
                      <span className="bg-slate-100 px-1.5 rounded text-xs">{alert.frequency}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteAlert(alert.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Matched Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <div>
                 <h2 className="text-lg font-bold text-slate-900">Live Matches</h2>
                 <p className="text-sm text-slate-500">Jobs from our platform matching your criteria</p>
               </div>
               <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                 {matchedJobs.length} matches found
               </span>
            </div>

            {matchedJobs.length === 0 ? (
              <div className="p-12 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-slate-300" />
                 </div>
                 <h3 className="text-slate-900 font-medium">No matches yet</h3>
                 <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                   Try adjusting your alert keywords or wait for new jobs to be posted by employers.
                 </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchedJobs.map(job => (
                  <div key={job.id} className="p-5 hover:bg-slate-50 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900">{job.title}</h3>
                        <div className="flex items-center text-sm text-slate-500 mt-1 space-x-3">
                           <span className="flex items-center"><Briefcase size={14} className="mr-1" /> {job.type}</span>
                           <span className="flex items-center"><MapPin size={14} className="mr-1" /> {job.location}</span>
                           <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-lg">
                           Apply Now
                         </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">{job.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};