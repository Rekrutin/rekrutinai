
import React, { useState } from 'react';
import { Resume, PlanType } from '../types';
import { FileText, Upload, CheckCircle, AlertCircle, Trash2, Search, Lock } from 'lucide-react';
import { MAX_FREE_ATS_SCANS } from '../constants';

interface ResumeSectionProps {
  resumes: Resume[];
  onAddResume: (resume: Resume) => void;
  onDeleteResume: (id: string) => void;
  onUpdateResume: (id: string, updates: Partial<Resume>) => void;
  onAnalyzeResume: (resume: Resume) => Promise<void>;
  plan: PlanType;
  scansUsed: number;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ 
  resumes, 
  onAddResume, 
  onDeleteResume, 
  onUpdateResume, 
  onAnalyzeResume,
  plan,
  scansUsed
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newResumeText, setNewResumeText] = useState('');
  const [newResumeName, setNewResumeName] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const isFree = plan === 'Free';
  const scansRemaining = Math.max(0, MAX_FREE_ATS_SCANS - scansUsed);
  const isLimitReached = isFree && scansRemaining === 0;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResumeName && newResumeText) {
      const newResume: Resume = {
        id: Math.random().toString(36).substr(2, 9),
        name: newResumeName,
        content: newResumeText,
        uploadDate: new Date().toISOString()
      };
      onAddResume(newResume);
      setNewResumeName('');
      setNewResumeText('');
      setIsUploadOpen(false);
    }
  };

  const handleAnalyzeClick = async (resume: Resume) => {
    setAnalyzingId(resume.id);
    try {
      await onAnalyzeResume(resume);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-xl font-bold text-slate-900">Resume Manager</h2>
           <p className="text-slate-500 text-sm">Upload multiple versions and check their ATS compatibility.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Upload size={16} className="mr-2" /> Upload Resume
        </button>
      </div>

      {/* Usage Banner */}
      {isFree && (
        <div className={`p-4 rounded-xl border flex justify-between items-center ${isLimitReached ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'}`}>
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isLimitReached ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
               {isLimitReached ? <Lock size={20} /> : <Search size={20} />}
             </div>
             <div>
               <p className={`text-sm font-bold ${isLimitReached ? 'text-red-800' : 'text-indigo-900'}`}>
                 {isLimitReached ? 'Free AI Scans Limit Reached' : 'Free AI Scans Available'}
               </p>
               <p className="text-xs text-slate-500">
                 You have used <span className="font-bold">{scansUsed}</span> of <span className="font-bold">{MAX_FREE_ATS_SCANS}</span> free scans.
               </p>
             </div>
           </div>
           {isLimitReached && (
             <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
               Upgrade to Unlock
             </span>
           )}
        </div>
      )}

      {isUploadOpen && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg animate-fade-in">
          <h3 className="font-semibold text-slate-800 mb-4">Add New Resume</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Resume Name / Version</label>
              <input
                type="text"
                required
                value={newResumeName}
                onChange={(e) => setNewResumeName(e.target.value)}
                placeholder="e.g. Frontend Developer Version"
                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Resume Text Content</label>
              <textarea
                required
                value={newResumeText}
                onChange={(e) => setNewResumeText(e.target.value)}
                placeholder="Paste the full text of your resume here (Ctrl+A, Ctrl+C from your PDF)..."
                className="w-full h-32 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">Note: For this demo, please paste text. In production, we'd parse your PDF.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                Save Resume
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.map(resume => (
          <div key={resume.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
                   <FileText size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800">{resume.name}</h3>
                   <span className="text-xs text-slate-400">Added {new Date(resume.uploadDate).toLocaleDateString()}</span>
                 </div>
               </div>
               <button onClick={() => onDeleteResume(resume.id)} className="text-slate-300 hover:text-red-500">
                 <Trash2 size={16} />
               </button>
             </div>

             {/* ATS Score Section */}
             <div className="mb-4">
                {resume.atsScore !== undefined ? (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">ATS Score</span>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                        resume.atsScore >= 80 ? 'bg-green-100 text-green-700' : 
                        resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {resume.atsScore}/100
                      </span>
                    </div>
                    {resume.atsAnalysis && (
                      <ul className="text-xs text-slate-600 space-y-1 mt-2">
                        {resume.atsAnalysis.slice(0, 3).map((tip, i) => (
                          <li key={i} className="flex items-start">
                            <AlertCircle size={10} className="mr-1.5 mt-0.5 text-indigo-500 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-2">Not analyzed yet</p>
                    <button 
                      onClick={() => handleAnalyzeClick(resume)}
                      disabled={analyzingId === resume.id}
                      className={`w-full py-1.5 border rounded text-xs font-semibold transition-colors flex items-center justify-center ${
                        isLimitReached 
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                          : 'bg-white text-slate-700 border-slate-300 hover:text-indigo-600 hover:border-indigo-300'
                      }`}
                    >
                      {analyzingId === resume.id ? (
                        <span className="animate-pulse">Analyzing...</span>
                      ) : (
                        <>
                           {isLimitReached ? <Lock size={12} className="mr-1.5" /> : <Search size={12} className="mr-1.5" />} 
                           {isLimitReached ? 'Limit Reached' : 'Check ATS Score'}
                        </>
                      )}
                    </button>
                  </div>
                )}
             </div>
             
             <div className="text-xs text-slate-400 truncate">
                {resume.content.substring(0, 60)}...
             </div>
          </div>
        ))}
        
        {resumes.length === 0 && !isUploadOpen && (
          <div className="col-span-1 md:col-span-2 text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-slate-500 font-medium">No resumes uploaded yet.</p>
            <p className="text-slate-400 text-sm mt-1">Upload your CV to check if it's ATS friendly.</p>
          </div>
        )}
      </div>
    </div>
  );
};
