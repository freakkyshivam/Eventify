import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleJoin } from "@/api/payment/eventJoin";
import { getEventBySlugApi } from "@/api/event/eventApi";
import {
  Calendar, MapPin, Users, Loader2, AlertCircle, Sparkles,
  RefreshCw, Tag, Clock, LayoutGrid, IndianRupee, ArrowRight,
  ChevronLeft, ChevronRight, ArrowLeft
} from "lucide-react";
import type { eventI } from "@/types/Event";

const EventDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<eventI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getEventBySlugApi(slug);
        if (!res) return;
        setEvent(res.results);
      } catch (err: unknown) {
        setError((err as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-violet-600/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-600 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
          </div>
          <p className="text-[#4b6480] text-sm font-medium">Loading event...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#080c12] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-[#f0f4f8] font-semibold mb-1">Event not found</h3>
            <p className="text-[#4b6480] text-sm max-w-xs">{error}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[#243447] bg-[#161f2e] hover:bg-[#111827] text-[#94a3b8] hover:text-[#f0f4f8] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.2)] transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFree = event.payment_type === "free";
  const images = event.bannerUrls ?? [];
  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);
  const isDeadline = new Date(event.registration_deadline) < new Date()

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
      value: new Date(event.start_time).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-fuchsia-400" />,
      bg: "bg-fuchsia-500/10 border-fuchsia-500/20",
      label: "End Time",
      value: new Date(event.end_time).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    },
    {
      icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      label: "Mode",
      value: event.event_mode === "offline" && event.location
        ? `Offline · ${event.location}`
        : event.event_mode.charAt(0).toUpperCase() + event.event_mode.slice(1),
    },
    ...(event.capacity ? [{
      icon: <Users className="w-3.5 h-3.5 text-amber-400" />,
      bg: "bg-amber-500/10 border-amber-500/20",
      label: "Capacity",
      value: `${event.capacity} spots available`,
    }] : []),
    {
      icon: <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />,
      bg: "bg-sky-500/10 border-sky-500/20",
      label: "Category",
      value: event.event_category.charAt(0).toUpperCase() + event.event_category.slice(1),
    },
    {
      icon: <IndianRupee className="w-3.5 h-3.5 text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/20",
      label: "Price",
      value: isFree ? "Free" : `₹${event.price}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c12] text-[#f0f4f8]">

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-sm text-[#4b6480] hover:text-[#f0f4f8] font-medium mb-8 transition-colors duration-200"
        >
          <div className="w-7 h-7 rounded-lg bg-[#161f2e] border border-[#1e2d3d] group-hover:bg-[#111827] group-hover:border-[#243447] flex items-center justify-center transition-all duration-200">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start animate-fade-in">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Image Carousel */}
            <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">

              {/* Main image */}
              <div className="relative h-72 sm:h-96 bg-gradient-to-br from-violet-900/40 to-blue-900/30">
                {images.length > 0 ? (
                  <img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={`${event.title} - ${activeImg + 1}`}
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c12]/80 via-transparent to-transparent" />

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`rounded-full transition-all duration-200 ${i === activeImg ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${isFree
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                  }`}>
                  <Tag className="w-3 h-3" />
                  {isFree ? "Free" : `₹${event.price}`}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-medium bg-black/40 border border-white/15 text-[#f0f4f8] capitalize backdrop-blur-md">
                  {event.event_category}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 px-4 py-3 bg-[#080c12]/50 overflow-x-auto scrollbar-none border-t border-[#1e2d3d]">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === activeImg
                          ? "border-violet-500 opacity-100 scale-105"
                          : "border-[#1e2d3d] opacity-50 hover:opacity-80 hover:border-[#243447]"
                        }`}
                    >
                      <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + description */}
            <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-6 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#f0f4f8] tracking-tight leading-snug">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-[#4b6480] text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              )}
            </div>

            {/* Meta grid */}
            <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-5">
              <p className="text-[11px] font-semibold text-[#4b6480] uppercase tracking-wider mb-4">Event Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metaItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#161f2e] border border-[#1e2d3d] hover:border-[#243447] transition-colors">
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-[#4b6480] uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#f0f4f8] font-medium leading-snug">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: sticky CTA card ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden relative">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

              <div className="p-6 space-y-5">
                {/* Price display */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#4b6480] uppercase tracking-wider mb-0.5">Price</p>
                    <p className={`font-display text-2xl font-bold ${isFree ? "text-emerald-400" : "text-[#f0f4f8]"}`}>
                      {isFree ? "Free" : `₹${event.price}`}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isFree
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-amber-500/10 border-amber-500/20"
                    }`}>
                    <Tag className={`w-5 h-5 ${isFree ? "text-emerald-400" : "text-amber-400"}`} />
                  </div>
                </div>

                <div className="h-px bg-[#1e2d3d]" />

                {/* Quick info */}
                <div className="space-y-2.5">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5 text-violet-400" />, text: new Date(event.start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                    { icon: <Clock className="w-3.5 h-3.5 text-blue-400" />, text: `${new Date(event.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – ${new Date(event.end_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` },
                    { icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" />, text: event.event_mode === "offline" && event.location ? event.location : event.event_mode, className: "capitalize" },
                    ...(event.capacity ? [{ icon: <Users className="w-3.5 h-3.5 text-amber-400" />, text: `${event.capacity} spots available` }] : []),
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center gap-2.5 text-sm text-[#94a3b8] ${row.className ?? ""}`}>
                      {row.icon}
                      {row.text}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#1e2d3d]" />

                {/* Deadline warning */}
                {isDeadline ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#4b6480] bg-[#161f2e] border border-[#1e2d3d] rounded-xl px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    Registration closed
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-[#4b6480] bg-[#161f2e] border border-[#1e2d3d] rounded-xl px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Registration closes{" "}
                    <span className="text-amber-400 font-medium ml-auto shrink-0">
                      {new Date(event.registration_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}

                {/* Join button */}
                <button
                  onClick={() => handleJoin(event.id, event.title, (id) => setProcessing(!!id))}
                  disabled={processing || isDeadline}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${isFree
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                    }`}
                >
                  {processing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <>{isFree ? "Join Free" : `Join · ₹${event.price}`} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="text-[11px] text-[#4b6480] text-center">
                  {isFree ? "No payment required" : "Secure payment via Razorpay"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;