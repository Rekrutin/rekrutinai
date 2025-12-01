
import React from 'react';
import { X, Lock, Star, CheckCircle } from 'lucide-react';

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
  message?: string;
}

export const UpgradeLimitModal: React.FC<UpgradeLimitModalProps> = ({ isOpen, onClose, onUpgrade, featureName, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Lock size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Unlock {featureName}</h2>
          <p className="text-slate-500 mb-6">
            {message || `You've reached the free limit for ${featureName}. Upgrade to Pro to continue without limits.`}
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 text-left space-y-3 mb-8 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-2">Pro Plan Benefits</h3>
            <div className="flex items-center text-sm text-slate-700">
              <CheckCircle size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
              <span>Unlimited Job Tracking & ATS Scans</span>
            </div>
            <div className="flex items-center text-sm text-slate-700">
               <CheckCircle size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
               <span>AI Success Probability & Analytics</span>
            </div>
            <div className="flex items-center text-sm text-slate-700">
               <CheckCircle size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
               <span>Browser Extension Access</span>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <Star size={18} className="text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
            Upgrade Now - Rp165k/mo
          </button>
          
          <button 
            onClick={onClose}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600 font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
