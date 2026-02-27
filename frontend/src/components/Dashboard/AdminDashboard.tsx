import { Users, CalendarDays, IndianRupee, Award, ChevronRight, Sparkles, Check, X, ClipboardList, ShieldCheck } from "lucide-react";
import { StatsCard } from "./StatsCard";

const adminStats = [
  { label: "Total Users", value: 0, icon: Users },
  { label: "Total Events", value: 0, icon: CalendarDays },
  { label: "Total Revenue", value: "₹0", icon: IndianRupee },
  { label: "Pending Requests", value: 0, icon: Award },
];

// Sample data — replace with real API data
const pendingRequests = [
  { name: "John Doe", email: "john@example.com", timeAgo: "2 hours ago" },
];

type AdminDashboardProps = {
  activeTab: string;
};

export function AdminDashboard({ activeTab }: AdminDashboardProps) {

  // ── Other Tabs ──
  if (activeTab !== "Dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">
          Content for <span className="text-slate-300 font-medium">"{activeTab}"</span> coming soon...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* ── Admin notice banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex items-center gap-4">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-300">Admin Panel</p>
          <p className="text-xs text-slate-500">You have full access to manage users, events, and platform settings.</p>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pending Organizer Requests */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Organizer Requests</h3>
            </div>
            {pendingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-bold">
                {pendingRequests.length} pending
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((req, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 text-white font-bold text-xs border border-violet-500/30">
                      {req.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{req.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{req.email}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{req.timeAgo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all duration-200">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/[0.07] flex items-center justify-center">
                  <Award className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-0.5">All clear</p>
                  <p className="text-slate-600 text-xs">No pending organizer requests.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Recent Payments</h3>
            </div>
            <button className="text-xs text-slate-500 hover:text-emerald-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/[0.07] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium mb-0.5">No payments yet</p>
              <p className="text-slate-600 text-xs">Payment transactions will appear here.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}