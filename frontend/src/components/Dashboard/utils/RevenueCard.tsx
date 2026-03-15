import {
  IndianRupee, TrendingUp, TrendingDown, Wallet,
  CheckCircle2, Clock, XCircle, BarChart3, Calendar
} from "lucide-react";

import { type RevenueEntry,type RevenueStats } from "@/types/Event";

interface Props {
  entries: RevenueEntry[] | undefined;
  stats: RevenueStats | undefined;
  loading?: boolean;
}

const payConfig = {
  completed: { icon: <CheckCircle2 className="w-2.5 h-2.5" />, cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
  pending:   { icon: <Clock className="w-2.5 h-2.5" />,         cls: "bg-amber-500/10 border-amber-500/20 text-amber-400",     dot: "bg-amber-400"   },
  failed:    { icon: <XCircle className="w-2.5 h-2.5" />,       cls: "bg-red-500/10 border-red-500/20 text-red-400",           dot: "bg-red-400"     },
};

const RevenueCard = ({ entries, stats, loading = false }: Props) => {

  const growth = stats && stats.last_month > 0
    ? (((stats.this_month - stats.last_month) / stats.last_month) * 100).toFixed(1)
    : null;
  const isUp = growth !== null && parseFloat(growth) >= 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-4">

      {/* ── Summary chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total */}
        <div className="col-span-2 sm:col-span-2 relative overflow-hidden bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-violet-400" />
            </div>
            {growth !== null && (
              <div className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isUp ? "+" : ""}{growth}%
              </div>
            )}
          </div>
          <p className="text-[10px] font-semibold text-[#4b6480] uppercase tracking-wider mb-0.5">Total Revenue</p>
          {loading ? (
            <div className="h-7 w-28 rounded-lg bg-[#161f2e] animate-pulse" />
          ) : (
            <p className="text-2xl font-display font-bold text-[#f0f4f8]">
              ₹{stats ? fmt(stats.total_revenue) : "0"}
            </p>
          )}
          {stats && (
            <p className="text-[10px] text-[#4b6480] mt-1">
              ₹{fmt(stats.this_month)} this month
            </p>
          )}
        </div>

        {/* Completed */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-[10px] font-semibold text-[#4b6480] uppercase tracking-wider mb-0.5">Completed</p>
          {loading ? (
            <div className="h-6 w-16 rounded-lg bg-[#161f2e] animate-pulse" />
          ) : (
            <p className="text-xl font-display font-bold text-emerald-400">
              ₹{stats ? fmt(stats.completed) : "0"}
            </p>
          )}
        </div>

        {/* Pending */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-4">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-[10px] font-semibold text-[#4b6480] uppercase tracking-wider mb-0.5">Pending</p>
          {loading ? (
            <div className="h-6 w-16 rounded-lg bg-[#161f2e] animate-pulse" />
          ) : (
            <p className="text-xl font-display font-bold text-amber-400">
              ₹{stats ? fmt(stats.pending) : "0"}
            </p>
          )}
        </div>
      </div>

      {/* ── Transaction list ── */}
      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-[#f0f4f8]">Transactions</h3>
            {entries && entries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-violet-600/15 border border-violet-600/25 text-violet-400 text-[10px] font-bold">
                {entries.length}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-violet-600/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-violet-600 animate-spin" />
            </div>
            <p className="text-[#4b6480] text-xs">Loading transactions...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && (!entries || entries.length === 0) && (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-[#4b6480]" />
            </div>
            <div>
              <p className="text-[#94a3b8] text-xs font-medium mb-0.5">No transactions yet</p>
              <p className="text-[#4b6480] text-xs">Revenue will appear here once attendees register.</p>
            </div>
          </div>
        )}

        {/* Rows */}
        {!loading && entries && entries.length > 0 && (
          <div className="divide-y divide-[#1e2d3d]">
            {entries.map((entry, i) => {
              const pay  = payConfig[entry.payment_status] ?? payConfig.pending;
              const date = new Date(entry.registration_date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              const amt = parseFloat(entry.amount);

              return (
                <div
                  key={i}
                  className="group flex items-center gap-3 px-5 py-3.5 hover:bg-[#161f2e] transition-colors duration-150"
                >
                  {/* Amount chip */}
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <IndianRupee className="w-4 h-4 text-violet-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#f0f4f8] group-hover:text-violet-300 transition-colors line-clamp-1">
                        {entry.event_title}
                      </h4>
                      <span className="text-sm font-display font-bold text-[#f0f4f8] flex-shrink-0">
                        ₹{fmt(amt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-1">
                      {entry.user_name && (
                        <span className="text-[10px] text-[#4b6480] truncate">{entry.user_name}</span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#4b6480]">
                        <Calendar className="w-2.5 h-2.5 text-[#4b6480]" /> {date}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ml-auto flex-shrink-0 ${pay.cls}`}>
                        {pay.icon} {entry.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueCard;