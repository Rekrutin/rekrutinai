
import React, { useState, useMemo } from 'react';
import { AdminView, EmployerJob, CandidateApplication, Job, Resume, AdminUser, Transaction, SystemLog, AdminEmployer, ExternalJobMatch } from '../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminUsers } from './AdminUsers';
import { AdminResumes } from './AdminResumes';
import { AdminApps } from './AdminApps';
import { AdminJobs } from './AdminJobs';
import { AdminRevenue } from './AdminRevenue';
import { AdminEmployers } from './AdminEmployers';
import { AdminLogs } from './AdminLogs';
import { Users, DollarSign, Database, Activity, TrendingUp } from 'lucide-react';
import { INITIAL_EMPLOYER_JOBS, INITIAL_JOBS } from '../constants';
import { ResumePreviewDrawer } from './ResumePreviewDrawer';

interface AdminDashboardProps {
  onLogout: () => void;
  liveUsers: string[];
  employerJobs: EmployerJob[];
  applications: CandidateApplication[];
  seekerJobs: Job[];
  seekerResumes: Resume[];
  importedJobs: ExternalJobMatch[];
  onImportJobs: (jobs: ExternalJobMatch[]) => void;
  onDeleteUser: (email: string) => void;
  onDeleteResume: (id: string) => void;
  onDeleteJob: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  liveUsers,
  employerJobs,
  applications,
  seekerJobs,
  seekerResumes,
  importedJobs,
  onImportJobs,
  onDeleteUser,
  onDeleteResume,
  onDeleteJob
}) => {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  
  // Local State for Mock Data that Admin can manipulate
  const [localEmployers, setLocalEmployers] = useState<AdminEmployer[]>([
    { id: 'e1', companyName: 'TechFlow Inc.', contactPerson: 'Sarah Miller', email: 'sarah@techflow.com', jobsPosted: 3, status: 'active', joinedDate: new Date().toISOString() },
    { id: 'e2', companyName: 'Creative Studio', contactPerson: 'John Art', email: 'john@creative.com', jobsPosted: 1, status: 'active', joinedDate: new Date().toISOString() },
    { id: 'e3', companyName: 'Glints', contactPerson: 'Recruiting Team', email: 'team@glints.com', jobsPosted: 5, status: 'active', joinedDate: new Date().toISOString() },
    { id: 'e4', companyName: 'Inactive Corp', contactPerson: 'Old User', email: 'admin@inactive.com', jobsPosted: 0, status: 'suspended', joinedDate: new Date().toISOString() },
  ]);

  const [localLogs, setLocalLogs] = useState<SystemLog[]>([
    { id: 'l1', event: 'USER_LOGIN', details: 'Admin logged in successfully', timestamp: new Date().toISOString(), severity: 'INFO', user: 'admin@rekrutin.ai' },
    { id: 'l2', event: 'JOB_IMPORT', details: `Successfully imported ${importedJobs.length > 5 ? 'new batch' : 'jobs'} from External APIs`, timestamp: new Date(Date.now() - 100000).toISOString(), severity: 'SUCCESS' },
    { id: 'l3', event: 'PAYMENT_SUCCESS', details: 'Transaction tx-99 verified', timestamp: new Date(Date.now() - 500000).toISOString(), severity: 'SUCCESS', user: 'premium@user.com' },
    { id: 'l4', event: 'API_LIMIT', details: 'Gemini API rate limit approaching', timestamp: new Date(Date.now() - 1000000).toISOString(), severity: 'WARN' },
    { id: 'l5', event: 'USER_SIGNUP', details: 'New user registration', timestamp: new Date(Date.now() - 2000000).toISOString(), severity: 'INFO', user: 'newbie@gmail.com' },
  ]);

  // Resume Viewing State
  const [viewingResume, setViewingResume] = useState<Resume | null>(null);
  const [isResumeDrawerOpen, setIsResumeDrawerOpen] = useState(false);

  // --- MOCK DATA GENERATION ---
  const mockUserDatabase: AdminUser[] = useMemo(() => {
    return liveUsers.map((email, idx) => {
      const plan = idx % 5 === 0 ? 'Career+' : idx % 3 === 0 ? 'Pro' : 'Free';
      return {
        id: `user-${idx}`,
        email,
        name: email.split('@')[0],
        role: 'seeker',
        status: 'active',
        joinedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        lastActive: new Date().toISOString(),
        plan,
        resumesCount: Math.floor(Math.random() * 3) + 1,
        appsCount: Math.floor(Math.random() * 12)
      };
    });
  }, [liveUsers]);

  const mockTransactions: Transaction[] = useMemo(() => {
    return mockUserDatabase
      .filter(u => u.plan !== 'Free')
      .map((u, i) => ({
        id: `tx-${i}`,
        userEmail: u.email,
        plan: u.plan,
        amount: u.plan === 'Pro' ? 'Rp 165.000' : u.plan === 'Career+' ? 'Rp 356.000' : 'Rp 455.000',
        date: u.joinedDate,
        status: 'Success',
        method: i % 2 === 0 ? 'Credit Card' : 'Bank Transfer'
      }));
  }, [mockUserDatabase]);

  // --- HANDLERS ---
  const handleDeleteEmployer = (id: string) => {
    setLocalEmployers(prev => prev.filter(e => e.id !== id));
  };

  const handleSuspendEmployer = (id: string) => {
    setLocalEmployers(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'active' ? 'suspended' : 'active' } : e));
  };

  const handleClearLogs = () => {
    setLocalLogs([]);
  };

  const handleViewResume = (resume: Resume) => {
    setViewingResume(resume);
    setIsResumeDrawerOpen(true);
  };

  // --- AGGREGATED METRICS ---
  const totalUsers = liveUsers.length; 
  const totalEmployerJobs = [...INITIAL_EMPLOYER_JOBS, ...employerJobs].length;
  const totalSeekerApps = [...INITIAL_JOBS, ...seekerJobs].length; 
  const totalResumes = seekerResumes.length;
  const totalImported = importedJobs.length;
  
  const proCount = mockUserDatabase.filter(u => u.plan === 'Pro').length;
  const careerCount = mockUserDatabase.filter(u => u.plan === 'Career+').length;
  const eliteCount = mockUserDatabase.filter(u => u.plan === 'Elite').length;
  const totalRevenue = (proCount * 165000) + (careerCount * 356000) + (eliteCount * 455000);

  const StatCard = ({ title, value, icon, change, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-600 font-bold flex items-center">
          <TrendingUp size={14} className="mr-1" /> {change}
        </span>
        <span className="text-slate-400 ml-2">{subtext || "vs last month"}</span>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          icon={<Users size={24} className="text-blue-600" />} 
          change="Real-time"
          color="bg-blue-600"
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`Rp ${(totalRevenue/1000000).toFixed(1)}M`} 
          icon={<DollarSign size={24} className="text-green-600" />} 
          change="+8.2%"
          color="bg-green-600"
        />
        <StatCard 
          title="Tracked Apps" 
          value={totalSeekerApps.toLocaleString()} 
          icon={<Database size={24} className="text-purple-600" />} 
          change="Active"
          color="bg-purple-600"
        />
        <StatCard 
          title="Imported Jobs" 
          value={totalImported.toLocaleString()} 
          icon={<Activity size={24} className="text-orange-600" />} 
          change="Live Sync"
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Platform Growth</h3>
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2 py-1 outline-none">
                 <option>Last 30 Days</option>
                 <option>Last Quarter</option>
              </select>
           </div>
           <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[35, 42, 38, 55, 63, 49, 72, 68, 85, 91, 84, 100].map((h, i) => (
                 <div key={i} className="flex-1 bg-blue-50 rounded-t hover:bg-blue-100 transition-colors relative group">
                    <div className="absolute bottom-0 w-full bg-blue-600 rounded-t opacity-80 group-hover:opacity-100" style={{ height: `${h}%` }}></div>
                 </div>
              ))}
           </div>
           <div className="flex justify-between mt-2 text-xs text-slate-400 uppercase font-bold">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
           <div className="space-y-4">
              {localLogs.slice(0, 5).map((log, i) => (
                 <div key={i} className="flex gap-3 text-sm border-b border-slate-50 pb-3 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                       log.severity === 'SUCCESS' ? 'bg-green-500' : 
                       log.severity === 'WARN' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                       <p className="text-slate-800 font-medium">{log.event}</p>
                       <p className="text-slate-500 text-xs">{log.details}</p>
                       <p className="text-slate-300 text-[10px] mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      <AdminSidebar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        onLogout={onLogout} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm z-10 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeView.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-xs text-slate-500 font-medium">Administrator</p>
               <p className="text-sm font-bold text-slate-800">CTO Access</p>
            </div>
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-md cursor-default">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 scrollbar-hide">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'users' && <AdminUsers users={mockUserDatabase} onDeleteUser={onDeleteUser} />}
          {activeView === 'resumes' && (
            <AdminResumes 
              resumes={seekerResumes} 
              onView={handleViewResume} 
              onDelete={onDeleteResume} 
            />
          )}
          {activeView === 'apps' && (
            <AdminApps 
              jobs={[...INITIAL_JOBS, ...seekerJobs]} 
              onDelete={onDeleteJob} 
            />
          )}
          {activeView === 'jobs' && (
            <AdminJobs 
              jobs={importedJobs} 
              onImport={onImportJobs} 
            />
          )}
          {activeView === 'employers' && (
            <AdminEmployers 
              employers={localEmployers} 
              onDelete={handleDeleteEmployer}
              onSuspend={handleSuspendEmployer}
            />
          )}
          {activeView === 'revenue' && (
             <AdminRevenue 
               totalRevenue={totalRevenue}
               proCount={proCount}
               careerCount={careerCount}
               eliteCount={eliteCount}
               transactions={mockTransactions}
             />
          )}
          {activeView === 'logs' && (
            <AdminLogs 
              logs={localLogs} 
              onClear={handleClearLogs} 
            />
          )}
          {activeView === 'settings' && (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Activity size={24} />
               </div>
               <h3 className="text-lg font-medium text-slate-900">System Settings</h3>
               <p className="text-slate-500 max-w-xs mx-auto mt-1">Configure global platform variables, API keys, and maintenance mode.</p>
             </div>
          )}
        </div>
      </main>

      {/* Resume Drawer for Admin */}
      <ResumePreviewDrawer 
        resume={viewingResume} 
        isOpen={isResumeDrawerOpen} 
        onClose={() => setIsResumeDrawerOpen(false)} 
      />
    </div>
  );
};
