 
import {
  CalendarDays, Users, IndianRupee, Calendar,
  Plus, ChevronRight, Sparkles, Award
} from "lucide-react";
import { StatsCard } from "./utils/StatsCard";
import { useEffect, useState } from "react";
import type { eventI } from "@/types/Event";
import { getAllOrganizerEventsApi, RecentRegOrgApi } from "../../api/organizer/organizer.api";
 
import RecentEvents from "./utils/RecentEvents";
import EventsCard from "./utils/EventsCard";
 import { useNavigate } from "react-router-dom";
import RecentRegistrations from "./utils/RecentReg";
import {type RegistrationI } from "@/types/Event";
import RegistrationsCard from "./utils/RegistrationCard";
import RevenueCard from "./utils/RevenueCard";
import { SettingsTab } from "./utils/SettingsTab";

type OrganizerDashboardProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};
import { type RevenueEntry,type RevenueStats } from "@/types/Event";

export function OrganizerDashboard({ activeTab, setActiveTab }: OrganizerDashboardProps) {

  const [events, setEvents] = useState<eventI[]>()
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationI[]>()
  const [entries, setEntries] = useState<RevenueEntry[]>()
  const [stats, setStats] = useState<RevenueStats>()

  const navigate = useNavigate()

  const fetchEvent = async ()=>{
    setLoading(true)
    try {
      const res = await getAllOrganizerEventsApi();

      if(!res) return;

      if(Array.isArray(res.results)){
        setEvents(res.results)
      }
    } catch (error) {
      console.error(error);
      
    }finally{
      setLoading(false)
    }
  }

  const fetchReg = async ()=>{
    setLoading(true)
    try {
      const res = await RecentRegOrgApi();

      if(!res) return;

      if(Array.isArray(res.results)){
        setRegistrations(res.results)
      }
    } catch (error) {
      console.error(error);
      
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchEvent();
    fetchReg();
  },[])

  // Revenue entry and stats
   useEffect(() => {
  if (!registrations) return;

  const entry: RevenueEntry[] = registrations.map((d) => ({
    event_title: d?.event_title,
    amount: d.payment && d?.payment?.amount,
    payment_status: d.payment && d?.payment?.status,
    registration_date: d?.registration_date,
    user_name: d?.user_name,
  }));

  setEntries(entry);

  const s: RevenueStats = {
    total_revenue: registrations?.reduce((acc, reg) => acc + (Number(reg?.payment?.amount) || 0), 0) || 0,
    completed: registrations?.reduce((acc, reg) => acc + (reg.payment?.status ==='completed' ? Number(reg.payment.amount) : 0), 0)   || 0,
    pending: registrations?.reduce((acc, reg) => acc + (reg.payment?.status ==='pending' ? Number(reg.payment.amount) : 0), 0) || 0,
    failed: registrations?.reduce((acc, reg) => acc + (reg.payment?.status ==='failed' ? Number(reg.payment.amount) : 0), 0) || 0,
    this_month: 0,
    last_month: 0
  };

  setStats(s);

}, [registrations]);


  let totalAmount = 0;
  registrations?.forEach(r=> {
    if(r?.payment?.status === "completed"){
      totalAmount += Number(r?.payment?.amount)
    }
})

  const organizerStats = [
  { label: "My Events", value: events?.length ?? 0, icon: CalendarDays },
  { label: "Total Registrations", value: registrations?.length ?? 0, icon: Users },
  { label: "Total Revenue", value: `₹ ${totalAmount}`, icon: IndianRupee },
  { 
    label: "Upcoming Events",
    value: events?.filter(e => new Date(e.start_time) > new Date()).length ?? 0,
    icon: Calendar
  },
];

  if (activeTab === "Create Event") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
          <Plus className="w-7 h-7 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-[#f0f4f8] mb-1">Create New Event</h2>
          <p className="text-[#4b6480] text-sm max-w-xs">
            Event creation form coming soon...
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-600/30 bg-violet-600/10 text-violet-300 text-xs font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
          </span>
          Coming Soon
        </div>
      </div>
    );
  }

   if(activeTab === "My Events"){
    return <EventsCard
    role="organizer"
    events={events}
    title="My Events"
    subTitle="Not Events"
    subDescription="You have not create any events."
    path="/create-events"
    btnDes="Create Event"
    onViewRegistrations={(event)=> navigate(`/events/${event.slug}/registrations`)}
    onEditClick={(event)=>navigate(`/organizer/events/${event.slug}/edit`)}
    />
   }

   if(activeTab === "Registrations"){
    return <RegistrationsCard
  registrations={registrations}
  loading={loading}
  title="My Registrations"
  subTitle="No registrations yet"
  subDescription="Browse events and register to see them here."
  onCardClick={(reg) => navigate(`/events/${reg.event_slug}`)}
/>
   }



      if(activeTab === "Revenue"){
    return <RevenueCard
    entries={entries}
    stats={stats}
    />
   }

  if (activeTab === "Settings") {
    return <SettingsTab />;
  }



  if (activeTab !== "Dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#94a3b8]" />
        </div>
        <p className="text-[#4b6480] text-sm">
          Content for <span className="text-[#f0f4f8] font-medium">"{activeTab}"</span> coming soon...
        </p>
      </div>
    );
  }

 
 
  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {organizerStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} theme="amber" />
        ))}
      </div>

      {/* ── Organizer notice banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-300">Organizer Panel</p>
            <p className="text-xs text-[#4b6480]">Manage your events, track registrations, and view revenue.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/create-events')}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 hover:text-amber-300 transition-all duration-200 shrink-0 z-10"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Event
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* My Events */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4f8]">My Events</h3>
            </div>
            <button 
            onClick={()=> setActiveTab("My Events") }
            className="text-xs text-[#4b6480] hover:text-violet-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        <div className="p-4 space-y-3 min-h-[200px]">
          
          <RecentEvents events={events} loading={loading}/>
        
        </div>       
        </div>

        {/* Recent Registrations */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4f8]">Recent Registrations</h3>
            </div>
            <button
            onClick={()=>setActiveTab('Registrations')}
            className="text-xs text-[#4b6480] hover:text-blue-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        <div className="p-4 space-y-3 min-h-[200px]">
          <RecentRegistrations 
          registrations={registrations} 
          loading={loading} 
          />
        </div>
        
          
        </div>

      </div>
    </div>
  );
}