
import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, X, ArrowRight, Loader2, Lock, Mail, Eye, EyeOff, User, Briefcase, Hash } from 'lucide-react';
import { UserProfile, Resume } from '../types';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile, resume: Resume) => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'credentials'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Form State
  const [scannedData, setScannedData] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStep('scanning');

    // SMART SIMULATION: Extract data from filename
    // e.g., "Muhammad_Fauzan_Frontend.pdf" -> Name: Muhammad Fauzan, Title: Frontend
    const filenameBase = uploadedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const nameParts = filenameBase.split(/[_-]/); // Split by _ or -
    
    // Guessing logic
    const guessedName = nameParts.slice(0, 2).join(' ') || 'Guest User';
    const guessedTitle = nameParts.length > 2 ? nameParts.slice(2).join(' ') : 'Software Engineer';

    setTimeout(() => {
      const mockProfile: UserProfile = {
        name: guessedName, 
        email: 'guest@example.com',
        title: guessedTitle,
        summary: `Experienced ${guessedTitle} with a proven track record in building scalable solutions. Passionate about technology and continuous learning.`,
        skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Agile'], // Default strong stack
        plan: 'Free',
        atsScansUsed: 0
      };
      setScannedData(mockProfile);
      setEmail(''); // Reset email for manual entry
      setStep('review');
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUpdateScannedData = (field: keyof UserProfile, value: any) => {
    if (scannedData) {
      setScannedData({ ...scannedData, [field]: value });
    }
  };

  const handleContinueToCredentials = () => {
    setStep('credentials');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedData && file && email && password) {
      const finalProfile: UserProfile = {
        ...scannedData,
        email: email
      };
      
      const enrichedResumeContent = `
NAME: ${finalProfile.name}
EMAIL: ${email}
TITLE: ${finalProfile.title}

PROFESSIONAL SUMMARY
${finalProfile.summary}

SKILLS
${finalProfile.skills.join(' • ')}

EXPERIENCE
${finalProfile.title} | Tech Company | 2021 - Present
- Delivered key projects using ${finalProfile.skills[0] || 'Modern Tech'}.
- Optimized performance and scalability.

EDUCATION
Bachelor of Science
University of Technology | 2017 - 2021
`;

      const newResume: Resume = {
        id: 'initial-resume',
        name: file.name,
        content: enrichedResumeContent, 
        uploadDate: new Date().toISOString(),
      };
      
      onComplete(finalProfile, newResume);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {step === 'upload' && (
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm">
              <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Let's build your profile</h2>
            <p className="text-slate-500 mb-8">Drop your resume here. Our AI will extract your details instantly.</p>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer group ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-105' 
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <input 
                type="file" 
                className="hidden" 
                id="resume-upload" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                }`}>
                  <Upload size={28} />
                </div>
                <p className="font-bold text-slate-700 text-lg">Click to Upload or Drag & Drop</p>
                <p className="text-sm text-slate-400 mt-2">PDF, DOCX up to 10MB</p>
              </label>
            </div>
            
            <p className="text-xs text-slate-400 mt-6">By uploading, you agree to our Terms & Privacy Policy.</p>
          </div>
        )}

        {step === 'scanning' && (
          <div className="p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <FileText size={32} className="text-indigo-600 animate-pulse" />
               </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your Resume...</h3>
            <div className="h-6 overflow-hidden relative max-w-xs mx-auto">
               <div className="absolute w-full text-sm text-indigo-500 font-medium animate-float">
                  Extracting Skills...
               </div>
               <div className="absolute w-full text-sm text-indigo-500 font-medium animate-float" style={{ animationDelay: '1s', opacity: 0 }}>
                  Identifying Experience...
               </div>
            </div>
          </div>
        )}

        {step === 'review' && scannedData && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <CheckCircle size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Resume Parsed!</h2>
              <p className="text-slate-500">Review the extracted details below.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 space-y-4 shadow-inner">
               {/* Name Input */}
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                   <User size={12} /> Full Name
                 </label>
                 <input 
                    type="text" 
                    value={scannedData.name}
                    onChange={(e) => handleUpdateScannedData('name', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
               </div>

               {/* Title Input */}
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                   <Briefcase size={12} /> Job Title
                 </label>
                 <input 
                    type="text" 
                    value={scannedData.title}
                    onChange={(e) => handleUpdateScannedData('title', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
               </div>

               {/* Skills Tag Input (Simulated as text for now) */}
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                   <Hash size={12} /> Top Skills Found
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {scannedData.skills.map((skill, i) => (
                     <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-indigo-600 shadow-sm">
                       {skill}
                     </span>
                   ))}
                   <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-xs text-slate-400">
                     + Edit in Profile
                   </span>
                 </div>
               </div>
            </div>

            <button 
              onClick={handleContinueToCredentials}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center group"
            >
              Confirm & Continue <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 'credentials' && (
           <div className="p-8">
             <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <Lock size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Secure your Account</h2>
                <p className="text-slate-500">Create a password to access your AI dashboard.</p>
             </div>

             <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Mail size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                        placeholder="name@example.com"
                      />
                   </div>
                </div>
                
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Lock size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center group"
                   >
                     Create Account
                   </button>
                </div>
             </form>
           </div>
        )}
      </div>
    </div>
  );
};
