
import React from 'react';
import { 
  LayoutDashboard, Users, Briefcase, FileText, Activity, LogOut, 
  Building2, Database, Layers, DollarSign, Settings
} from 'lucide-react';
import { AdminView } from '../types';

interface AdminSidebarProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onNavigate, onLogout }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <span className="text-xl font-extrabold text-white tracking-tight">
          RekrutIn<span className="text-blue-500">Admin</span>
        </span>
        <div className="flex items-center mt-2">
           <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
           <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">System Online</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <button 
          onClick={() => onNavigate('overview')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <LayoutDashboard size={18} className="mr-3" /> Overview
        </button>
        <button 
          onClick={() => onNavigate('revenue')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'revenue' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <DollarSign size={18} className="mr-3" /> Revenue Analytics
        </button>
        
        <div className="pt-4 pb-1 pl-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User Management</div>
        <button 
          onClick={() => onNavigate('users')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Users size={18} className="mr-3" /> Users
        </button>
        <button 
          onClick={() => onNavigate('resumes')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'resumes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <FileText size={18} className="mr-3" /> Resumes
        </button>
        <button 
          onClick={() => onNavigate('apps')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'apps' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Layers size={18} className="mr-3" /> Applications
        </button>

        <div className="pt-4 pb-1 pl-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Data</div>
        <button 
          onClick={() => onNavigate('employers')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'employers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Building2 size={18} className="mr-3" /> Employers
        </button>
        <button 
          onClick={() => onNavigate('jobs')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'jobs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Database size={18} className="mr-3" /> Job Import
        </button>
        
        <div className="pt-4 pb-1 pl-3 text-xs font-bold text-slate-500 uppercase tracking-wider">System</div>
        <button 
          onClick={() => onNavigate('logs')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Activity size={18} className="mr-3" /> System Logs
        </button>
        <button 
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeView === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Settings size={18} className="mr-3" /> Settings
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
};
