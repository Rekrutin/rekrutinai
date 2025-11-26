import React, { useState } from 'react';
import { Job, JobAnalysis } from '../types';
import { analyzeJobFit } from '../services/geminiService';
import { X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface AIAnalyzerModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (jobId: string, analysis: JobAnalysis) => void;
}

export const AIAnalyzerModal: React.FC<AIAnalyzerModalProps> = ({ job, isOpen, onClose, onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Use job description if available, otherwise use title + company as fallback context
      const jobContext = job.description || `${job.title} at ${job.company}`;
      const result = await analyzeJobFit(resumeText, jobContext);
      onAnalysisComplete(job.id, result);
      onClose();
    } catch (err) {
      setError("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles size={20} />
            <h2 className="text-lg font-bold">AI Fit Analyzer</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Analyzing fit for:</h3>
            <p className="text-slate-900 font-medium">{job.title} at {job.company}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paste your Resume/CV Text
            </label>
            <textarea
              className="w-full h-40 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
              placeholder="Paste the full text of your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            ></textarea>
            <p className="text-xs text-slate-400 mt-1">We don't store your resume text permanently.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};