
import React, { useState, useRef, useEffect } from 'react';
import { Resume, PlanType } from '../types';
import { FileText, Upload, CheckCircle, Trash2, Search, Zap, Loader2, File as FileIcon, X, Sparkles, AlertTriangle, Eye, Database, Mail, Fingerprint } from 'lucide-react';
import { MAX_FREE_ATS_SCANS } from '../constants';
import { ResumePreviewDrawer } from './ResumePreviewDrawer';
import { ResumeScanModal } from './ResumeScanModal';
import { parseResumeFile, analyzeResumeATS } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

interface ResumeSectionProps {
  resumes: Resume[];
  setResumes: React.Dispatch<React.SetStateAction<Resume[]>>;
  plan: PlanType;
  scansUsed: number;
  session: any;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ 
  resumes, 
  setResumes,
  plan,
  scansUsed,
  session
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Drawer/Modal State
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scanningResume, setScanningResume] = useState<Resume | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFree = plan === 'Free';
  const scansRemaining = Math.max(0, MAX_FREE_ATS_SCANS - scansUsed);
  const isLimitReached = isFree && scansRemaining === 0;

  // FETCH RESUMES FROM DB
  useEffect(() => {
    const fetchResumes = async () => {
      if (!supabase || !session?.user) return;
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setResumes(data.map(r => ({
          ...r,
          atsScore: r.ats_score, // Map for legacy UI support
          uploadDate: r.created_at,
          name: r.title
        })));
      }
    };
    fetchResumes();
  }, [session]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !session?.user) {
      showToast("Please login to upload resumes", "error");
      return;
    }
    
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setUploadError(null);

    try {
      // 1. Check if bucket exists (silent check through attempt)
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'resumes')) {
         throw new Error("Storage bucket 'resumes' not found. Please create it in Supabase.");
      }

      // 2. Parse text with Gemini for extracted_text field
      const parsedProfile = await parseResumeFile(file);
      const extractedText = parsedProfile.resumeText || parsedProfile.summary;

      // 3. Create DB Record
      const { data: dbRecord, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: session.user.id,
          title: file.name.replace(/\.[^/.]+$/, ""),
          file_path: 'pending',
          extracted_text: extractedText,
          ats_score: 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 4. Upload to Storage: userId/resumeId-filename
      const filePath = `${session.user.id}/${dbRecord.id}-${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 5. Update DB with path
      const { error: updateError } = await supabase
        .from('resumes')
        .update({ file_path: filePath })
        .eq('id', dbRecord.id);

      if (updateError) throw updateError;

      // 6. Local Update
      const newResume: Resume = {
        ...dbRecord,
        file_path: filePath,
        name: dbRecord.title,
        uploadDate: dbRecord.created_at,
        atsScore: 0
      };
      setResumes(prev => [newResume, ...prev]);
      showToast("Resume uploaded ✅");
      setIsUploadOpen(false);

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload. Try again.");
      showToast(err.message || "Upload failed", "error");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteResume = async (id: string, filePath: string) => {
    if (!supabase || !window.confirm("Permanently delete this resume?")) return;

    try {
      // Delete from storage
      await supabase.storage.from('resumes').remove([filePath]);
      // Delete from DB
      await supabase.from('resumes').delete().eq('id', id);
      
      setResumes(prev => prev.filter(r => r.id !== id));
      showToast("Resume deleted");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleRunAIAtsCheck = async (resume: Resume) => {
    if (isLimitReached) {
      showToast("Scan limit reached. Upgrade to Pro!", "error");
      return;
    }
    
    try {
      const result = await analyzeResumeATS(resume.extracted_text || "");
      await supabase
        .from('resumes')
        .update({ ats_score: result.score })
        .eq('id', resume.id);
      
      setResumes(prev => prev.map(r => r.id === resume.id ? { ...r, atsScore: result.score, ats_score: result.score } : r));
      showToast("ATS Scan Complete!");
    } catch (e) {
      showToast("Scan failed", "error");
    }
  };

  const handleApplyOptimization = async (optimizedText: string, optimizedScore: number) => {
    if (scanningResume && supabase) {
      await supabase
        .from('resumes')
        .update({ extracted_text: optimizedText, ats_score: optimizedScore })
        .eq('id', scanningResume.id);

      setResumes(prev => prev.map(r => r.id === scanningResume.id ? { 
        ...r, 
        extracted_text: optimizedText, 
        atsScore: optimizedScore,
        ats_score: optimizedScore 
      } : r));
      
      setIsScanModalOpen(false);
      showToast("Optimization applied & saved to DB ✅");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-xl font-bold text-slate-900">Resume Manager</h2>
           <p className="text-slate-500 text-sm">Stored securely in your RekrutIn cloud account.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Upload size={16} className="mr-2" /> Upload New Version
        </button>
      </div>

      {/* VERIFICATION / DEBUG SECTION */}
      <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-700 font-mono text-[10px] space-y-1">
         <div className="flex items-center gap-2 mb-1 text-blue-400 font-bold uppercase tracking-widest border-b border-slate-800 pb-1">
            <Database size={10} /> Database Sync Status
         </div>
         <p className="flex items-center gap-2">
            <Fingerprint size={10} /> User ID: <span className="text-white">{session?.user?.id || 'Not logged in'}</span>
         </p>
         <p className="flex items-center gap-2">
            <Mail size={10} /> Email: <span className="text-white">{session?.user?.email || 'N/A'}</span>
         </p>
         <p className="flex items-center gap-2">
            <FileText size={10} /> Resumes Found: <span className="text-green-400 font-bold">{resumes.length} (Synced from Supabase)</span>
         </p>
      </div>

      {isUploadOpen && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-lg animate-fade-in">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">Upload File</h3>
             <button onClick={() => setIsUploadOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
          </div>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
              isParsing ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-slate-50 border-slate-300 hover:border-indigo-400'
            }`}
            onClick={() => !isParsing && fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
            {isParsing ? (
              <div className="flex flex-col items-center">
                 <Loader2 size={32} className="text-indigo-600 animate-spin mb-3" />
                 <p className="text-sm font-bold text-indigo-700">Persisting to Supabase Storage...</p>
                 <p className="text-xs text-indigo-500 mt-1">Extracting text & creating DB record</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={32} className="text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-700">Select PDF or DOCX</p>
                <p className="text-xs text-slate-400 mt-1">Automatic Cloud Backup</p>
              </div>
            )}
          </div>
          {uploadError && <p className="mt-4 text-xs text-red-500 font-medium flex items-center gap-1"><AlertTriangle size={12} /> {uploadError}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.map(resume => (
          <div key={resume.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group flex flex-col">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
                   <FileText size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-800 truncate max-w-[150px]">{resume.name}</h3>
                   <span className="text-xs text-slate-400">Synced {new Date(resume.uploadDate).toLocaleDateString()}</span>
                 </div>
               </div>
               <div className="flex gap-1">
                  <button onClick={() => { setSelectedResume(resume); setIsDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Eye size={16} /></button>
                  <button onClick={() => handleDeleteResume(resume.id, resume.file_path)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
               </div>
             </div>

             <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex-1 flex flex-col justify-center items-center">
                {resume.ats_score ? (
                   <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">ATS Visibility</span>
                        <span className="text-sm font-black text-indigo-600">{resume.ats_score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${resume.ats_score}%` }}></div>
                      </div>
                      <button 
                        onClick={() => { setScanningResume(resume); setIsScanModalOpen(true); }}
                        className="mt-3 w-full py-1.5 text-[10px] font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-all flex items-center justify-center gap-1"
                      >
                         <Sparkles size={10} /> Optimize Text
                      </button>
                   </div>
                ) : (
                   <>
                      <p className="text-xs font-medium text-slate-500 mb-3">No ATS Score Data</p>
                      <button 
                        onClick={() => handleRunAIAtsCheck(resume)}
                        className="w-full py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                         <Search size={12} /> Scan Now
                      </button>
                   </>
                )}
             </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border ${
          toast.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-slate-900 text-white border-slate-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-400" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      )}

      <ResumePreviewDrawer resume={selectedResume} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <ResumeScanModal isOpen={isScanModalOpen} resume={scanningResume} onClose={() => { setIsScanModalOpen(false); setScanningResume(null); }} onApply={handleApplyOptimization} />
    </div>
  );
};
