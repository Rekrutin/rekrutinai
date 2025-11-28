
import React, { useState, useEffect } from 'react';
import { Job, JobContact, JobStatus } from '../types';
import { X, Calendar, MapPin, Building2, ExternalLink, Mail, Linkedin, Plus, MessageSquare, Clock, CheckCircle, BrainCircuit, User, Bell } from 'lucide-react';

interface JobDetailDrawerProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({ job, isOpen, onClose, onUpdateJob }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'contacts'>('details');
  const [noteContent, setNoteContent] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setNoteContent(job.notes || '');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen, job]);

  if (!isVisible && !isOpen) return null;
  if (!job) return null;

  const handleSaveNote = () => {
    onUpdateJob(job.id, { notes: noteContent });
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SAVED: return 'bg-slate-100 text-slate-700';
      case JobStatus.APPLIED: return 'bg-blue-50 text-blue-700';
      case JobStatus.INTERVIEW: return 'bg-purple-50 text-purple-700';
      case JobStatus.OFFER: return 'bg-green-50 text-green-700';
      case JobStatus.REJECTED: return 'bg-red-50 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const isFollowUpEligible = job.status === JobStatus.APPLIED || job.status === JobStatus.INTERVIEW;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex-1">
             <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(job.status)} uppercase tracking-wide`}>
                  {job.status}
                </span>
                {job.created_at && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> Added {new Date(job.created_at).toLocaleDateString()}
                  </span>
                )}
                
                {/* Follow-Up Reminder Setting */}
                {isFollowUpEligible && (
                  <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer relative group ${
                    job.followUpDate ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}>
                     <Bell size={12} className="mr-1.5" />
                     <span>{job.followUpDate ? `Reminder: ${new Date(job.followUpDate).toLocaleDateString()}` : 'Set Follow-up'}</span>
                     <input
                        type="date"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => onUpdateJob(job.id, { followUpDate: e.target.value })}
                        value={job.followUpDate || ''}
                     />
                  </div>
                )}
             </div>
             <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{job.title}</h2>
             <div className="flex items-center text-slate-600 gap-4 text-sm font-medium">
               <span className="flex items-center gap-1.5"><Building2 size={16} className="text-slate-400" /> {job.company}</span>
               <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location || 'Remote'}</span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-4 bg-white">
          <button 
             onClick={() => setActiveTab('details')}
             className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
          >
            Overview & AI
          </button>
          <button 
             onClick={() => setActiveTab('contacts')}
             className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'contacts' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
          >
            Contacts
          </button>
          <button 
             onClick={() => setActiveTab('notes')}
             className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'notes' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
          >
            Notes
          </button>
          <div className="flex-1"></div>
          {job.url && (
            <a href={job.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              Job Post <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              {/* AI Match Visualizer */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <BrainCircuit size={18} className="text-indigo-600" /> AI Fit Analysis
                </h3>
                
                {job.ai_analysis ? (
                  <div className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                       {/* Circular Progress Mockup */}
                       <svg className="w-full h-full transform -rotate-90">
                         <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                         <circle 
                           cx="48" cy="48" r="40" 
                           stroke={job.ai_analysis.fitScore >= 80 ? '#22c55e' : job.ai_analysis.fitScore >= 50 ? '#eab308' : '#ef4444'} 
                           strokeWidth="8" 
                           fill="transparent" 
                           strokeDasharray={251.2}
                           strokeDashoffset={251.2 - (251.2 * job.ai_analysis.fitScore) / 100}
                           className="transition-all duration-1000 ease-out"
                         />
                       </svg>
                       <span className="absolute text-xl font-bold text-slate-800">{job.ai_analysis.fitScore}%</span>
                    </div>
                    <div>
                       <p className="text-sm text-slate-700 leading-relaxed italic mb-2">"{job.ai_analysis.analysis}"</p>
                       <div className="flex flex-wrap gap-2">
                         {job.ai_analysis.improvements.slice(0, 2).map((imp, i) => (
                           <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-md border border-red-100 font-medium">
                             Missing: {imp.split(' ').slice(0,3).join(' ')}...
                           </span>
                         ))}
                         <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md border border-green-100 font-medium">
                            Matched: Skills Alignment
                         </span>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 mb-2">No AI analysis yet.</p>
                  </div>
                )}
              </div>

              {/* Timeline (Huntr Style) */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <Clock size={18} className="text-indigo-600" /> Timeline
                </h3>
                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                   {job.timeline && job.timeline.length > 0 ? (
                      [...job.timeline].reverse().map((event, i) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                            event.status === JobStatus.OFFER ? 'bg-green-500' :
                            event.status === JobStatus.REJECTED ? 'bg-red-500' : 'bg-indigo-500'
                          }`}></div>
                          <p className="text-sm font-bold text-slate-800">{event.status}</p>
                          <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString()}</p>
                        </div>
                      ))
                   ) : (
                      <div className="relative">
                         <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white bg-slate-300"></div>
                         <p className="text-sm font-bold text-slate-800">Added to Tracker</p>
                         <p className="text-xs text-slate-500">{new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                   )}
                </div>
              </div>
              
              {/* Job Description */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Description</h3>
                 <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                   {job.description || "No description added."}
                 </p>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">Recruiters & Connections</h3>
                <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                  <Plus size={14} /> Add Contact
                </button>
              </div>
              
              {job.contacts && job.contacts.length > 0 ? (
                job.contacts.map(contact => (
                  <div key={contact.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-100">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{contact.name}</p>
                           <p className="text-xs text-slate-500">{contact.role}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <Mail size={16} />
                          </a>
                        )}
                        <a href="#" className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-blue-50 rounded-full transition-colors">
                            <Linkedin size={16} />
                        </a>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                  <User size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No contacts added yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
             <div className="h-full flex flex-col animate-fade-in">
               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-1 flex flex-col shadow-sm">
                 <div className="flex items-center gap-2 mb-3 text-yellow-800 font-bold text-sm">
                    <MessageSquare size={16} /> Personal Notes
                 </div>
                 <textarea 
                   className="flex-1 w-full bg-transparent border-none outline-none resize-none text-slate-700 text-sm leading-relaxed placeholder:text-yellow-800/40"
                   placeholder="Jot down interview questions, company research, or reminders..."
                   value={noteContent}
                   onChange={(e) => setNoteContent(e.target.value)}
                   onBlur={handleSaveNote}
                 ></textarea>
                 <div className="text-right mt-2 text-xs text-yellow-700/60 font-medium">
                   {noteContent !== job.notes ? 'Unsaved changes...' : 'Saved'}
                 </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </>
  );
};
