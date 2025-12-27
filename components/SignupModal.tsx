
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, X, ArrowRight, Lock, Mail, Eye, EyeOff, User, Briefcase, ChevronLeft, AlertCircle } from 'lucide-react';
import { UserProfile, Resume } from '../types';
import { parseResumeFile } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

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
      setErrorMsg(error.message);
      setIsSubmitting(false);
    } else if (data.user) {
      // Logic for initial resume upload would go into a follow-up or be handled after profile sync
      // For now, we allow the app state to catch up through Auth state listener
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 rounded-full transition-colors z-10"><X size={20} /></button>

        {step === 'upload' && (
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm"><Sparkles size={32} /></div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Build your profile</h2>
            <p className="text-slate-500 mb-8">Upload your resume to pre-fill your career details via Gemini AI.</p>
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }} className={`border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-105' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}>
              <input type="file" className="hidden" id="res-upload" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files && processFile(e.target.files[0])} />
              <label htmlFor="res-upload" className="cursor-pointer flex flex-col items-center">
                <Upload size={28} className="text-slate-400 mb-4" />
                <p className="font-bold text-slate-700 text-lg">Click to Upload</p>
                <p className="text-sm text-slate-400 mt-2">PDF, DOCX up to 10MB</p>
              </label>
            </div>
            <button onClick={handleSkipToManual} className="mt-6 text-sm text-slate-400 hover:text-indigo-600 font-medium">Or skip and enter manually</button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center"><FileText size={32} className="text-indigo-600 animate-pulse" /></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Parsing...</h3>
            <p className="text-sm text-indigo-500 font-medium animate-float">Extracting career metadata with Gemini 3 Pro...</p>
          </div>
        )}

        {step === 'review' && scannedData && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle size={28} /></div>
              <h2 className="text-2xl font-bold text-slate-900">Review Identity</h2>
              <p className="text-slate-500 text-sm">We'll use these to create your profile.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 space-y-4 shadow-inner">
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><User size={12} /> Full Name</label>
                 <input type="text" value={scannedData.name} onChange={(e) => handleUpdateScannedData('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Briefcase size={12} /> Job Title</label>
                 <input type="text" value={scannedData.title} onChange={(e) => handleUpdateScannedData('title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800" />
               </div>
            </div>
            <button onClick={() => setStep('credentials')} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg flex items-center justify-center group">
              Next: Sync to Cloud <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 'credentials' && (
           <div className="p-8">
             <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><Lock size={28} /></div>
                <h2 className="text-2xl font-bold text-slate-900">Cloud Account</h2>
                <p className="text-slate-500 text-sm">Resumes are stored on your private Supabase bucket.</p>
             </div>
             <form onSubmit={handleCreateAccount} className="space-y-4">
                {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2"><AlertCircle size={14} /> {errorMsg}</div>}
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                   <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                   <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                   </div>
                </div>
                <div className="pt-4">
                   <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center">
                     {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Complete Secure Signup'}
                   </button>
                </div>
             </form>
           </div>
        )}
      </div>
    </div>
  );
};
