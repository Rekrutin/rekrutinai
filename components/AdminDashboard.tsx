
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Briefcase, FileText, Activity, LogOut, 
  Search, TrendingUp, DollarSign, Building2
} from 'lucide-react';
import { AdminTab, EmployerJob, CandidateApplication } from '../types';
import { INITIAL_EMPLOYER_JOBS, INITIAL_APPLICATIONS } from '../constants';

interface AdminDashboardProps {
  onLogout: () => void;
  liveUsers: string[]; // List of registered emails
  employerJobs: EmployerJob[]; // Live data from app state
  applications: CandidateApplication[]; // Live data
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  liveUsers,
  employerJobs,
  applications
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // --- AGGREGATED DATA (Mock DB + Live State) ---
  // We keep INITIAL jobs/apps as they represent the "System Data" visible to users.
  const allEmployerJobs = [...INITIAL_EMPLOYER_JOBS, ...employerJobs];
  const allApplications = [...INITIAL_APPLICATIONS, ...applications];
  
  // Calculate Real Stats
  const totalUsers = liveUsers.length; 
  // In this demo architecture, we don't have a separate Employer DB, so we estimate or start at 0
  const totalEmployers = liveUsers.length > 0 ? 1 : 0; 
  const activeJobs = allEmployerJobs.filter(j => j.status === 'Active').length;
  const totalApplications = allApplications.length;
  
  // Simulated Recent Activity (kept minimal or empty for "start from scratch" feel if preferred, 
  // but useful to show system events. We'll keep dynamic events only if we had them, 
  // for now we'll show a placeholder if no real activity exists)
  const activities = [
    { id: 1, type: 'system', text: 'System initialized', time: 'Just now' },
    ...liveUsers.map((u, i) => ({ 
        id: i + 10, 
        type: 'user', 
        text: `New user registered: ${u}`, 
        time: 'Recent' 
    }))
  ].slice(0, 10);

  const renderSidebar = () => (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <span className="text-xl font-extrabold text-white tracking-tight">
          RekrutIn<span className="text-blue-500">Admin</span>
        </span>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Platform Owner</p>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <LayoutDashboard size={18} className="mr-3" /> Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Users size={18} className="mr-3" /> User Management
        </button>
        <button 
          onClick={() => setActiveTab('employers')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'employers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Building2 size={18} className="mr-3" /> Employers
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Briefcase size={18} className="mr-3" /> Job Postings
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Activity size={18} className="mr-3" /> System Logs
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={18} className="mr-3" /> Logout
        </button>
      </div>
    </aside>
  );

  const StatCard = ({ title, value, icon, change, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
        <span className="text-slate-400 ml-2">since start</span>
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
          title="Active Jobs" 
          value={activeJobs} 
          icon={<Briefcase size={24} className="text-indigo-600" />} 
          change="System Wide"
          color="bg-indigo-600"
        />
        <StatCard 
          title="Applications" 
          value={totalApplications.toLocaleString()} 
          icon={<FileText size={24} className="text-purple-600" />} 
          change="Total"
          color="bg-purple-600"
        />
        <StatCard 
          title="Total Revenue" 
          value="Rp 0" 
          icon={<DollarSign size={24} className="text-green-600" />} 
          change="0%"
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Platform Growth</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg p-2 font-medium text-slate-600 outline-none">
              <option>Realtime</option>
            </select>
          </div>
          <div className="p-6 h-64 flex items-center justify-center bg-slate-50/50">
            {totalUsers > 0 ? (
               <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{totalUsers}</p>
                  <p className="text-slate-500 text-sm">New User Signups</p>
               </div>
            ) : (
                <p className="text-slate-400 text-sm">Waiting for first user...</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map((activity, i) => (
              <div key={i} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'user' ? 'bg-blue-500' : 
                  activity.type === 'job' ? 'bg-indigo-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-sm text-slate-800 font-medium">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Registered Users</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {liveUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                No users registered yet.
              </td>
            </tr>
          ) : (
            liveUsers.map((email, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  {email}
                </td>
                <td className="px-6 py-4 text-slate-600">User</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date().toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderJobsTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">All Job Postings</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4">Job Title</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Applicants</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allEmployerJobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{job.title}</td>
                <td className="px-6 py-4 text-slate-600">Company ID: {job.id.substring(0,4)}</td>
                <td className="px-6 py-4 text-slate-500">{job.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {allApplications.filter(a => a.jobId === job.id).length}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      {renderSidebar()}
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">System Healthy</span>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 scrollbar-hide">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsersTable()}
          {activeTab === 'employers' && (
             <div className="text-center py-20 text-slate-400">
               <Building2 size={48} className="mx-auto mb-4 opacity-50" />
               <h3 className="text-lg font-medium">Employer Management</h3>
               <p>Employers will appear here upon registration.</p>
             </div>
          )}
          {activeTab === 'jobs' && renderJobsTable()}
          {activeTab === 'activity' && (
             <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h3 className="font-bold text-slate-800 mb-6">Full System Logs</h3>
                <div className="space-y-4">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex gap-4 items-center text-sm font-mono text-slate-600 border-b border-slate-50 pb-2">
                       <span className="text-slate-400">2025-01-20 10:{30+i}:00</span>
                       <span className="text-blue-600 font-bold">[INFO]</span>
                       <span>System heartbeat check OK</span>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
