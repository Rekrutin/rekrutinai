
import React, { useState } from 'react';
import { Search, Trash2, Eye, Mail, Calendar, Ban } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminUsersProps {
  users: AdminUser[]; 
  onDeleteUser: (email: string) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onDeleteUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (email: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${email}?`)) {
      onDeleteUser(email);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
           <h3 className="font-bold text-slate-800 text-lg">User Management</h3>
           <p className="text-sm text-slate-500">Manage access and view user statistics.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User Profile</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <div className="flex items-center text-xs text-slate-500 gap-1">
                           <Mail size={10} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      user.plan === 'Pro' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      user.plan === 'Career+' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.plan === 'Elite' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">
                       <p><span className="font-bold">{user.resumesCount}</span> Resumes</p>
                       <p><span className="font-bold">{user.appsCount}</span> Applications</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md w-fit ${
                       user.status === 'active' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div> {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-400" />
                       {new Date(user.joinedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye size={16} />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Suspend Account">
                          <Ban size={16} />
                       </button>
                       <button 
                        onClick={() => handleDelete(user.email)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete User"
                       >
                          <Trash2 size={16} />
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
