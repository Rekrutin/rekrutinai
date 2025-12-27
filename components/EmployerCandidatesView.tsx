
import React, { useMemo } from 'react';
import { CandidateApplication, EmployerJob } from '../types.ts';
import { BrainCircuit, Mail, Calendar, CheckCircle, XCircle, Clock, ChevronRight, User } from 'lucide-react';

interface EmployerCandidatesViewProps {
  jobs: EmployerJob[];
  candidates: CandidateApplication[];
  selectedJobId: string | null;
  onSelectJob: (id: string) => void;
  onUpdateStatus: (id: string, status: CandidateApplication['status']) => void;
}

export const EmployerCandidatesView: React.FC<EmployerCandidatesViewProps> = ({ 
  jobs, 
  candidates, 
  selectedJobId, 
  onSelectJob,
  onUpdateStatus
}) => {
  
  // Filter candidates by selected job
  const filteredCandidates = useMemo(() => {
    if (!selectedJobId) return [];
    return candidates.filter(c => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  // SORT LOGIC: High Score -> Low Score
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => b.aiFitScore - a.aiFitScore);
  }, [filteredCandidates]);

  const activeJob = jobs.find(j => j.id === selectedJobId);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700';
      case 'Reviewed': return 'bg-purple-50 text-purple-700';
      case 'Interview': return 'bg-green-50 text-green-700';
      case 'Rejected': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
      {/* Left Sidebar: Job List */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Select Job Posting</h3>
        </div>
        <div className="overflow-y-auto flex-1">
          {jobs.map(job => (
            <div 
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedJobId === job.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'
              }`}
            >
              <h4 className={`text-sm font-bold ${selectedJobId === job.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                {job.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">{job.location} • {job.type}</p>
              <div className="flex justify-between items-center mt-3">
                 <span className="text-xs font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                   {candidates.filter(c => c.jobId === job.id).length} Applicants
                 </span>
                 {selectedJobId === job.id && <ChevronRight size={16} className="text-indigo-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: Candidate List */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {!activeJob ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <User size={48} className="mb-4 text-slate-200" />
            <p>Select a job to view candidates</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Candidates for {activeJob.title}</h2>
                <p className="text-sm text-slate-500">Sorted by AI Fit Score (High to Low)</p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">
                {sortedCandidates.length} Total
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {sortedCandidates.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  No applications received yet.
                </div>
              ) : (
                sortedCandidates.map(candidate => (
                  <div key={candidate.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                          {candidate.candidateName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="text-lg font-bold text-slate-900">{candidate.candidateName}</h3>
                             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(candidate.status)}`}>
                               {candidate.status}
                             </span>
                          </div>
                          <p className="text-sm text-slate-500">{candidate.candidateTitle}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Mail size={12} /> {candidate.candidateEmail}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI SCORE BADGE */}
                      <div className={`flex flex-col items-end px-3 py-2 rounded-lg border ${getScoreColor(candidate.aiFitScore)}`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          <BrainCircuit size={18} />
                          <span className="text-xl">{candidate.aiFitScore}%</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">Fit Score</span>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-start gap-2">
                         <BrainCircuit size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                         <p className="text-sm text-slate-700 italic">"{candidate.aiSummary}"</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {candidate.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                       <button 
                        onClick={() => onUpdateStatus(candidate.id, 'Rejected')}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center border border-transparent hover:border-red-100 transition-colors"
                       >
                         <XCircle size={14} className="mr-1.5" /> Reject
                       </button>
                       <button 
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg flex items-center border border-slate-200 transition-colors"
                       >
                         <Calendar size={14} className="mr-1.5" /> View Resume
                       </button>
                       <button 
                        onClick={() => onUpdateStatus(candidate.id, 'Interview')}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center shadow-sm transition-colors"
                       >
                         <CheckCircle size={14} className="mr-1.5" /> Interview
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
