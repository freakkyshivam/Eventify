 import {type eventI } from "@/types/Event"
 import { Calendar, Plus, Tag, MapPin, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useHook"

interface props{
    events : eventI[] | undefined
    loading : boolean
 
}

 const RecentEvents = ({events , loading  } : props) => {

      const {session} = useAuth();
      const navigate = useNavigate()

      const path = session?.user?.role === "attendee" ? '/' : "/registrations"
  return (
    <div>
        {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
                </div>
                <p className="text-slate-600 text-xs">Loading events...</p>
              </div>
            )}

            {!loading && (events?.length === 0 || !events) &&(
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
         )}

         {events?.slice(0,4).map((event : eventI)=>{
        return (
           <div
            onClick={()=> navigate( `/events/${event.slug}${path}`)}
                key={event.id}
                className="mb-2 group flex gap-3 p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/12 transition-all duration-200 cursor-pointer"
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
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${event.payment_type === "free"
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
        )
       })}
    </div>
  )
}

export default RecentEvents