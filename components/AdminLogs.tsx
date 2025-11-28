
import React from 'react';
import { SystemLog } from '../types';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AdminLogsProps {
  logs: SystemLog[];
}

export const AdminLogs: React.FC<AdminLogsProps> = ({ logs }) => {
  const getIcon = (severity: SystemLog['severity']) => {
    switch (severity) {
      case 'SUCCESS': return <CheckCircle size={16} className="text-green-500" />;
      case 'WARN': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'ERROR': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-shrink-0">
        <div>
           <h3 className="font-bold text-slate-800 text-lg">System Logs</h3>
           <p className="text-sm text-slate-500">Audit trail of all platform activities.</p>
        </div>
        <div className="flex gap-2">
           <span className="text-xs font-mono bg-slate-900 text-white px-3 py-1 rounded">v1.2.0</span>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-0 bg-slate-950 font-mono text-sm">
        <div className="divide-y divide-slate-800/50">
           {logs.map(log => (
             <div key={log.id} className="flex items-start gap-4 p-3 hover:bg-slate-900 transition-colors">
                <div className="text-slate-500 w-36 flex-shrink-0 text-xs mt-0.5">
                   {new Date(log.timestamp).toISOString().replace('T', ' ').split('.')[0]}
                </div>
                <div className="flex-shrink-0 mt-0.5">
                   {getIcon(log.severity)}
                </div>
                <div className="flex-1">
                   <div className="flex items-baseline gap-2">
                      <span className={`font-bold text-xs ${
                         log.severity === 'SUCCESS' ? 'text-green-400' :
                         log.severity === 'ERROR' ? 'text-red-400' :
                         log.severity === 'WARN' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                         [{log.severity}]
                      </span>
                      <span className="text-slate-200 font-semibold">{log.event}</span>
                   </div>
                   <p className="text-slate-400 text-xs mt-1">{log.details} {log.user && <span className="text-slate-500">User: {log.user}</span>}</p>
                </div>
             </div>
           ))}
           <div className="p-3 text-slate-600 text-xs animate-pulse">Waiting for new events...</div>
        </div>
      </div>
    </div>
  );
};
