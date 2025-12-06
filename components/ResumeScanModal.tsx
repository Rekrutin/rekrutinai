
import React, { useState, useEffect } from 'react';
import { Resume } from '../types';
import { scanAndOptimizeResume } from '../services/geminiService';
import { X, Sparkles, CheckCircle, ArrowRight, Wand2, RefreshCw } from 'lucide-react';

interface ResumeScanModalProps {
  isOpen: boolean;
  resume: Resume | null;
  onClose: () => void;
  onApply: (optimizedText: string, optimizedScore: number) => void;
}

export const ResumeScanModal: React.FC<ResumeScanModalProps> = ({ isOpen, resume, onClose, onApply }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [result, setResult] = useState<{
    originalScore: number;
    optimizedScore: number;
    optimizedText: string;
    improvements: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen && resume) {
      handleScan();
    } else {
      // Reset state when closed
      setTimeout(() => {
        setStatus('idle');
        setResult(null);
      }, 300);
    }
  }, [isOpen, resume]);

  const handleScan = async () => {
    if (!resume) return;
    setStatus('scanning');
    try {
      const data = await scanAndOptimizeResume(resume.content);
      setResult(data);
      setStatus('complete');
    } catch (error) {
      console.error("Scan failed", error);
      setStatus('idle'); // Or error state
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result.optimizedText, result.optimizedScore);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={24} /> AI Resume Optimizer
            </h2>
            <p className="text-sm text-slate-500">Transform your resume into an ATS-friendly powerhouse.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          {status === 'scanning' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Wand2 size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Optimizing your Resume...</h3>
              <p className="text-slate-500 max-w-md text-center">
                Our AI is analyzing keywords, improving formatting, and quantifying your achievements for maximum impact.
              </p>
            </div>
          )}

          {status === 'complete' && result && resume && (
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Left: Before */}
              <div className="flex flex-col h-full border-r border-slate-200 bg-white">
                <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex justify-between items-center">
                  <span className="font-bold text-red-800 text-sm uppercase tracking-wide">Original Version</span>
                  <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 shadow-sm">
                    ATS Score: {result.originalScore}
                  </span>
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-600 leading-relaxed">
                    {resume.content}
                  </pre>
                </div>
              </div>

              {/* Right: After */}
              <div className="flex flex-col h-full bg-indigo-50/30">
                <div className="px-6 py-3 bg-indigo-100 border-b border-indigo-200 flex justify-between items-center">
                  <span className="font-bold text-indigo-900 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Sparkles size={14} /> Optimized Version
                  </span>
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md shadow-indigo-200">
                    ATS Score: {result.optimizedScore}
                  </span>
                </div>
                
                {/* Improvements Summary */}
                <div className="px-6 py-4 bg-white border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Key Improvements Made:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.improvements.map((imp, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        <CheckCircle size={10} /> {imp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-white">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 leading-relaxed selection:bg-indigo-100">
                    {result.optimizedText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-200 bg-white flex justify-between items-center z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            {status === 'complete' && (
              <button 
                onClick={handleScan}
                className="px-6 py-2.5 text-slate-500 font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} /> Re-scan
              </button>
            )}
            <button 
              onClick={handleApply}
              disabled={status !== 'complete'}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Changes <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
