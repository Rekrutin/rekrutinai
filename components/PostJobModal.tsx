
import React, { useState } from 'react';
import { EmployerJob } from '../types';
import { X } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (job: Omit<EmployerJob, 'id' | 'created_at' | 'applicants_count' | 'status'>) => void;
  isMandatory?: boolean; // New prop to enforce posting
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onPost, isMandatory = false }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EmployerJob['type']>('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      onPost({
        title,
        location,
        type,
        salary_range: salary,
        description
      });
      // Reset form
      setTitle('');
      setLocation('');
      setType('Full-time');
      setSalary('');
      setDescription('');
      
      // Only close if not mandatory (handled by parent if mandatory)
      if (!isMandatory) {
        onClose();
      }
    }
  };

  // If mandatory, user cannot close via X or backdrop
  const handleClose = () => {
    if (!isMandatory) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* If mandatory, prevent clicking outside */}
      {isMandatory && <div className="absolute inset-0 z-0 bg-black/20" />}
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isMandatory ? 'Create Your First Job Posting' : 'Post a Job'}
            </h2>
            {isMandatory && (
              <p className="text-xs text-indigo-600 font-medium mt-1">Required to access dashboard</p>
            )}
          </div>
          {!isMandatory && (
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Marketing Manager"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Remote, Jakarta"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
               <select
                 value={type}
                 onChange={(e) => setType(e.target.value as EmployerJob['type'])}
                 className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               >
                 <option value="Full-time">Full-time</option>
                 <option value="Part-time">Part-time</option>
                 <option value="Contract">Contract</option>
                 <option value="Internship">Internship</option>
                 <option value="Freelance">Freelance</option>
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Optional)</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Rp 10.000.000 - Rp 15.000.000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
            >
              {isMandatory ? 'Post Job & Go to Dashboard' : 'Post Job Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
