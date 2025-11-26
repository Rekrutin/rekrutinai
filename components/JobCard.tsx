import React from 'react';
import { Job, JobStatus } from '../types';
import { Briefcase, MapPin, BrainCircuit, GripVertical, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onMove: (job: Job, direction: 'next' | 'prev') => void;
  onAnalyze: (job: Job) => void;
  onDelete: (id: string) => void;
}

const statusOrder = [
  JobStatus.SAVED,
  JobStatus.APPLIED,
  JobStatus.INTERVIEW,
  JobStatus.OFFER,
  JobStatus.REJECTED
];

export const JobCard: React.FC<JobCardProps> = ({ job, onMove, onAnalyze, onDelete }) => {
  const statusIndex = statusOrder.indexOf(job.status);
  const isFirst = statusIndex === 0;
  const isLast = statusIndex === statusOrder.length - 1;

  // Determine border color based on fit score
  let scoreColor = 'border-slate-200';
  if (job.ai_analysis) {
    if (job.ai_analysis.fitScore >= 80) scoreColor = 'border-green-400';
    else if (job.ai_analysis.fitScore >= 50) scoreColor = 'border-yellow-400';
    else scoreColor = 'border-red-400';
  }

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${scoreColor} mb-3 hover:shadow-md transition-shadow group relative`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-800 leading-tight">{job.title}</h3>
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
        </div>
        <button 
          onClick={() => onDelete(job.id)}
          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete job"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onAnalyze(job)}
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-md transition-colors ${
            job.ai_analysis 
              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BrainCircuit size={14} className="mr-1" />
          {job.ai_analysis ? `${job.ai_analysis.fitScore}% Match` : 'AI Analyze'}
        </button>

        <div className="flex space-x-1">
          <button
            onClick={() => onMove(job, 'prev')}
            disabled={isFirst}
            className={`p-1 rounded hover:bg-slate-100 ${isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500'}`}
            title="Move back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onMove(job, 'next')}
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