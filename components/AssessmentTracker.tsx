
import React from 'react';
import { Job, JobStatus } from '../types';
import { Clock, AlertCircle, CheckCircle, ExternalLink, Gamepad2, Code2, Video, FileText, ChevronRight } from 'lucide-react';

interface AssessmentTrackerProps {
  jobs: Job[];
  onMarkComplete: (jobId: string) => void;
  onOpenJob: (job: Job) => void;
}

export const AssessmentTracker: React.FC<AssessmentTrackerProps> = ({ jobs, onMarkComplete, onOpenJob }) => {
  
  // Filter jobs with active assessments (not completed)
  const activeAssessments = jobs.filter(job => 
    job.assessment && 
    job.assessment.required && 
    job.assessment.status !== 'Completed' &&
    job.status !== JobStatus.REJECTED // Don't show assessments for rejected jobs
  );

  // Sort by deadline (urgent first)
  const sortedAssessments = activeAssessments.sort((a, b) => {
    const dateA = a.assessment?.deadline ? new Date(a.assessment.deadline).getTime() : Infinity;
    const dateB = b.assessment?.deadline ? new Date(b.assessment.deadline).getTime() : Infinity;
    return dateA - dateB;
  });

  if (sortedAssessments.length === 0) return null;

  const getUrgencyColor = (deadline?: string) => {
    if (!deadline) return 'bg-slate-100 text-slate-600 border-slate-200';
    const now = new Date().getTime();
    const target = new Date(deadline).getTime();
    const hoursLeft = (target - now) / (1000 * 60 * 60);

    if (hoursLeft < 0) return 'bg-red-100 text-red-700 border-red-200'; // Overdue
    if (hoursLeft <= 48) return 'bg-red-50 text-red-600 border-red-200'; // Urgent (< 2 days)
    if (hoursLeft <= 96) return 'bg-yellow-50 text-yellow-700 border-yellow-200'; // Warning (< 4 days)
    return 'bg-green-50 text-green-700 border-green-200'; // Safe
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    const now = new Date().getTime();
    const target = new Date(deadline).getTime();
    const hoursLeft = (target - now) / (1000 * 60 * 60);
    const daysLeft = Math.ceil(hoursLeft / 24);

    if (hoursLeft < 0) return 'Overdue';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    return `${daysLeft} days left`;
  };

  const getAssessmentIcon = (type?: string) => {
    switch(type) {
        case 'Online Game': return <Gamepad2 size={16} />;
        case 'Coding Test': return <Code2 size={16} />;
        case 'Video Interview': return <Video size={16} />;
        default: return <FileText size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <Clock size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Upcoming Assessments</h3>
                    <p className="text-xs text-slate-500">Don't miss these deadlines!</p>
                </div>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                {sortedAssessments.length} Pending
            </span>
        </div>

        <div className="divide-y divide-slate-50">
            {sortedAssessments.map(job => (
                <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 cursor-pointer" onClick={() => onOpenJob(job)}>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800 text-sm hover:text-indigo-600 transition-colors">
                                {job.company}
                            </h4>
                            <span className="text-slate-400 text-xs">• {job.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                {getAssessmentIcon(job.assessment?.type)}
                                <span>{job.assessment?.type}</span>
                            </div>
                            {job.assessment?.platform && (
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                                    {job.assessment.platform}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${getUrgencyColor(job.assessment?.deadline)}`}>
                            <Clock size={14} />
                            {getDaysLeft(job.assessment?.deadline)}
                        </div>
                        
                        <div className="flex items-center gap-1">
                            {job.assessment?.link && (
                                <a 
                                    href={job.assessment.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Open Assessment Link"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                            <button 
                                onClick={() => onMarkComplete(job.id)}
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Completed"
                            >
                                <CheckCircle size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
