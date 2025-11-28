
import React, { useEffect, useState } from 'react';
import { X, FileText, Calendar, Download, User, Hash, Briefcase } from 'lucide-react';
import { Resume } from '../types';

interface ResumePreviewDrawerProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumePreviewDrawer: React.FC<ResumePreviewDrawerProps> = ({ resume, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for transition
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {resume ? (
          <>
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 truncate max-w-[250px]">{resume.name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={12} /> Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* ATS Score Overview (if available) */}
              {resume.atsScore !== undefined && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">ATS Analysis</h3>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        resume.atsScore >= 80 ? 'bg-green-100 text-green-700' : 
                        resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                        Score: {resume.atsScore}/100
                    </span>
                  </div>
                  {resume.atsAnalysis && (
                     <div className="space-y-2">
                       {resume.atsAnalysis.map((feedback, idx) => (
                         <div key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                           {feedback}
                         </div>
                       ))}
                     </div>
                  )}
                </div>
              )}

              {/* Resume Document Preview (Mock Text) */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Briefcase size={16} /> Document Content
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner">
                  {resume.content}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                <Download size={18} /> Download Original PDF
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No resume selected
          </div>
        )}
      </div>
    </>
  );
};
