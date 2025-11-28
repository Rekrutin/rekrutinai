
import React from 'react';
import { DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../types';

interface AdminRevenueProps {
  totalRevenue: number;
  proCount: number;
  careerCount: number;
  eliteCount: number;
  transactions: Transaction[];
}

export const AdminRevenue: React.FC<AdminRevenueProps> = ({ 
  totalRevenue, 
  proCount, 
  careerCount, 
  eliteCount,
  transactions
}) => {
  // Constants for pricing
  const PRICE_PRO = 165000;
  const PRICE_CAREER = 356000;
  const PRICE_ELITE = 455000;

  // Monthly breakdown
  const revPro = proCount * PRICE_PRO;
  const revCareer = careerCount * PRICE_CAREER;
  const revElite = eliteCount * PRICE_ELITE;
  const monthlyRevenue = revPro + revCareer + revElite;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Revenue Analytics</h2>
          <p className="text-slate-500">Track financial performance, subscriptions, and MRR.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
             Export CSV
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">MRR (Monthly)</p>
                 <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(monthlyRevenue)}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                 <DollarSign size={20} />
              </div>
           </div>
           <div className="mt-4 flex items-center text-sm font-medium text-green-600">
              <TrendingUp size={14} className="mr-1" /> +12.5% this month
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">All-Time Revenue</p>
                 <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(totalRevenue)}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                 <CreditCard size={20} />
              </div>
           </div>
           <div className="mt-4 flex items-center text-sm font-medium text-slate-400">
              Across all users
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Paid Users</p>
                 <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{proCount + careerCount + eliteCount}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                 <Users size={20} />
              </div>
           </div>
           <div className="mt-4 flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight size={14} className="mr-1" /> 5 new today
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">ARPPU</p>
                 <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                    {formatCurrency(monthlyRevenue / (proCount + careerCount + eliteCount || 1))}
                 </h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                 <TrendingUp size={20} />
              </div>
           </div>
           <div className="mt-4 flex items-center text-sm font-medium text-slate-400">
              Avg. Rev Per Paid User
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Visual Revenue Graph (CSS based) */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6">Revenue Trend (Last 6 Months)</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
               {/* Simulated Bars */}
               {[40, 55, 48, 62, 78, 100].map((h, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="w-full bg-indigo-50 rounded-t-lg relative h-full flex items-end group-hover:bg-indigo-100 transition-colors">
                       <div className="w-full bg-indigo-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-2 font-medium">
                       {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         {/* Plan Breakdown */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6">Revenue by Plan</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                     <span className="text-sm font-medium text-slate-700">Pro Plan</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(revPro)}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(revPro / monthlyRevenue) * 100}%` }}></div>
               </div>

               <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                     <span className="text-sm font-medium text-slate-700">Career+</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(revCareer)}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(revCareer / monthlyRevenue) * 100}%` }}></div>
               </div>

               <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                     <span className="text-sm font-medium text-slate-700">Elite</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(revElite)}</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(revElite / monthlyRevenue) * 100}%` }}></div>
               </div>
            </div>
         </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Plan</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Method</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                     <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{tx.userEmail}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold border ${
                              tx.plan === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              tx.plan === 'Career+' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              'bg-green-50 text-green-700 border-green-100'
                           }`}>
                              {tx.plan}
                           </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{tx.amount}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              tx.status === 'Success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                           }`}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{tx.method}</td>
                     </tr>
                  ))}
                  {transactions.length === 0 && (
                     <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No transactions yet.</td></tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
