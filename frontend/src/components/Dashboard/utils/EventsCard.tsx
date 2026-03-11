import type { eventI } from "@/types/Event";
import { Calendar, Ticket, Clock, MapPin, Sparkles, Tag, ArrowRight, Pencil, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "user" | "organizer" | "admin";

type Props = {
  events: eventI[] | undefined;
  loading?: boolean;
  role?: Role;
  title: string;
  subTitle: string;
  subDescription: string;
  path: string;
  btnDes: string;
  onCardClick?: (event: eventI) => void;
  onEditClick?: (event: eventI) => void;
  onViewRegistrations?: (event: eventI) => void;
};

const EventsCard = ({
  events,
  loading = false,
  role = "user",
  title,
  subTitle,
  subDescription,
  path,
  btnDes,
  onCardClick,
  onEditClick,
  onViewRegistrations,
}: Props) => {
  const navigate = useNavigate();

  // ── Loading ──
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden animate-pulse">
            <div className="h-36 bg-white/[0.04]" />
            <div className="p-4 space-y-2.5">
              <div className="h-3 w-3/4 rounded-full bg-white/[0.06]" />
              <div className="h-2.5 w-full rounded-full bg-white/[0.04]" />
              <div className="h-2.5 w-2/3 rounded-full bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty ──
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          <Ticket className="w-7 h-7 text-slate-600" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">{subTitle}</h3>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{subDescription}</p>
        </div>
        <button
          onClick={() => navigate(path)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          {btnDes}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Ticket className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold">
          {events.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          const isFree    = event.payment_type === "free";
          const deadline  = new Date(event.registration_deadline);
          const isExpired = deadline < new Date();

          const handleClick = () => {
            if (onCardClick) onCardClick(event);
            else navigate(`/events/${event.slug}`);
          };

          const handleEdit = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onEditClick) onEditClick(event);
            else navigate(`/organizer/events/${event.slug}/edit`);
          };

          const handleViewReg = (e: React.MouseEvent) => {
            e.stopPropagation();
            onViewRegistrations?.(event);
          };

          return (
            <div
              key={event.id}
              onClick={handleClick}
              className="group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.13] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Banner */}
              <div className="relative h-36 bg-gradient-to-br from-violet-900/40 to-blue-900/30 overflow-hidden flex-shrink-0">
                {event.bannerUrls?.length > 0 ? (
                  <img
                    src={event.bannerUrls[0]}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/90 via-transparent to-transparent" />

                {/* Price + Status badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    isFree
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                  }`}>
                    <Tag className="w-2.5 h-2.5" />
                    {isFree ? "Free" : `₹${event.price}`}
                  </div>
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isExpired
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                  }`}>
                    {isExpired ? "Closed" : "Open"}
                  </div>
                </div>

                {/* Arrow (user only) */}
                {role === "user" && (
                  <div className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">

                {/* Admin: organizer name pill */}
                {role === "admin" && event.organizer_name && (
                  <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] text-fuchsia-400 font-semibold mb-2">
                    <div className="w-3 h-3 rounded-full bg-fuchsia-500/30 flex items-center justify-center">
                      <span className="text-[8px] font-black text-fuchsia-300">
                        {event.organizer_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {event.organizer_name}
                  </div>
                )}

                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors duration-200 line-clamp-1 mb-1">
                  {event.title}
                </h4>

                {event.description && (
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed flex-1">
                    {event.description}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-auto flex-wrap mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                    <div className="w-4 h-4 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-2.5 h-2.5 text-violet-400" />
                    </div>
                    {deadline.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize">
                    <div className="w-4 h-4 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                    {event.event_mode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 capitalize ml-auto">
                    <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    {event.event_category}
                  </span>
                </div>

                {/* Organizer / Admin action buttons */}
                {(role === "organizer" || role === "admin") && (
                  <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={handleViewReg}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/35 text-blue-400 hover:text-blue-300 text-[11px] font-semibold transition-all duration-200"
                    >
                      <Users className="w-3 h-3" />
                      View Reg
                    </button>
                    <button
                      onClick={handleEdit}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-500/35 text-violet-400 hover:text-violet-300 text-[11px] font-semibold transition-all duration-200"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsCard;

/**
 // Attendee dashboard
<EventsCard role="user" events={events} ... />

// Organizer dashboard
<EventsCard
  role="organizer"
  events={events}
  onViewRegistrations={(event) => navigate(`/events/${event.id}/registrations`)}
  onEditClick={(event) => navigate(`/events/${event.id}/edit`)}
  ...
/>

// Admin dashboard
<EventsCard
  role="admin"
  events={events}
  onViewRegistrations={(event) => navigate(`/admin/events/${event.id}/registrations`)}
  onEditClick={(event) => navigate(`/events/${event.id}/edit`)}
  ...
/>
 */