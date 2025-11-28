
import React from 'react';
import { Job, JobStatus } from '../types';
import { Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface AdminAppsProps {
  jobs: Job[];
}

export const AdminApps: React.FC<AdminAppsProps> = ({ jobs }) => {
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SAVED: return 'bg-slate-100 text-slate-700 border-slate-200';
      case JobStatus.APPLIED: return 'bg-blue-50 text-blue-700 border-blue-200';
      case JobStatus.INTERVIEW: return 'bg-purple-50 text-purple-700 border-purple-200';
      case JobStatus.OFFER: return 'bg-green-50 text-green-700 border-green-200';
      case JobStatus.REJECTED: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800 text-lg">Global Application Tracker</h3>
            <p className="text-sm text-slate-500">Monitor all job applications being tracked by users.</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">
            {jobs.length} Total Records
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Company & Role</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Tracked</th>
              <th className="px-6 py-4 text-right">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No applications tracked yet.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{job.company}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                         <Building2 size={10} /> {job.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} /> {job.location || 'Remote'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(job.status)}`}>
                        {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400" />
                       {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {job.url ? (
                        <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs font-bold">
                            View <ExternalLink size={12} />
                        </a>
                    ) : (
                        <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
