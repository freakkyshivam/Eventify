import { useState } from "react";
import type { eventI } from "@/types/Event";
import { Calendar, Ticket, MapPin, Search, Sparkles, Users, IndianRupee, Edit2 } from "lucide-react";
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
  events = [],
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            {title}
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Browse and manage your events.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl text-sm text-[#f0f4f8] placeholder:text-[#4b6480] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-[#4b6480] text-sm font-medium">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center border border-[#1e2d3d] rounded-2xl bg-[#0d1117]">
            <div className="w-16 h-16 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
              <Ticket className="w-7 h-7 text-[#4b6480]" />
            </div>
            <div>
              <h3 className="text-[#f0f4f8] font-semibold mb-1">{subTitle}</h3>
              <p className="text-[#4b6480] text-sm max-w-xs leading-relaxed">{subDescription}</p>
            </div>
            <button
              onClick={() => navigate(path)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              {btnDes}
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center gap-4 text-center bg-[#0d1117] border border-[#1e2d3d] rounded-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#4b6480]" />
            </div>
            <div>
              <p className="text-[#f0f4f8] font-medium text-lg">No events found</p>
              <p className="text-[#4b6480] text-sm mt-1">
                We couldn't find any events matching your search.
              </p>
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => {
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
                className="group cursor-pointer bg-[#0d1117] border border-[#1e2d3d] hover:border-[#243447] rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#161f2e]">
                  {event.bannerUrls && event.bannerUrls.length > 0 ? (
                    <img
                      src={event.bannerUrls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#4b6480]">
                      <Calendar className="w-8 h-8 opacity-50" />
                      <span className="text-sm font-medium bg-[#0d1117] px-3 py-1.5 rounded-lg border border-[#1e2d3d]">No Image Provided</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
                      {event.event_category || "Uncategorized"}
                    </span>
                  </div>
                  {(role === "organizer" || role === "admin") && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-3 py-1.5 bg-violet-500/80 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 shadow-lg shadow-violet-500/20">
                        <Users className="w-3.5 h-3.5" />
                        {event.capacity ? `${event.capacity} Spots` : 'Unlimited'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display font-bold text-[#f0f4f8] text-lg sm:text-xl line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h3>
                    {(role === "organizer" || role === "admin") && (
                      <button
                        onClick={handleEdit}
                        className="w-8 h-8 rounded-lg bg-[#161f2e] hover:bg-emerald-500/20 border border-[#1e2d3d] hover:border-emerald-500/30 text-[#8a9fb1] hover:text-emerald-400 flex items-center justify-center shrink-0 transition-all duration-200"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 mb-6 flex-1">
                    <div className="flex items-center gap-2.5 text-sm text-[#8a9fb1]">
                      <div className="w-7 h-7 rounded-lg bg-[#161f2e] flex items-center justify-center shrink-0 border border-[#1e2d3d]">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      {new Date(event.start_time).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-[#8a9fb1]">
                      <div className="w-7 h-7 rounded-lg bg-[#161f2e] flex items-center justify-center shrink-0 border border-[#1e2d3d]">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-[#1e2d3d] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-bold">{event.price || "Free"}</span>
                    </div>
                    
                    {(role === "organizer" || role === "admin") ? (
                       <button
                         onClick={handleViewReg}
                         className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-semibold bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-xl transition-colors"
                       >
                         View Registrations
                       </button>
                    ) : (
                      <div className="flex items-center gap-2 text-[#4b6480] text-xs font-medium">
                        By {event.organizer_name || "Organizer"} 
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsCard;