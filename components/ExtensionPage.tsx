
import React, { useState } from 'react';
import { UserProfile, Job, ExtensionJobPayload } from '../types';
import { trackJobFromExtension } from '../services/extensionBackend';
import { Download, Chrome, Play, CheckCircle, AlertTriangle, Code, Terminal, Key } from 'lucide-react';

interface ExtensionPageProps {
  profile: UserProfile;
  jobs: Job[];
  onJobAdded: (job: Job) => void;
}

export const ExtensionPage: React.FC<ExtensionPageProps> = ({ profile, jobs, onJobAdded }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'simulate'>('install');
  
  // Simulator State
  const [simUrl, setSimUrl] = useState('https://linkedin.com/jobs/view/123456');
  const [simTitle, setSimTitle] = useState('Senior React Developer');
  const [simCompany, setSimCompany] = useState('Tech Unicorn Inc.');
  const [simDescription, setSimDescription] = useState('We are looking for a rockstar developer...');
  const [simStatus, setSimStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [simMessage, setSimMessage] = useState('');

  const handleSimulateCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimStatus('loading');

    const payload: ExtensionJobPayload = {
      token: profile.extensionToken || 'invalid-token',
      job_title: simTitle,
      company_name: simCompany,
      location: 'Remote',
      description: simDescription,
      url: simUrl,
      platform: 'LinkedIn'
    };

    try {
      // Call our "Backend" simulator
      const result = await trackJobFromExtension(payload, profile, jobs);
      
      if (result.success && result.job) {
        onJobAdded(result.job);
        setSimStatus('success');
        setSimMessage(result.message);
      } else {
        setSimStatus('error');
        setSimMessage(result.message);
      }
    } catch (error) {
      setSimStatus('error');
      setSimMessage("System error during capture.");
    }
  };

  const CodeBlock = ({ filename, code }: { filename: string, code: string }) => (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-300 mb-6 font-mono text-xs">
      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <span className="font-bold text-slate-100">{filename}</span>
        <button 
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs hover:text-white"
        >
            Copy
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre>{code}</pre>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Chrome Extension Hub</h2>
          <p className="text-slate-500">Install the RekrutIn auto-capture tool or test the integration.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('install')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'install' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Installation Guide
          </button>
          <button 
            onClick={() => setActiveTab('simulate')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'simulate' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dev Simulator
          </button>
        </div>
      </div>

      {activeTab === 'install' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                  <Chrome size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">Official Browser Extension</h3>
                  <p className="text-sm text-indigo-700 mt-1 mb-4">
                    Track jobs from LinkedIn, Glints, and JobStreet with one click.
                    Automatically syncs to your dashboard.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow hover:bg-indigo-700 transition-colors">
                      Download .ZIP
                    </button>
                    <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                      View Source
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Terminal size={18} /> Source Code (manifest.json)
              </h3>
              <CodeBlock 
                filename="manifest.json" 
                code={`{
  "manifest_version": 3,
  "name": "RekrutIn.ai Job Tracker",
  "version": "1.0",
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["*://*.linkedin.com/*", "*://*.glints.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  }
}`} 
              />
              
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Code size={18} /> Content Script (LinkedIn Parser)
              </h3>
              <CodeBlock 
                filename="content.js" 
                code={`// Simple LinkedIn Parser Logic
function parseLinkedIn() {
  const title = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText;
  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText;
  const description = document.querySelector('#job-details')?.innerText;
  
  if (title && company) {
    chrome.runtime.sendMessage({
      type: 'JOB_DATA',
      payload: { title, company, description, url: window.location.href, platform: 'LinkedIn' }
    });
  }
}

// Run when page loads
parseLinkedIn();`} 
              />
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Setup Instructions</h3>
                <ol className="space-y-4 text-sm text-slate-600">
                   <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">1</span>
                      <span>Download the source code files.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">2</span>
                      <span>Go to <b>chrome://extensions</b> in your browser.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">3</span>
                      <span>Enable "Developer mode" (top right).</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">4</span>
                      <span>Click "Load unpacked" and select the folder.</span>
                   </li>
                   <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">5</span>
                      <span>Paste your API Token in the extension popup.</span>
                   </li>
                </ol>
             </div>

             <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                   <Key size={18} className="text-yellow-400" /> Your API Token
                </h3>
                <div className="bg-black/30 p-3 rounded-lg font-mono text-xs break-all border border-white/10 mb-2">
                   {profile.extensionToken || "Go to Profile to generate token"}
                </div>
                <p className="text-xs text-slate-400">Keep this secret. It allows external apps to write to your account.</p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                 <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                    <Play size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-slate-900">Capture Simulator</h3>
                    <p className="text-sm text-slate-500">Test the backend logic without installing the extension.</p>
                 </div>
              </div>

              <form onSubmit={handleSimulateCapture} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                    <input 
                      type="text" 
                      value={simTitle} 
                      onChange={(e) => setSimTitle(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                    <input 
                      type="text" 
                      value={simCompany} 
                      onChange={(e) => setSimCompany(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job URL</label>
                    <input 
                      type="text" 
                      value={simUrl} 
                      onChange={(e) => setSimUrl(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm text-blue-600"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description Snippet</label>
                    <textarea 
                      value={simDescription} 
                      onChange={(e) => setSimDescription(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm h-24"
                    ></textarea>
                 </div>

                 <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={simStatus === 'loading'}
                      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                    >
                       {simStatus === 'loading' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={18} />}
                       Simulate "Add to RekrutIn"
                    </button>
                 </div>
              </form>
           </div>

           <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${
                 simStatus === 'idle' ? 'bg-slate-50 border-slate-200' :
                 simStatus === 'success' ? 'bg-green-50 border-green-200' :
                 simStatus === 'error' ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-200'
              } transition-all`}>
                 <h3 className="font-bold mb-2 flex items-center gap-2">
                    {simStatus === 'success' && <CheckCircle size={20} className="text-green-600" />}
                    {simStatus === 'error' && <AlertTriangle size={20} className="text-red-600" />}
                    Result Console
                 </h3>
                 
                 {simMessage ? (
                    <p className={`text-sm ${
                        simStatus === 'success' ? 'text-green-700' : 
                        simStatus === 'error' ? 'text-red-700' : 'text-slate-600'
                    }`}>
                        {simMessage}
                    </p>
                 ) : (
                    <p className="text-sm text-slate-500">Waiting for simulation...</p>
                 )}

                 {simStatus === 'success' && profile.plan === 'Pro' && (
                    <div className="mt-4 pt-4 border-t border-green-200 text-xs text-green-800">
                       <p className="font-bold flex items-center gap-1"><CheckCircle size={12} /> Pro Feature Active:</p>
                       <p>AI Fit Score automatically calculated.</p>
                    </div>
                 )}
                 {simStatus === 'error' && profile.plan === 'Free' && (
                    <div className="mt-4 pt-4 border-t border-red-200 text-xs text-red-800">
                       <p className="font-bold">Upgrade needed?</p>
                       <p>If you hit the free limit, please upgrade to Pro.</p>
                    </div>
                 )}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="font-bold text-slate-800 mb-2">Current Subscription Status</h4>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Plan:</span>
                       <span className="font-bold">{profile.plan}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Jobs Tracked:</span>
                       <span className="font-bold">{jobs.length} / {profile.plan === 'Free' ? '10' : '∞'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Auto-Capture API:</span>
                       <span className={`font-bold ${profile.plan === 'Free' ? 'text-red-500' : 'text-green-500'}`}>
                          {profile.plan === 'Free' ? 'Locked 🔒' : 'Active ✅'}
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
