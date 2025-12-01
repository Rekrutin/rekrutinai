
import React from 'react';
import { Job, JobStatus } from '../types';
import { Briefcase, MapPin, BrainCircuit, GripVertical, ChevronRight, ChevronLeft, Trash2, Bell, Clock } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onMove: (job: Job, direction: 'next' | 'prev') => void;
  onAnalyze: (job: Job) => void;
  onDelete: (id: string) => void;
  onClick?: (job: Job) => void;
}

const statusOrder = [
  JobStatus.SAVED,
  JobStatus.APPLIED,
  JobStatus.INTERVIEW,
  JobStatus.OFFER,
  JobStatus.REJECTED
];

export const JobCard: React.FC<JobCardProps> = ({ job, onMove, onAnalyze, onDelete, onClick }) => {
  const statusIndex = statusOrder.indexOf(job.status);
  const isFirst = statusIndex === 0;
  const isLast = statusIndex === statusOrder.length - 1;

  // Determine border color and badge style based on fit score
  let scoreColor = 'border-slate-200';
  let badgeStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  
  if (job.ai_analysis) {
    const score = job.ai_analysis.fitScore;
    if (score >= 80) {
      scoreColor = 'border-green-400';
      badgeStyle = 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200';
    } else if (score >= 50) {
      scoreColor = 'border-yellow-400';
      badgeStyle = 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200';
    } else {
      scoreColor = 'border-red-400';
      badgeStyle = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200';
    }
  }

  // Assessment Urgency Logic
  let assessmentBadge = null;
  if (job.assessment && job.assessment.required && job.assessment.status !== 'Completed' && job.status !== JobStatus.REJECTED) {
    let colorClass = 'bg-green-50 text-green-700 border-green-100';
    let text = 'Assessment';
    
    if (job.assessment.deadline) {
        const now = new Date().getTime();
        const deadline = new Date(job.assessment.deadline).getTime();
        const hoursLeft = (deadline - now) / (1000 * 60 * 60);
        
        if (hoursLeft < 0) {
            colorClass = 'bg-red-100 text-red-700 border-red-200';
            text = 'Overdue';
        } else if (hoursLeft <= 48) {
            colorClass = 'bg-red-50 text-red-600 border-red-100';
            text = 'Due Soon';
        } else if (hoursLeft <= 96) {
            colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-100';
            text = 'Upcoming';
        }
    }
    
    assessmentBadge = (
        <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${colorClass} mt-2 w-fit`}>
            <Clock size={10} className="mr-1" /> {text}
        </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${scoreColor} mb-3 hover:shadow-md transition-shadow group relative`}>
      <div className="cursor-pointer" onClick={() => onClick && onClick(job)}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-slate-800 leading-tight hover:text-indigo-600 transition-colors">{job.title}</h3>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <Briefcase size={14} className="mr-1" />
              <span className="truncate max-w-[120px]">{job.company}</span>
            </div>
            {job.location && (
              <div className="flex items-center text-xs text-slate-400 mt-1">
                <MapPin size={12} className="mr-1" />
                <span>{job.location}</span>
              </div>
            )}
            
            {assessmentBadge}

            {job.followUpDate && !assessmentBadge && (
              <div className="flex items-center text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded w-fit border border-amber-100">
                <Bell size={10} className="mr-1" />
                {new Date(job.followUpDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job.id);
            }}
            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete job"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(job);
          }}
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-md transition-colors ${
            job.ai_analysis 
              ? badgeStyle
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BrainCircuit size={14} className="mr-1" />
          {job.ai_analysis ? `${job.ai_analysis.fitScore}% Match` : 'AI Analyze'}
        </button>

        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(job, 'prev');
            }}
            disabled={isFirst}
            className={`p-1 rounded hover:bg-slate-100 ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500'}`}
            title="Move back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(job, 'next');
            }}
            disabled={isLast}
            className={`p-1 rounded hover:bg-slate-100 ${isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500'}`}
            title="Move forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
