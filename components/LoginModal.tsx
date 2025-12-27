
import React, { useState, useEffect } from 'react';
import { Mail, Lock, X, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string) => void;
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load remembered email on mount
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('rekrutin_remember_email');
      const isRemembered = localStorage.getItem('rekrutin_remember_me') === 'true';
      if (savedEmail && isRemembered) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      // Handle Remember Me logic
      if (rememberMe) {
        localStorage.setItem('rekrutin_remember_email', email);
        localStorage.setItem('rekrutin_remember_me', 'true');
      } else {
        localStorage.removeItem('rekrutin_remember_email');
        localStorage.removeItem('rekrutin_remember_me');
      }

      onLogin(email, password);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"><X size={20} /></button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm"><LogIn size={28} /></div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Access your synced applications and resumes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100"><AlertCircle size={14} /> {error}</div>}
            
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input 
                id="login-email"
                name="email"
                type="email" 
                autoComplete="email"
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="name@example.com" 
              />
            </div>
            
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600 font-medium group-hover:text-indigo-600 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</button>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center disabled:opacity-70">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Login'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">Don't have an account? <button onClick={onSwitchToSignup} className="font-bold text-indigo-600 hover:text-indigo-700">Sign up free</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};
