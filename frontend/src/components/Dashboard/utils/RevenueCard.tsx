import { useState } from "react";
import {
  IndianRupee, TrendingUp, Wallet,
  Search, Download, CreditCard, Activity
} from "lucide-react";

import { type RevenueEntry, type RevenueStats } from "@/types/Event";

interface Props {
  entries: RevenueEntry[] | undefined;
  stats: RevenueStats | undefined;
  loading?: boolean;
}

const RevenueCard = ({ entries = [], stats, loading = false }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const growth = stats && stats.last_month > 0
    ? (((stats.this_month - stats.last_month) / stats.last_month) * 100).toFixed(1)
    : null;
  const isUp = growth !== null && parseFloat(growth) >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  const filteredEntries = entries.filter((entry) =>
    entry.event_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.payment_status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            Revenue Analytics
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Monitor transaction flow, platform revenue, and status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl text-sm text-[#f0f4f8] placeholder:text-[#4b6480] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#161f2e] hover:bg-[#1e2d3d] border border-[#1e2d3d] rounded-xl text-sm font-medium text-[#f0f4f8] transition-colors">
            <Download className="w-4 h-4 text-[#8a9fb1]" />
            Export
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#8a9fb1] text-sm font-medium mb-1">Total Completed</p>
              {loading ? (
                <div className="h-8 w-24 bg-[#161f2e] rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-bold text-[#f0f4f8]">₹ {stats ? fmt(stats.completed) : "0"}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          {growth !== null && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`flex items-center font-medium px-1.5 py-0.5 rounded ${
                isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {isUp ? "+" : ""}{growth}%
              </span>
              <span className="text-[#4b6480]">vs last month</span>
            </div>
          )}
        </div>

        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#8a9fb1] text-sm font-medium mb-1">Gross Revenue</p>
              {loading ? (
                <div className="h-8 w-24 bg-[#161f2e] rounded animate-pulse mt-1" />
              ) : (
                 <h3 className="text-2xl font-bold text-[#f0f4f8]">₹ {stats ? fmt(stats.total_revenue) : "0"}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
             <span className="text-[#4b6480]">Total generated value</span>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#8a9fb1] text-sm font-medium mb-1">Pending Amount</p>
              {loading ? (
                <div className="h-8 w-24 bg-[#161f2e] rounded animate-pulse mt-1" />
              ) : (
                 <h3 className="text-2xl font-bold text-[#f0f4f8]">₹ {stats ? fmt(stats.pending) : "0"}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="text-[#4b6480]">Awaiting clearance</span>
          </div>
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
        <div className="px-6 py-5 border-b border-[#1e2d3d] flex items-center justify-between">
          <h3 className="font-bold text-[#f0f4f8]">Recent Transactions</h3>
          <span className="text-xs font-medium px-2.5 py-1 bg-[#161f2e] border border-[#1e2d3d] text-[#8a9fb1] rounded-lg">
            {filteredEntries.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1e2d3d] bg-[#161f2e]/80">
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d3d]">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-16 text-center text-[#4b6480] text-sm">
                     <div className="flex flex-col items-center justify-center gap-4">
                       <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                       Loading transactions...
                     </div>
                   </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-16 text-center text-[#4b6480] text-sm">
                     <div className="flex flex-col items-center justify-center gap-2">
                       <IndianRupee className="w-8 h-8 text-[#4b6480] mb-2" />
                       No transactions found.
                     </div>
                   </td>
                </tr>
              ) : (
                filteredEntries.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-[#161f2e] transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#f0f4f8]">{txn.user_name || "Unknown User"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#8a9fb1] max-w-[200px] truncate block" title={txn.event_title}>{txn.event_title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-[#f0f4f8]">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                        {fmt(parseFloat(txn.amount))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        txn.payment_status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        txn.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <Activity className="w-3 h-3" />
                        {txn.payment_status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4b6480]">
                      {new Date(txn.registration_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;