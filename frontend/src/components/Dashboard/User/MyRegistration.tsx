 
import type { eventI } from "@/types/Event";
import {
   Calendar, Ticket,  Clock,
   MapPin, Sparkles, Tag, 
   
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type MyRegistrationProps = {
  totalEvents: eventI[];
};

const MyRegistration = ({totalEvents}:MyRegistrationProps) => {

    const navigate = useNavigate();

     if (!totalEvents || totalEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
          <Ticket className="w-7 h-7 text-slate-600" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">No Registrations Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            You haven't registered for any events. Browse events to get started!
          </p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          Browse Events
        </button>
      </div>
    );
  }

   
         

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Ticket className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-white">My Registrations</h3>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold">
            {totalEvents?.length}
          </span>
        </div>
      </div>

      {/* Event cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {totalEvents?.map((event: eventI) => {
          const isFree = event?.payment_type === "free";
          const deadline = new Date(event?.registration_deadline);
          const isExpired = deadline < new Date();

          return (
            <div
              key={event?.id}
              className="group relative bg-white/3 hover:bg-white/5.5 border border-white/[0.07] hover:border-white/13 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Bottom glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Banner strip */}
              <div className="relative h-32 bg-linear-to-br from-violet-900/40 to-blue-900/30 overflow-hidden shrink-0">
                {event?.bannerUrls?.length > 0 ? (
                  <img
                    src={event?.bannerUrls[0]}
                    alt={event?.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#080810]/90 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    isFree
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                  }`}>
                    <Tag className="w-2.5 h-2.5" />
                    {isFree ? "Free" : `₹${event?.price}`}
                  </div>
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isExpired
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                  }`}>
                    {isExpired ? "Closed" : "Open"}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors duration-200 line-clamp-1 mb-1">
                  {event?.title}
                </h4>

                {event?.description && (
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {event?.description}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-auto flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                    <div className="w-4 h-4 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5 text-violet-400" />
                    </div>
                    {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize">
                    <div className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    {event?.event_mode}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize ml-auto">
                    <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    {event?.event_category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  
}

export default MyRegistration