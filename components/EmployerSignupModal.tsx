
import React, { useState } from 'react';
import { Briefcase, Building2, Mail, Lock, X, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface EmployerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserProfile) => void;
}

export const EmployerSignupModal: React.FC<EmployerSignupModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && companyName && email && password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const newProfile: UserProfile = {
          name: fullName,
          title: 'Recruiter', // Default title
          companyName: companyName,
          email: email,
          summary: '',
          skills: [],
          plan: 'Free',
          atsScansUsed: 0
        };
        
        onComplete(newProfile);
        setIsLoading(false);
        // Reset form
        setFullName('');
        setCompanyName('');
        setEmail('');
        setPassword('');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <Building2 size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Employer Registration</h2>
            <p className="text-slate-500 text-sm">Create your company profile to start hiring top talent.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
               <input 
                 type="text" 
                 required
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                 placeholder="e.g. John Recruiter"
               />
             </div>

             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Briefcase size={18} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                    placeholder="e.g. Acme Corp"
                  />
               </div>
             </div>

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
                  placeholder="name@company.com"
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
                  className="w-full pl-10 pr-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                  placeholder="Min. 8 characters"
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

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-xs text-slate-400">
               By continuing, you agree to post at least one valid job opening.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
