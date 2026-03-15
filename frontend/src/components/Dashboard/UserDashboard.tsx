import { useEffect, useState } from "react";

import {
  Calendar, Ticket, IndianRupee, Clock,
  Award, ArrowRight, Sparkles,  ChevronRight,

} from "lucide-react";
import { StatsCard } from "./utils/StatsCard";
import { getUserAllJoinedEvent } from "@/api/user/userApi";
import type { eventI } from "@/types/Event";

import { MyTicketsTab } from "./User/MyTicket";
 import EventsCard from "./utils/EventsCard";
import Alerts from "@/utils/Alerts";

import { useNavigate } from "react-router-dom";
import OrganizerRequest from "./User/OrganizerRequest";
import RecentEvents from "./utils/RecentEvents";


type UserDashboardProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function UserDashboard({ activeTab, setActiveTab }: UserDashboardProps) {

  

  const [totalEvents, setTotalEvents] = useState<eventI[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<eventI[]>([]);
  // const [completedEvents, setCompletedEvents] = useState<eventI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate()

if (!setActiveTab) {
    setError("BROKEN RENDER DETECTED");
  }

  useEffect(() => {
    fetchEvents();

  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUserAllJoinedEvent();
      if (Array.isArray(res?.upcomingEvents)) {

        setUpcomingEvents(res?.upcomingEvents);
      }
      //  if(Array.isArray(res?.completedEvents)){
      //     setCompletedEvents(res?.completedEvents);
      //   }
      if (Array.isArray(res?.totalEvents)) {
        setTotalEvents(res.totalEvents)
      }

    } catch (error: unknown) {
      console.error("Failed to fetch events:", error);
      setError((error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  let revenue = 0;
  let totalTickets = 0;

  totalEvents?.forEach((d) => {
    revenue += d.price;
    totalTickets++;
  })


  const userStats = [
    { label: "Registered Events", value: totalEvents?.length, icon: Calendar },
    { label: "Tickets", value: totalTickets, icon: Ticket },
    { label: "Total Spent", value: "₹ " + revenue, icon: IndianRupee },
    { label: "Upcoming", value: upcomingEvents?.length ?? 0, icon: Clock },
  ];

 

  if (activeTab === "My Registrations") {
   
    return <EventsCard
    events={totalEvents}
    title="My Registration"
    subTitle="Not Registration"
    subDescription="You haven't registered for any events. Browse events to get started!"
    path="/events"
    btnDes="Browse Events"
    />
  }


  if (activeTab === "My Tickets") {
    return <MyTicketsTab />
  }

  if(activeTab === "Request Organizer Access"){
    return <OrganizerRequest/>
  }

  if (activeTab !== "Dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-[#94a3b8]" />
        </div>
        <p className="text-[#4b6480] text-sm">Content for <span className="text-[#f0f4f8] font-medium">"{activeTab}"</span> coming soon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {error && (
        <Alerts error={error} />
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* My Upcoming Events */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4f8]">My Upcoming Events</h3>
            </div>
            <button 
            onClick={()=> setActiveTab("My Registrations")}
            className="text-xs text-[#4b6480] hover:text-violet-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3 min-h-[200px]">
             <RecentEvents events={upcomingEvents} loading={loading}/>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e2d3d]">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-[#f0f4f8]">Quick Actions</h3>
          </div>

          <div className="p-4 space-y-3">
            {[
              {
                icon: <Calendar className="w-4 h-4 text-violet-400" />,
                iconBg: "bg-violet-500/10 border-violet-500/20",
                label: "Browse All Events",
                desc: "Find your next experience",
                accent: "group-hover:text-violet-400",
                tab : "/events"
              },
              {
                icon: <Award className="w-4 h-4 text-amber-400" />,
                iconBg: "bg-amber-500/10 border-amber-500/20",
                label: "Request Organizer Access",
                desc: "Unlock event creation tools",
                accent: "group-hover:text-amber-400",
                tab : "Request Organizer Access"
              },
              {
                icon: <Ticket className="w-4 h-4 text-blue-400" />,
                iconBg: "bg-blue-500/10 border-blue-500/20",
                label: "View My Tickets",
                desc: "Manage your registrations",
                accent: "group-hover:text-blue-400",
                tab : "My Tickets"
              },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  if (action.label === "Browse All Events") {
                    navigate(action.tab);
                  } else {
                    setActiveTab(action.tab);
                  }
                }}
                className="group w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#161f2e] hover:bg-[#111827] border border-[#1e2d3d] hover:border-[#243447] transition-all duration-200 text-left"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${action.iconBg}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold text-[#f0f4f8] transition-colors duration-200 ${action.accent}`}>
                    {action.label}
                  </p>
                  <p className="text-[11px] text-[#4b6480]">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4b6480] group-hover:text-[#94a3b8] shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
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