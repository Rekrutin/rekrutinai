
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Save, User, Briefcase, FileText, Hash, Zap, Key } from 'lucide-react';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Ensure we have a valid object structure even if props are partial
    setFormData({
      ...profile,
      skills: profile.skills || []
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, skills }));
    setIsSaved(false);
  };

  const handleGenerateToken = () => {
    const newToken = 'rk_live_' + Math.random().toString(36).substr(2, 16);
    const updated = { ...formData, extensionToken: newToken };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Pro Features Section */}
      {profile.plan !== 'Free' && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg border border-indigo-500 overflow-hidden text-white">
           <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/20 rounded-lg">
                    <Zap size={20} className="text-yellow-300" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">Pro Features Active</h3>
                    <p className="text-indigo-100 text-xs">Manage your premium access tokens.</p>
                 </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                 <label className="text-xs font-bold text-indigo-100 uppercase mb-2 block flex items-center gap-2">
                    <Key size={12} /> Chrome Extension API Token
                 </label>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={formData.extensionToken || 'No token generated'} 
                      className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-sm font-mono text-white outline-none"
                    />
                    <button 
                      onClick={handleGenerateToken}
                      className="px-3 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
                    >
                      {formData.extensionToken ? 'Regenerate' : 'Generate'}
                    </button>
                 </div>
                 <p className="text-[10px] text-indigo-200 mt-2">
                    Paste this token into the RekrutIn Chrome Extension to auto-save jobs from LinkedIn.
                 </p>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
            <p className="text-sm text-slate-500">This information is used by the AI Agent to give you personalized advice.</p>
          </div>
          {isSaved && <span className="text-green-600 text-sm font-medium animate-fade-in">Saved successfully!</span>}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                <User size={16} className="mr-2 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                <Briefcase size={16} className="mr-2 text-slate-400" /> Current Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Senior Product Designer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <FileText size={16} className="mr-2 text-slate-400" /> Professional Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary || ''}
              onChange={handleChange}
              rows={4}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Briefly describe your experience and career goals..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Hash size={16} className="mr-2 text-slate-400" /> Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills?.join(', ') || ''}
              onChange={handleSkillsChange}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. React, Figma, Project Management, SEO"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {(formData.skills || []).filter(s => s).map((skill, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Save size={18} className="mr-2" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
