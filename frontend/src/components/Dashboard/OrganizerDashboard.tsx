 
import {
  CalendarDays, Users, IndianRupee, Calendar,
  Plus, ChevronRight, Sparkles, ClipboardList
} from "lucide-react";
import { StatsCard } from "./StatsCard";

const organizerStats = [
  { label: "My Events", value: 0, icon: CalendarDays },
  { label: "Total Registrations", value: 0, icon: Users },
  { label: "Total Revenue", value: "₹0", icon: IndianRupee },
  { label: "Upcoming Events", value: 0, icon: Calendar },
];

type OrganizerDashboardProps = {
  activeTab: string;
};

export function OrganizerDashboard({ activeTab }: OrganizerDashboardProps) {

  // ── Create Event Tab ──
  if (activeTab === "Create Event") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Plus className="w-7 h-7 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Create New Event</h2>
          <p className="text-slate-500 text-sm max-w-xs">
            Event creation form coming soon...
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
          </span>
          Coming Soon
        </div>
      </div>
    );
  }

  
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {organizerStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Create Event CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-linear-to-r from-violet-600/10 via-fuchsia-600/5 to-blue-600/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider mb-1">Get Started</p>
          <h3 className="text-white font-bold text-base">Ready to host an event?</h3>
          <p className="text-slate-500 text-xs mt-0.5">Set up your event in minutes and start collecting registrations.</p>
        </div>
        <button className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200 shrink-0">
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* My Events */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white">My Events</h3>
            </div>
            <button className="text-xs text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/[0.07] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium mb-0.5">No events yet</p>
              <p className="text-slate-600 text-xs">Create your first event to get started!</p>
            </div>
            <button className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200 mt-1">
              <Plus className="w-3.5 h-3.5" /> Create Event
            </button>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Recent Registrations</h3>
            </div>
            <button className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-14 px-6 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/[0.07] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium mb-0.5">No registrations yet</p>
              <p className="text-slate-600 text-xs">Registrations will appear here once people sign up.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}