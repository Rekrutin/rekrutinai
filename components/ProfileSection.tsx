import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Save, User, Briefcase, FileText, Hash } from 'lucide-react';

interface ProfileSectionProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(profile);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
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
                value={formData.name}
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
                value={formData.title}
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
              value={formData.summary}
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
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. React, Figma, Project Management, SEO"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.filter(s => s).map((skill, idx) => (
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