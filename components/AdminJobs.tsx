
import React, { useState } from 'react';
import { ExternalJobMatch } from '../types';
import { CloudDownload, RefreshCw, MapPin, Globe, CheckSquare, Settings } from 'lucide-react';

interface AdminJobsProps {
  jobs: ExternalJobMatch[];
  onImport: (newJobs: ExternalJobMatch[]) => void;
}

export const AdminJobs: React.FC<AdminJobsProps> = ({ jobs, onImport }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [autoImport, setAutoImport] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    // Simulate API fetch delay
    setTimeout(() => {
      const newJobs: ExternalJobMatch[] = [
        {
          id: `imp-${Date.now()}-1`,
          title: 'Senior Backend Engineer',
          company: 'GoTo Financial',
          location: 'Jakarta',
          type: 'Full-time',
          source: 'Glints',
          postedAt: new Date().toISOString(),
          description: 'Imported from API...',
          aiFitScore: 85
        },
        {
          id: `imp-${Date.now()}-2`,
          title: 'DevOps Specialist',
          company: 'Sea Group',
          location: 'Singapore',
          type: 'Full-time',
          source: 'LinkedIn',
          postedAt: new Date().toISOString(),
          description: 'Imported from API...',
          aiFitScore: 92
        },
        {
          id: `imp-${Date.now()}-3`,
          title: 'Marketing Lead',
          company: 'Traveloka',
          location: 'Jakarta',
          type: 'Full-time',
          source: 'JobStreet',
          postedAt: new Date().toISOString(),
          description: 'Imported from API...',
          aiFitScore: 78
        }
      ];
      onImport(newJobs);
      setIsImporting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Import Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Manual Sync Card */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Job Import Hub</h2>
            <p className="text-sm text-slate-500 mb-6">Pull active listings from supported open API sources. These jobs will immediately appear in User Job Alerts.</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
               {['LinkedIn', 'Glints', 'JobStreet', 'Indeed', 'TechInAsia'].map(source => (
                  <div key={source} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                     <CheckSquare size={14} className="text-indigo-600" /> {source}
                  </div>
               ))}
            </div>

            <div className="flex items-center gap-4">
               <button 
                 onClick={handleImport}
                 disabled={isImporting}
                 className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isImporting ? (
                   <>
                     <RefreshCw size={18} className="animate-spin" /> Fetching API...
                   </>
                 ) : (
                   <>
                     <CloudDownload size={18} /> Sync Now
                   </>
                 )}
               </button>
               {isImporting && <span className="text-xs text-slate-500">Processing 5 sources...</span>}
            </div>
         </div>

         {/* Scheduler Card */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">Auto-Import</h3>
                  <Settings size={16} className="text-slate-400" />
               </div>
               <p className="text-xs text-slate-500 mb-4">Run daily scrape at 00:00 UTC</p>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                  onClick={() => setAutoImport(!autoImport)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autoImport ? 'bg-green-500' : 'bg-slate-300'}`}
               >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${autoImport ? 'left-7' : 'left-1'}`}></div>
               </button>
               <span className={`text-sm font-bold ${autoImport ? 'text-green-600' : 'text-slate-400'}`}>
                  {autoImport ? 'Enabled' : 'Disabled'}
               </span>
            </div>
         </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-bold text-slate-800">Imported Jobs Repository</h3>
           <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
             {jobs.length} Listings
           </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Posted</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{job.title}</td>
                  <td className="px-6 py-4 text-slate-700">{job.company}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        job.source === 'LinkedIn' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        job.source === 'Glints' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                        {job.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                     <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                     {new Date(job.postedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1 w-fit ml-auto">
                        <Globe size={10} /> Active
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
