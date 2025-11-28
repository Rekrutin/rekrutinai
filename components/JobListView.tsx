
import React from 'react';
import { Job, JobStatus } from '../types';
import { BrainCircuit, ExternalLink, Trash2, Calendar, MapPin, Building2, Plus, Bell } from 'lucide-react';

interface JobListViewProps {
  jobs: Job[];
  onStatusChange: (id: string, newStatus: JobStatus) => void;
  onAnalyze: (job: Job) => void;
  onDelete: (id: string) => void;
  onAddJob?: () => void; // Optional prop to trigger add modal from empty state
  onJobClick?: (job: Job) => void;
}

export const JobListView: React.FC<JobListViewProps> = ({ jobs, onStatusChange, onAnalyze, onDelete, onAddJob, onJobClick }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <Calendar size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Track Your First Job Application</h3>
        <p className="text-slate-500 max-w-sm mb-6">Start organizing your search. Add a job you've applied for or found interesting.</p>
        {onAddJob && (
          <button 
            onClick={onAddJob}
            className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <Plus size={18} className="mr-2" /> Add Application
          </button>
        )}
      </div>
    );
  }

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

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
    if (score >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
    return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role & Company</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Added</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">AI Match</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {jobs.map((job) => (
              <tr 
                key={job.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onJobClick && onJobClick(job)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</span>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Building2 size={12} className="mr-1" />
                      <span className="mr-3">{job.company}</span>
                      {job.location && (
                        <>
                          <MapPin size={12} className="mr-1" />
                          <span className="mr-3">{job.location}</span>
                        </>
                      )}
                      {job.followUpDate && (
                        <span className="flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100" title={`Reminder: ${new Date(job.followUpDate).toLocaleDateString()}`}>
                          <Bell size={10} className="mr-1" />
                          {new Date(job.followUpDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar size={14} className="mr-2 text-slate-400" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={job.status}
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                    onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                    className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(job.status)}`}
                  >
                    {Object.values(JobStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnalyze(job);
                    }}
                    className={`flex items-center text-xs font-medium px-2 py-1 rounded-md transition-colors border ${
                      job.ai_analysis 
                        ? getScoreBadgeStyle(job.ai_analysis.fitScore)
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <BrainCircuit size={14} className="mr-1.5" />
                    {job.ai_analysis ? `${job.ai_analysis.fitScore}% Match` : 'Analyze'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {job.url && (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Go to Job Post"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.id);
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
