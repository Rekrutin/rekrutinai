
import React, { useState, useRef } from 'react';
import { Resume, PlanType } from '../types';
import { FileText, Upload, CheckCircle, AlertCircle, Trash2, Search, Lock, Eye, Zap, RefreshCw, Loader2, File as FileIcon, X, Sparkles } from 'lucide-react';
import { MAX_FREE_ATS_SCANS } from '../constants';
import { ResumePreviewDrawer } from './ResumePreviewDrawer';
import { ResumeScanModal } from './ResumeScanModal';
import { parseResumeFile } from '../services/geminiService';

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
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Upload & Parsing State
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFile, setParsedFile] = useState<File | null>(null);
  const [parsedContent, setParsedContent] = useState('');
  const [parsedName, setParsedName] = useState('');
  
  // Drawers & Modals
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scanningResume, setScanningResume] = useState<Resume | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFree = plan === 'Free';
  const scansRemaining = Math.max(0, MAX_FREE_ATS_SCANS - scansUsed);
  const isLimitReached = isFree && scansRemaining === 0;

  const resetUploadState = () => {
    setParsedFile(null);
    setParsedContent('');
    setParsedName('');
    setIsParsing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setParsedFile(file);
      setIsParsing(true);
      
      // Set default name from filename (remove extension)
      setParsedName(file.name.replace(/\.[^/.]+$/, ""));

      try {
        // Use existing AI service to parse the file
        const profile = await parseResumeFile(file);
        
        // Convert structured profile back to a readable text format for storage/display
        const generatedContent = `
NAME: ${profile.name}
EMAIL: ${profile.email}
TITLE: ${profile.title}

PROFESSIONAL SUMMARY
${profile.summary}

SKILLS
${profile.skills.join(' • ')}
        `.trim();
        
        setParsedContent(generatedContent);
      } catch (err) {
        console.error("Parsing error", err);
        setParsedContent("Could not auto-parse text. Please try again.");
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleSaveResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedName && parsedContent) {
      const newResume: Resume = {
        id: Math.random().toString(36).substr(2, 9),
        name: parsedName,
        content: parsedContent,
        uploadDate: new Date().toISOString()
      };
      onAddResume(newResume);
      resetUploadState();
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
  
  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setIsDrawerOpen(true);
  };

  const handleScanClick = (resume: Resume) => {
    setScanningResume(resume);
    setIsScanModalOpen(true);
  };

  const handleApplyOptimization = (optimizedText: string, optimizedScore: number) => {
    if (scanningResume) {
      onUpdateResume(scanningResume.id, {
        content: optimizedText,
        atsScore: optimizedScore,
        atsAnalysis: ['Optimized by AI for maximum impact'] // Clear old feedback or add note
      });
      setIsScanModalOpen(false);
      setScanningResume(null);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
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
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:justify-between md:items-center gap-4 ${isLimitReached && isFree ? 'bg-red-50 border-red-200' : 'bg-gradient-to-r from-indigo-50 to-white border-indigo-100'}`}>
         <div className="flex items-center gap-3">
           <div className={`p-2.5 rounded-lg ${isLimitReached && isFree ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
             {isLimitReached && isFree ? <Lock size={20} /> : <Zap size={20} />}
           </div>
           <div>
             <p className={`text-sm font-bold ${isLimitReached && isFree ? 'text-red-800' : 'text-indigo-900'}`}>
               {isFree ? 'Free AI Scan Credits' : 'Pro Plan Active'}
             </p>
             <p className="text-xs text-slate-500">
               {isFree ? (
                 <>You have used <span className="font-bold">{scansUsed}</span> of <span className="font-bold">{MAX_FREE_ATS_SCANS}</span> free analysis scans.</>
               ) : (
                 <>You have <strong>Unlimited</strong> AI scans to perfect your CV.</>
               )}
             </p>
           </div>
         </div>
         {isLimitReached && isFree && (
           <span className="text-xs font-bold text-white bg-red-500 px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors cursor-default whitespace-nowrap">
             Limit Reached - Upgrade Plan
           </span>
         )}
         {!isFree && (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Unlimited Access
            </span>
         )}
      </div>

      {isUploadOpen && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg animate-fade-in">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Upload Resume</h3>
             <button onClick={() => setIsUploadOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
          </div>
          
          <div className="space-y-6">
            {!parsedFile ? (
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to Upload or Drag & Drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 5MB</p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      <FileIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{parsedFile.name}</p>
                      <p className="text-xs text-slate-500">{(parsedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button onClick={resetUploadState} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>

                {isParsing ? (
                  <div className="flex items-center gap-3 text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing document structure and extracting content...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                    <CheckCircle size={16} />
                    Ready to save as "{parsedName}"
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveResume}
                disabled={!parsedFile || isParsing}
                className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isParsing ? 'Processing...' : 'Save Resume'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.map(resume => (
          <div key={resume.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
                   <FileText size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 truncate max-w-[150px]">{resume.name}</h3>
                   <span className="text-xs text-slate-400">Added {new Date(resume.uploadDate).toLocaleDateString()}</span>
                 </div>
               </div>
               <div className="flex gap-1">
                  <button 
                    onClick={() => handleScanClick(resume)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm text-xs font-bold"
                    title="Optimize with AI"
                  >
                    <Sparkles size={14} /> Scan with AI
                  </button>
                  <button 
                    onClick={() => handleViewResume(resume)} 
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View Resume"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteResume(resume.id)} 
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
             </div>

             {/* ATS Score Section */}
             <div className="mb-4">
                {resume.atsScore !== undefined ? (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700">ATS Score</span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        resume.atsScore >= 80 ? 'bg-green-100 text-green-700' : 
                        resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {resume.atsScore}/100
                      </span>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                                resume.atsScore >= 80 ? 'bg-green-500' : 
                                resume.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${resume.atsScore}%` }}
                        ></div>
                    </div>

                    {resume.atsAnalysis && (
                      <div className="space-y-2 mt-3 flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase">AI Feedback</p>
                        <ul className="text-xs text-slate-600 space-y-1.5">
                            {resume.atsAnalysis.slice(0, 3).map((tip, i) => (
                            <li key={i} className="flex items-start">
                                <AlertCircle size={10} className="mr-1.5 mt-0.5 text-indigo-500 flex-shrink-0" />
                                <span>{tip}</span>
                            </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    
                    <button 
                        onClick={() => handleScanClick(resume)}
                        className="mt-4 w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                        <Sparkles size={12} className="text-yellow-300" /> Optimize to 100%
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 text-center border border-dashed border-slate-200 flex-1 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Not Analyzed Yet</p>
                    <p className="text-xs text-slate-500 mb-4">Check if your resume is readable by ATS bots.</p>
                    
                    <div className="space-y-2">
                        <button 
                          onClick={() => handleAnalyzeClick(resume)}
                          disabled={analyzingId === resume.id}
                          className={`w-full py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center shadow-sm ${
                            isLimitReached 
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                              : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md'
                          }`}
                        >
                          {analyzingId === resume.id ? (
                            <>
                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Analyzing...
                            </>
                          ) : (
                            <>
                               {isLimitReached ? <Lock size={14} className="mr-2" /> : <Search size={14} className="mr-2" />} 
                               {isLimitReached ? 'Scan Limit Reached' : 'Check Score'}
                            </>
                          )}
                        </button>
                        
                        {/* Secondary 'Full Scan' Action */}
                        <button 
                          onClick={() => handleScanClick(resume)}
                          className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                           <Sparkles size={12} /> Scan & Optimize
                        </button>
                    </div>
                  </div>
                )}
             </div>
             
             <div 
               className="text-xs text-slate-400 truncate cursor-pointer hover:text-indigo-500 mt-auto pt-2 border-t border-slate-50"
               onClick={() => handleViewResume(resume)}
             >
                {resume.content ? resume.content.substring(0, 50) + '...' : 'No content preview'}
             </div>
          </div>
        ))}
        
        {/* Empty State / Add Card */}
        {resumes.length < 3 && !isUploadOpen && (
            <div 
                onClick={() => setIsUploadOpen(true)}
                className="col-span-1 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[280px]"
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-3 group-hover:text-indigo-500 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                </div>
                <h3 className="font-bold text-slate-700">Upload Another Version</h3>
                <p className="text-xs text-slate-400 mt-1 text-center px-4">Tailor different resumes for different job roles.</p>
            </div>
        )}
      </div>

      <ResumePreviewDrawer 
        resume={selectedResume}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <ResumeScanModal 
        isOpen={isScanModalOpen}
        resume={scanningResume}
        onClose={() => { setIsScanModalOpen(false); setScanningResume(null); }}
        onApply={handleApplyOptimization}
      />

      {showToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-slate-700">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-green-500/20">
            <CheckCircle size={18} strokeWidth={3} />
          </div>
          <div>
            <p className="font-bold text-sm">Resume Updated</p>
            <p className="text-xs text-slate-300">Your optimization has been saved.</p>
          </div>
        </div>
      )}
    </div>
  );
};
