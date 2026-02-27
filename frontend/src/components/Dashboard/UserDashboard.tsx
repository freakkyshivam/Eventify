import { useEffect, useState } from "react";
 
import {
   Calendar, Ticket, IndianRupee, Clock,
  Award, MapPin, ArrowRight, Sparkles, Tag, ChevronRight
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { getUserAllJoinedEvent } from "@/api/eventApi";
import type { eventI } from "@/types/Event";

type UserDashboardProps = {
  activeTab: string;
};

export function UserDashboard({ activeTab }: UserDashboardProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<eventI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUserAllJoinedEvent();
      if (Array.isArray(res)) {
        setUpcomingEvents(res?.upcomingEvents);
      } else {
        setError("Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch events:", error);
      setError(error?.response?.data?.msg || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const userStats = [
    { label: "Registered Events", value: 0, icon: Calendar },
    { label: "Tickets", value: 0, icon: Ticket },
    { label: "Total Spent", value: "₹0", icon: IndianRupee },
    { label: "Upcoming", value: upcomingEvents?.length ?? 0, icon: Clock },
  ];

  if (activeTab !== "Dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">Content for <span className="text-slate-300 font-medium">"{activeTab}"</span> coming soon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* My Upcoming Events */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white">My Upcoming Events</h3>
            </div>
            <button className="text-xs text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3 min-h-[200px]">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
                </div>
                <p className="text-slate-600 text-xs">Loading events...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && upcomingEvents?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-0.5">No upcoming events</p>
                  <p className="text-slate-600 text-xs">Browse events to get registered!</p>
                </div>
              </div>
            )}

            {/* Event list */}
            {!loading && upcomingEvents?.map((event: eventI) => (
              <div
                key={event.id}
                className="group flex gap-3 p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/12 transition-all duration-200 cursor-pointer"
              >
                {/* Color dot */}
                <div className="w-1 rounded-full bg-linear-to-b from-violet-500 to-fuchsia-500 shrink-0 self-stretch" />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1 mb-1">
                    {event.title}
                  </h4>
                  {event.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-1 mb-1.5">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span className="capitalize">{event.event_mode}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                      event.payment_type === "free"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      <Tag className="w-2.5 h-2.5" />
                      {event.payment_type === "free" ? "Free" : `₹${event.price}`}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 shrink-0 self-center transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/6">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
          </div>

          <div className="p-4 space-y-3">
            {[
              {
                icon: <Calendar className="w-4 h-4 text-violet-400" />,
                iconBg: "bg-violet-500/10 border-violet-500/20",
                label: "Browse All Events",
                desc: "Find your next experience",
                accent: "group-hover:text-violet-400",
              },
              {
                icon: <Award className="w-4 h-4 text-amber-400" />,
                iconBg: "bg-amber-500/10 border-amber-500/20",
                label: "Request Organizer Access",
                desc: "Unlock event creation tools",
                accent: "group-hover:text-amber-400",
              },
              {
                icon: <Ticket className="w-4 h-4 text-blue-400" />,
                iconBg: "bg-blue-500/10 border-blue-500/20",
                label: "View My Tickets",
                desc: "Manage your registrations",
                accent: "group-hover:text-blue-400",
              },
            ].map((action, i) => (
              <button
                key={i}
                className="group w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/12 transition-all duration-200 text-left"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${action.iconBg}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold text-white transition-colors duration-200 ${action.accent}`}>
                    {action.label}
                  </p>
                  <p className="text-[11px] text-slate-600">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Missing import fix
function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}