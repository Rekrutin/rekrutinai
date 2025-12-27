
import React from 'react';
import { Job, JobStatus } from '../types';
import { BrainCircuit, ExternalLink, Trash2, Calendar, MapPin, Building2, Plus, Bell, Clock } from 'lucide-react';

interface JobListViewProps {
  jobs: Job[];
  onStatusChange: (id: string, newStatus: JobStatus) => void;
  onAnalyze: (job: Job) => void;
  onDelete: (id: string) => void;
  onAddJob?: () => void; 
  onJobClick?: (job: Job) => void;
}

export const JobListView: React.FC<JobListViewProps> = ({ jobs, onStatusChange, onAnalyze, onDelete, onAddJob, onJobClick }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[400px] animate-fade-in shadow-sm">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-8 shadow-sm">
          <Calendar size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Track Your First Job Application</h3>
        <p className="text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">Start organizing your search. Add a job you've applied for or found interesting.</p>
        {onAddJob && (
          <button 
            onClick={onAddJob}
            className="flex items-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={22} className="mr-2" /> Add Application
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

  const getAssessmentIndicator = (job: Job) => {
    if (job.assessment && job.assessment.required && job.assessment.status !== 'Completed' && job.status !== JobStatus.REJECTED) {
        let colorClass = 'text-green-600 bg-green-50 border-green-200';
        
        if (job.assessment.deadline) {
            const now = new Date().getTime();
            const deadline = new Date(job.assessment.deadline).getTime();
            const hoursLeft = (deadline - now) / (1000 * 60 * 60);
            
            if (hoursLeft < 0) colorClass = 'text-red-600 bg-red-50 border-red-200';
            else if (hoursLeft <= 48) colorClass = 'text-red-500 bg-red-50 border-red-100';
            else if (hoursLeft <= 96) colorClass = 'text-yellow-600 bg-yellow-50 border-yellow-100';
        }

        return (
            <span className={`flex items-center px-1.5 py-0.5 rounded border text-[10px] font-bold ${colorClass} ml-2`}>
                <Clock size={10} className="mr-1" /> Test
            </span>
        );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Role & Company</th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Date Added</th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">AI Match</th>
              <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr 
                key={job.id} 
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                onClick={() => onJobClick && onJobClick(job)}
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</span>
                        {getAssessmentIndicator(job)}
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-1.5 font-medium">
                      <Building2 size={12} className="mr-1.5 text-slate-400" />
                      <span className="mr-3">{job.company}</span>
                      {job.location && (
                        <>
                          <MapPin size={12} className="mr-1.5 text-slate-400" />
                          <span className="mr-3">{job.location}</span>
                        </>
                      )}
                      {job.followUpDate && (
                        <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100" title={`Reminder: ${new Date(job.followUpDate).toLocaleDateString()}`}>
                          <Bell size={10} className="mr-1.5" />
                          {new Date(job.followUpDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-500 font-medium">
                    <Calendar size={14} className="mr-2 text-slate-300" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <select
                    value={job.status}
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${getStatusColor(job.status)}`}
                  >
                    {Object.values(JobStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnalyze(job);
                    }}
                    className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-xl transition-all border-2 ${
                      job.ai_analysis 
                        ? getScoreBadgeStyle(job.ai_analysis.fitScore)
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <BrainCircuit size={14} className="mr-2" />
                    {job.ai_analysis ? `${job.ai_analysis.fitScore}% Match` : 'Analyze'}
                  </button>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {job.url && (
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Go to Job Post"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Application"
                    >
                      <Trash2 size={18} />
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
