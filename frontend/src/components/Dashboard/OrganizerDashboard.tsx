 
import {
  CalendarDays, Users, IndianRupee, Calendar,
  Plus, ChevronRight, Sparkles
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
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Create Event CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-blue-600/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-1">Get Started</p>
          <h3 className="text-[#f0f4f8] font-bold text-base">Ready to host an event?</h3>
          <p className="text-[#4b6480] text-xs mt-0.5">Set up your event in minutes and start collecting registrations.</p>
        </div>
        <button
        onClick={()=> navigate('/create-events')}
        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-150 shrink-0">
          <Plus className="w-4 h-4" />
          Create New Event
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