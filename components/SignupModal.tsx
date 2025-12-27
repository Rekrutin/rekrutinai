
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, X, ArrowRight, Lock, Mail, Eye, EyeOff, User, Briefcase, ChevronLeft, AlertCircle, Bot, Zap, Fingerprint } from 'lucide-react';
import { UserProfile, Resume } from '../types.ts';
import { parseResumeFile } from '../services/geminiService.ts';
import { supabase } from '../services/supabaseClient.ts';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile, resume: Resume, password?: string) => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'credentials'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [scannedData, setScannedData] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('upload');
        setFile(null);
        setScannedData(null);
        setEmail('');
        setPassword('');
        setErrorMsg(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setStep('scanning');
    setErrorMsg(null);
    try {
      const profile = await parseResumeFile(uploadedFile);
      setScannedData(profile);
      setEmail(profile.email || '');
      setStep('review');
    } catch (error) {
      handleSkipToManual();
      setErrorMsg("We couldn't auto-parse this file. Please enter details manually.");
    }
  };

  const handleSkipToManual = () => {
    setScannedData({ name: '', title: '', email: '', summary: '', skills: [], plan: 'Free', atsScansUsed: 0, extensionUses: 0, resumeText: '' });
    setStep('review');
  };

  const handleUpdateScannedData = (field: keyof UserProfile, value: any) => {
    if (scannedData) setScannedData({ ...scannedData, [field]: value });
  };

  const finalizeOnboarding = (userId: string = 'demo-user') => {
    const finalProfile: UserProfile = scannedData ? {
      ...scannedData,
      email: email || scannedData.email,
      id: userId
    } : {
      name: 'Guest User',
      title: 'Professional',
      email: email,
      summary: '',
      skills: [],
      plan: 'Free',
      atsScansUsed: 0,
      extensionUses: 0,
      id: userId
    };
    
    const initialResume: Resume = {
      id: 'initial-' + Date.now(),
      title: file?.name || 'Uploaded Resume',
      name: file?.name || 'Uploaded Resume',
      file_path: '',
      extracted_text: scannedData?.resumeText || scannedData?.summary || 'No text extracted',
      ats_score: 0,
      uploadDate: new Date().toISOString()
    };

    onComplete(finalProfile, initialResume, password);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    // If Supabase is not configured, allow entering in "Demo Mode"
    if (!supabase) {
      console.warn("Supabase not configured. Entering Demo Mode.");
      setTimeout(() => {
        finalizeOnboarding();
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: scannedData?.name || '',
            title: scannedData?.title || ''
          }
        }
      });

      if (error) {
        // For some specific errors like "Signup disabled", let the user enter demo mode
        if (error.message.includes("disabled") || error.message.includes("not found")) {
           finalizeOnboarding();
        } else {
           setErrorMsg(error.message);
           setIsSubmitting(false);
        }
      } else if (data.user) {
        finalizeOnboarding(data.user.id);
      } else {
        // Fallback for cases where sign up succeeds but no user is returned immediately (e.g. email confirm required)
        finalizeOnboarding();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Fallback to demo mode on unexpected network errors to prevent blocking the user
      finalizeOnboarding();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden relative border border-slate-200">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 rounded-full transition-colors z-10"><X size={24} /></button>

        {step === 'upload' && (
          <div className="p-10 md:p-14 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-indigo-600 shadow-sm"><Sparkles size={40} /></div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Sync your career.</h2>
            <p className="text-slate-500 mb-12 font-medium text-lg leading-relaxed px-4">Upload your CV to auto-generate your professional profile using RekrutIn HR AI.</p>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} 
              onDragLeave={() => setIsDragging(false)} 
              onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }} 
              className={`border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 cursor-pointer group ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
            >
              <input type="file" className="hidden" id="res-upload" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
              <label htmlFor="res-upload" className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-slate-400 mb-6 group-hover:text-indigo-500 transition-colors" />
                <p className="font-extrabold text-slate-700 text-2xl">Drop Resume Here</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-3">PDF / DOCX • MAX 10MB</p>
              </label>
            </div>
            <button onClick={handleSkipToManual} className="mt-10 text-sm text-slate-400 hover:text-indigo-600 font-black transition-colors uppercase tracking-widest">SKIP & ENTER MANUALLY</button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="p-20 text-center animate-fade-in">
            <div className="relative w-40 h-40 mx-auto mb-12">
               <div className="absolute inset-0 border-4 border-indigo-100/50 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/5 rounded-full shadow-inner">
                  <Bot size={64} className="text-indigo-600 animate-bounce" />
               </div>
               <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 mb-4 tracking-tight">Talent Profiling...</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">Architecting your professional DNA with RekrutIn HR AI</p>
          </div>
        )}

        {step === 'review' && scannedData && (
          <div className="p-10 md:p-14 animate-fade-in relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>

            <div className="text-center mb-10 relative z-10">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative bg-white border border-green-100 rounded-2xl p-4 shadow-sm flex items-center justify-center text-green-500">
                  <Fingerprint size={40} className="animate-pulse" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Refine Identity</h2>
              <p className="text-slate-500 font-medium text-lg">We've mapped your professional profile.</p>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mb-10 space-y-6 relative z-10">
               <div className="group">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                   <User size={14} className="text-indigo-400" /> Full Name
                 </label>
                 <input 
                   type="text" 
                   value={scannedData.name} 
                   onChange={(e) => handleUpdateScannedData('name', e.target.value)} 
                   className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
                 />
               </div>
               <div className="group">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1 flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                   <Briefcase size={14} className="text-indigo-400" /> Professional Title
                 </label>
                 <input 
                   type="text" 
                   value={scannedData.title} 
                   onChange={(e) => handleUpdateScannedData('title', e.target.value)} 
                   className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
                 />
               </div>
            </div>

            <button 
              onClick={() => setStep('credentials')} 
              className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center group transition-all active:scale-95 relative z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              NEXT TO SIGNUP <ArrowRight size={28} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {step === 'credentials' && (
           <div className="p-10 md:p-14 animate-fade-in relative">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-2xl relative">
                  <Lock size={36} />
                  <div className="absolute -top-2 -right-2 bg-indigo-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <Zap size={14} className="fill-white text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Secure Gateway</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">Your professional data is isolated in your private instance.</p>
             </div>
             <form onSubmit={handleCreateAccount} className="space-y-6">
                {errorMsg && <div className="p-5 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3 border border-red-100 animate-shake"><AlertCircle size={20} /> {errorMsg}</div>}
                <div>
                   <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Universal Email Address</label>
                   <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-lg text-slate-800 shadow-sm transition-all" 
                      placeholder="name@career.com" 
                   />
                </div>
                <div>
                   <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">System Password</label>
                   <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-lg text-slate-800 shadow-sm transition-all" 
                        placeholder="••••••••" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-indigo-600 transition-colors">{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button>
                   </div>
                </div>
                <div className="pt-6">
                   <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center active:scale-95 group">
                     {isSubmitting ? (
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>SYNCING TO CLOUD...</span>
                        </div>
                     ) : (
                       <>FINALIZE ONBOARDING <CheckCircle size={24} className="ml-3 group-hover:scale-110 transition-transform text-green-400" /></>
                     )}
                   </button>
                </div>
             </form>
           </div>
        )}
      </div>
    </div>
  );
};
