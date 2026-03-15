import { useEffect, useState, useRef } from "react";
import { handleJoin } from "@/api/payment/eventJoin";
import { getAllEvent } from "@/api/event/eventApi";
import {
  Calendar, MapPin, Users, Loader2, AlertCircle, Sparkles,
  RefreshCw, Tag, Clock
} from "lucide-react";
import type { eventI } from "@/types/Event";
import { useNavigate } from "react-router-dom";

// ── Fade-in on scroll (same pattern as Home.tsx) ─────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState<eventI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllEvent();
      if (Array.isArray(res)) { setEvents(res); }
      else { setError("Invalid response format"); }
    } catch (error: unknown) {
      setError(
        (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
        "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-violet-600/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-600 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
          </div>
          <p className="text-[#4b6480] text-sm font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080c12] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-[#f0f4f8] font-semibold mb-1">Something went wrong</h3>
            <p className="text-[#4b6480] text-sm max-w-xs">{error}</p>
          </div>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-150"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div className="min-h-screen bg-[#080c12] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0d1117] border border-[#1e2d3d] flex items-center justify-center">
            <Calendar className="w-9 h-9 text-[#2d4159]" />
          </div>
          <div>
            <h3 className="text-[#f0f4f8] font-semibold text-lg mb-1">No Events Yet</h3>
            <p className="text-[#4b6480] text-sm">Check back later for upcoming events!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c12] text-[#f0f4f8]">

      {/* Ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <FadeIn className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-600/20 bg-violet-600/10 text-violet-400 text-xs font-medium mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            {events.length} events available
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f0f4f8] mb-3">
            All{" "}
            {/* FIX: text-gradient is not defined — use inline Tailwind gradient */}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="text-[#4b6480] text-sm">Discover and join amazing events near you</p>
        </FadeIn>

        {/* Grid */}
        {/* FIX: animate-slide-up opacity-0 kept cards permanently invisible.
            Each card is now wrapped in FadeIn with a staggered delay. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, idx) => {
            const isDeadline = new Date(event.registration_deadline) < new Date();
            return (
              <FadeIn key={event.id} delay={Math.min(idx * 60, 400)}>
                <div className="group bg-[#0d1117] border border-[#1e2d3d] hover:border-[#243447] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col h-full">

                  {/* Banner */}
                  <div className="relative h-44 bg-gradient-to-br from-violet-900/30 to-blue-900/20 overflow-hidden shrink-0">
                    {event?.bannerUrls?.length > 0 ? (
                      <img
                        src={event.bannerUrls[0]}
                        alt={event?.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent" />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${
                      event?.payment_type === "free"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                    }`}>
                      <Tag className="w-3 h-3" />
                      {event?.payment_type === "free" ? "Free" : `₹${event?.price}`}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-[#f0f4f8] mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors duration-200">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-[#4b6480]">
                        <div className="w-6 h-6 rounded-md bg-violet-600/10 border border-violet-600/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-3 h-3 text-violet-400" />
                        </div>
                        <span>
                          {new Date(event?.registration_deadline).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#4b6480]">
                        <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="capitalize">{event?.event_mode}</span>
                      </div>
                      {event?.capacity && (
                        <div className="flex items-center gap-2 text-xs text-[#4b6480]">
                          <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <Users className="w-3 h-3 text-amber-400" />
                          </div>
                          <span>{event?.capacity} spots available</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-[#4b6480] text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                        {event.description}
                      </p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2.5 mt-auto pt-2">
                      <button
                        onClick={() => navigate(`/events/${event.slug}`)}
                        className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-[#243447] bg-[#161f2e] hover:bg-[#111827] hover:border-[#2d4159] text-[#94a3b8] hover:text-[#f0f4f8] transition-all duration-150"
                      >
                        View Details
                      </button>

                      {isDeadline ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-[#4b6480] bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-3 py-2">
                          <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          Closed
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoin(event?.id, event?.title, setProcessingEventId)}
                          disabled={processingEventId === event.id}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                            event?.payment_type === "free"
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                              : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.15)]"
                          }`}
                        >
                          {processingEventId === event?.id ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...</>
                          ) : (
                            event?.payment_type === "free" ? "Join Free" : `Join ₹${event?.price}`
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Events;