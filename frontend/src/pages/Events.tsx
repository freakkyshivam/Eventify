import { useEffect, useState } from "react";
import { handleJoin } from "@/api/eventJoin";
import { getAllEvent } from "@/api/eventApi";
import {
  Calendar, MapPin, Users, Loader2, AlertCircle, Sparkles,
  RefreshCw, Tag, X, Clock, LayoutGrid, IndianRupee, ArrowRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import type { eventI } from "@/types/Event";

// ────────────────────────────────────────────────
// Event Detail Modal
// ────────────────────────────────────────────────
const EventModal = ({
  event,
  onClose,
  onJoin,
  isProcessing,
}: {
  event: eventI;
  onClose: () => void;
  onJoin: () => void;
  isProcessing: boolean;
}) => {
  const isFree = event.payment_type === "free";
  const [activeImg, setActiveImg] = useState(0);
  const images = event.bannerUrls ?? [];

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  const metaItems = [
    {
      icon: <Calendar className="w-3.5 h-3.5 text-violet-400" />,
      bg: "bg-violet-500/10 border-violet-500/20",
      label: "Registration Deadline",
      value: new Date(event.registration_deadline).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      }),
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-blue-400" />,
      bg: "bg-blue-500/10 border-blue-500/20",
      label: "Start Time",
      value: new Date(event?.start_time).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-fuchsia-400" />,
      bg: "bg-fuchsia-500/10 border-fuchsia-500/20",
      label: "End Time",
      value: new Date(event?.end_time).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      label: "Mode",
      value: event?.event_mode === "offline" && event?.location
        ? `Offline · ${event.location}`
        : event?.event_mode.charAt(0).toUpperCase() + event?.event_mode.slice(1),
    },
    ...(event?.capacity
      ? [{
          icon: <Users className="w-3.5 h-3.5 text-amber-400" />,
          bg: "bg-amber-500/10 border-amber-500/20",
          label: "Capacity",
          value: `${event?.capacity} spots available`,
        }]
      : []),
    {
      icon: <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />,
      bg: "bg-sky-500/10 border-sky-500/20",
      label: "Category",
      value: event?.event_category.charAt(0).toUpperCase() + event?.event_category.slice(1),
    },
    {
      icon: <IndianRupee className="w-3.5 h-3.5 text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/20",
      label: "Price",
      value: isFree ? "Free" : `₹${event?.price}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(124,58,237,0.12)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1.5px] bg-linear-to-r from-transparent via-violet-500/60 to-transparent rounded-full z-10" />

        {/* ── Image Carousel ── */}
        <div className="relative shrink-0 rounded-t-3xl overflow-hidden bg-linear-to-br from-violet-900/40 to-blue-900/30">

          {/* Main image */}
          <div className="relative h-56">
            {images.length > 0 ? (
              <img
                key={activeImg}
                src={images[activeImg]}
                alt={`${event.title} - image ${activeImg + 1}`}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f1a] via-[#0f0f1a]/10 to-transparent" />

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeImg
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              isFree
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
            }`}>
              <Tag className="w-3 h-3" />
              {isFree ? "Free" : `₹${event.price}`}
            </div>

            {/* Category badge */}
            <div className="absolute top-4 right-12 px-3 py-1 rounded-lg text-xs font-medium bg-white/10 border border-white/15 text-slate-300 capitalize">
              {event.event_category}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 px-4 py-3 bg-black/30 backdrop-blur-sm overflow-x-auto scrollbar-none">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === activeImg
                      ? "border-violet-500 opacity-100 scale-105"
                      : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/30"
                  }`}
                >
                  <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Title */}
          <h2 className="text-xl font-black text-white tracking-tight leading-snug">
            {event.title}
          </h2>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="h-px bg-white/6" />

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metaItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/6"
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${item.bg}`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-300 font-medium leading-snug">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/6" />

          {/* Actions */}
          <div className="flex gap-3 pb-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/4 hover:bg-white/3 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={onJoin}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFree
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)]"
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <>{isFree ? "Join Free" : `Join · ₹${event.price}`} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


// ────────────────────────────────────────────────
// Main Events Page
// ────────────────────────────────────────────────
const Events = () => {
  const [events, setEvents] = useState<eventI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<eventI | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllEvent();
      if (Array.isArray(res)) { setEvents(res); }
      else { setError("Invalid response format"); }
    } catch (error: any) {
      setError(error?.response?.data?.msg || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Something went wrong</h3>
            <p className="text-slate-500 text-sm max-w-xs">{error}</p>
          </div>
          <button onClick={fetchEvents} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 hover:scale-105">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center">
            <Calendar className="w-9 h-9 text-slate-600" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">No Events Yet</h3>
            <p className="text-slate-500 text-sm">Check back later for upcoming events!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white">

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoin={() => handleJoin(selectedEvent.id, selectedEvent.title, setProcessingEventId)}
          isProcessing={processingEventId === selectedEvent.id}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            {events.length} events available
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Upcoming{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              Events
            </span>
          </h2>
          <p className="text-slate-500 text-lg">Discover and join amazing events near you</p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event?.id}
              className="group relative bg-white/3 hover:bg-white/5 border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Banner */}
              <div className="relative h-44 bg-linear-to-br from-violet-900/40 to-blue-900/30 overflow-hidden shrink-0">
                {event?.bannerUrls?.length > 0 ? (
                  <img src={event.bannerUrls[0]} alt={event?.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#080810]/80 via-transparent to-transparent" />
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  event?.payment_type === "free"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                }`}>
                  <Tag className="w-3 h-3" />
                  {event?.payment_type === "free" ? "Free" : `₹${event?.price}`}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-white mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors duration-200">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-6 h-6 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3 text-violet-400" />
                    </div>
                    <span>{new Date(event?.registration_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="capitalize">{event?.event_mode}</span>
                  </div>
                  {event?.capacity && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Users className="w-3 h-3 text-amber-400" />
                      </div>
                      <span>{event?.capacity} spots available</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-2.5 mt-auto pt-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/4 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleJoin(event?.id, event?.title, setProcessingEventId)}
                    disabled={processingEventId === event.id}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      event?.payment_type === "free"
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.25)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    }`}
                  >
                    {processingEventId === event?.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...</>
                    ) : (
                      event?.payment_type === "free" ? "Join Free" : `Join ₹${event?.price}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;