
import React from 'react';
import { AdminEmployer } from '../types';
import { Building2, Mail, Calendar, MoreHorizontal, Ban, Trash2 } from 'lucide-react';

interface AdminEmployersProps {
  employers: AdminEmployer[];
}

export const AdminEmployers: React.FC<AdminEmployersProps> = ({ employers }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
           <h3 className="font-bold text-slate-800 text-lg">Employer Management</h3>
           <p className="text-sm text-slate-500">View and manage registered companies.</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm">
            {employers.length} Companies
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Contact Person</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Jobs Posted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No employers registered yet.
                </td>
              </tr>
            ) : (
              employers.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Building2 size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{emp.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{emp.contactPerson}</td>
                  <td className="px-6 py-4 text-slate-500">
                     <div className="flex items-center gap-1">
                        <Mail size={12} /> {emp.email}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{emp.jobsPosted}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        emp.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                        {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Suspend">
                          <Ban size={16} />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
