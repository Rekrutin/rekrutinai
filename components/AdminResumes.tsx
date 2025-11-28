
import React from 'react';
import { Resume } from '../types';
import { FileText, Download, Eye, Calendar, User, Trash2 } from 'lucide-react';

interface AdminResumesProps {
  resumes: Resume[];
  onView: (resume: Resume) => void;
  onDelete: (id: string) => void;
}

export const AdminResumes: React.FC<AdminResumesProps> = ({ resumes, onView, onDelete }) => {
  
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this resume permanently?")) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">Resume Database</h3>
        <p className="text-sm text-slate-500">All resumes uploaded by users across the platform.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">ATS Score</th>
              <th className="px-6 py-4">Upload Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resumes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No resumes uploaded yet.
                </td>
              </tr>
            ) : (
              resumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText size={16} />
                      </div>
                      <span className="font-medium text-slate-800 truncate max-w-[200px]">{resume.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2 text-xs">
                        <User size={14} className="text-slate-400" /> User (Simulated)
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {resume.atsScore ? (
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                            resume.atsScore >= 80 ? 'bg-green-50 text-green-700 border-green-100' :
                            resume.atsScore >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            'bg-red-50 text-red-700 border-red-100'
                        }`}>
                            {resume.atsScore}/100
                        </span>
                    ) : (
                        <span className="text-xs text-slate-400">Not Scanned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400" />
                       {new Date(resume.uploadDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => onView(resume)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                       >
                          <Eye size={14} /> View
                       </button>
                       <button 
                        onClick={() => handleDelete(resume.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 ml-2 p-1 rounded hover:bg-red-50 transition-colors"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
