import { Calendar, Zap, ArrowRight, Users, Sparkles, TrendingUp, Globe, Ticket, MapPin, Tag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { useState, useEffect, useRef } from "react";
import Auth from "./Auth";
import { getAllEvent } from "@/api/event/eventApi";
import type { eventI } from "@/types/Event";

const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("mousemove", onMouse); window.removeEventListener("scroll", onScroll); };
  }, []);

  const [events, setEvents] = useState<eventI[]>([]);

  useEffect(() => {
    getAllEvent().then((res) => {
      if (Array.isArray(res)) setEvents(res);
    }).catch(() => {});
  }, []);

  const isOrganizer = session?.user?.role === "organizer" || session?.user?.role === "admin";

  // Derived stats from real data
  const totalEvents    = events.length;
  const freeEvents     = events.filter((e) => e.payment_type === "free").length;
  const onlineEvents   = events.filter((e) => e.event_mode === "online").length;
  const openEvents     = events.filter((e) => new Date(e.registration_deadline) > new Date());
  const latestEvents   = [...events].slice(0, 6);

  // Category icon map
  const categoryEmoji: Record<string, string> = {
    conference: "🎤", webinar: "💻", workshop: "🎨",
    competition: "🏆", technology: "🚀", coding: "⌨️", other: "✨",
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-white overflow-x-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Mouse-tracked aurora */}
        <div
          className="absolute w-[900px] h-[900px] rounded-full transition-all duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(109,40,217,0.14) 0%, rgba(76,29,149,0.06) 40%, transparent 70%)",
            left: `${mousePos.x}%`, top: `${mousePos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Static deep orbs */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-violet-900/25 blur-[140px]" />
        <div className="absolute top-[30%] -right-20 w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-fuchsia-900/15 blur-[100px]" />

        {/* Diagonal light streak */}
        <div
          className="absolute top-0 left-1/2 w-[1px] h-[60vh] opacity-[0.06]"
          style={{ background: "linear-gradient(to bottom, transparent, #a78bfa, transparent)" }}
        />
        <div
          className="absolute top-0 left-[40%] w-[1px] h-[40vh] opacity-[0.04]"
          style={{ background: "linear-gradient(to bottom, transparent, #818cf8, transparent)" }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />

        {/* Floating orbs with parallax */}
        {[
          { top: "15%", left: "8%",  size: 6, color: "bg-violet-400/30", delay: "0s",   dur: "3s"  },
          { top: "25%", left: "88%", size: 4, color: "bg-blue-400/25",   delay: "1s",   dur: "4s"  },
          { top: "55%", left: "5%",  size: 5, color: "bg-fuchsia-400/20",delay: "0.5s", dur: "3.5s"},
          { top: "70%", left: "92%", size: 3, color: "bg-cyan-400/25",   delay: "2s",   dur: "4.5s"},
          { top: "40%", left: "95%", size: 6, color: "bg-violet-300/20", delay: "1.5s", dur: "3.2s"},
          { top: "80%", left: "15%", size: 4, color: "bg-indigo-400/25", delay: "0.8s", dur: "5s"  },
          { top: "10%", left: "50%", size: 3, color: "bg-purple-400/15", delay: "2.5s", dur: "4s"  },
          { top: "60%", left: "60%", size: 5, color: "bg-blue-400/15",   delay: "1.2s", dur: "3.8s"},
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${p.color} animate-pulse`}
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              animationDelay: p.delay, animationDuration: p.dur,
              transform: `translateY(${scrollY * (0.05 + i * 0.01)}px)`,
              transition: "transform 0.1s linear",
            }}
          />
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center">

        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.07] text-violet-300 text-xs font-semibold mb-10 backdrop-blur-sm"
          style={{ animation: "fadeDown 0.5s ease both" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
          </span>
          <Users className="w-3 h-3" />
          Join thousands of event creators & attendees
        </div>

        {/* Headline */}
        <div style={{ animation: "fadeUp 0.6s 0.1s ease both", opacity: 0 }}>
          <h1 className="font-black tracking-[-0.035em] leading-[0.92] mb-8 max-w-[900px]"
            style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}>
            <span
              className="block text-white/90"
              style={{ transform: `translateY(${scrollY * -0.04}px)`, display: "block" }}
            >
              Discover &amp;
            </span>
            <span className="relative block">
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Create Events
              </span>
              {/* Wavy underline */}
              <svg className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[70%]" viewBox="0 0 400 10" fill="none">
                <path d="M0 5 Q50 1 100 5 Q150 9 200 5 Q250 1 300 5 Q350 9 400 5" stroke="url(#wg)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="400" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0"/>
                    <stop offset="30%" stopColor="#c084fc" stopOpacity="0.9"/>
                    <stop offset="70%" stopColor="#67e8f9" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="block text-white/85">That Matter</span>
          </h1>
        </div>

        {/* Sub */}
        <p
          className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed mb-12"
          style={{ animation: "fadeUp 0.6s 0.2s ease both", opacity: 0 }}
        >
          Build unforgettable experiences, connect with your community, and manage every detail seamlessly —
          <span className="text-slate-300 font-medium"> all in one place.</span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 mb-24"
          style={{ animation: "fadeUp 0.6s 0.3s ease both", opacity: 0 }}
        >
          {/* Primary */}
          <button
            onClick={() => isOrganizer ? navigate("/create-events") : navigate("/events")}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_rgba(124,58,237,0.7)] transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 w-full sm:w-auto justify-center overflow-hidden"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
            <Calendar className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{isOrganizer ? "Create Event" : "Browse Events"}</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Secondary */}
          {session ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.18] text-slate-300 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.18] text-slate-300 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Start for Free
            </button>
          )}
        </div>

        {/* ── Stats row ── */}
        <div
          className="flex flex-wrap items-center justify-center gap-10 sm:gap-16"
          style={{ animation: "fadeUp 0.6s 0.4s ease both", opacity: 0 }}
        >
          {[
            { icon: <Calendar className="w-4 h-4 text-violet-400" />,   target: totalEvents || 0,  suffix: "+", label: "Events Listed"  },
            { icon: <Users className="w-4 h-4 text-blue-400" />,        target: openEvents.length || 0, suffix: "",  label: "Open Now"       },
            { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,target: freeEvents || 0,   suffix: "",  label: "Free Events"    },
            { icon: <Globe className="w-4 h-4 text-fuchsia-400" />,     target: onlineEvents || 0, suffix: "",  label: "Online Events"  },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none"><Counter target={s.target} suffix={s.suffix} /></p>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-0.5 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Floating ambient cards (desktop) ── */}
        {/* Left top — real event */}
        <div className="absolute left-[2%] top-[18%] hidden xl:block" style={{ animation: "floatY 4s ease-in-out infinite" }}>
          <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 w-56 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-transparent" />
            <div className="flex items-center gap-2.5 mb-3 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/50 to-blue-600/30 border border-violet-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {latestEvents[0]?.bannerUrls?.[0]
                  ? <img src={latestEvents[0].bannerUrls[0]} className="w-full h-full object-cover" />
                  : <Calendar className="w-4 h-4 text-violet-300" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{latestEvents[0]?.title ?? "Tech Summit 2025"}</p>
                <p className="text-[10px] text-slate-600 capitalize">{latestEvents[0]?.event_mode ?? "Online"} · {latestEvents[0]?.payment_type === "free" ? "Free" : `₹${latestEvents[0]?.price}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <div className="flex -space-x-1.5">
                {["bg-violet-500", "bg-blue-500", "bg-fuchsia-500"].map((c, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-2 border-[#06060c] ${c} opacity-70`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 flex-1 truncate">{latestEvents[0]?.capacity ? `${latestEvents[0].capacity} spots` : "Open to all"}</p>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold flex-shrink-0">OPEN</span>
            </div>
          </div>
        </div>

        {/* Right top — real event with capacity bar */}
        <div className="absolute right-[2%] top-[15%] hidden xl:block" style={{ animation: "floatY 4.5s 1.2s ease-in-out infinite" }}>
          <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 w-56 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent" />
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[11px] font-bold text-white">Trending now</p>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mb-2 relative z-10 line-clamp-1">
              {latestEvents[1]?.title ?? "Design Workshop — Mumbai"}
            </p>
            {latestEvents[1]?.capacity ? (
              <>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden relative z-10">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 w-[60%]" style={{ animation: "barFill 1.5s 1s ease both" }} />
                </div>
                <p className="text-[9px] text-slate-600 mt-1.5 relative z-10">
                  {latestEvents[1].payment_type === "free" ? "Free" : `₹${latestEvents[1].price}`} · {latestEvents[1].capacity} spots
                </p>
              </>
            ) : (
              <p className="text-[9px] text-slate-600 relative z-10 capitalize">
                {latestEvents[1]?.event_mode ?? "Online"} · {latestEvents[1]?.event_category ?? "Workshop"}
              </p>
            )}
          </div>
        </div>

        {/* Left bottom — newest event */}
        <div className="absolute left-[3%] bottom-[14%] hidden xl:block" style={{ animation: "floatY 5s 0.5s ease-in-out infinite" }}>
          <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </div>
              <p className="text-[11px] font-semibold text-white">Just added!</p>
            </div>
            <p className="text-[10px] text-slate-600 truncate max-w-[160px]">
              {latestEvents[2]?.title ?? "New Event"} · {latestEvents[2]?.event_mode ?? "Online"}
            </p>
          </div>
        </div>

        {/* Right bottom — paid event revenue hint */}
        <div className="absolute right-[3%] bottom-[22%] hidden xl:block" style={{ animation: "floatY 4.2s 1.8s ease-in-out infinite" }}>
          <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
              <p className="text-[11px] font-semibold text-white">
                {events.filter(e => e.payment_type === "paid").length > 0
                  ? `${events.filter(e => e.payment_type === "paid").length} paid events live`
                  : "Events going live!"}
              </p>
            </div>
            <p className="text-[10px] text-slate-600">{totalEvents} total · {freeEvents} free</p>
          </div>
        </div>

        {/* Right middle — latest event ticket */}
        <div className="absolute right-[1%] top-[50%] hidden xl:block" style={{ animation: "floatY 3.8s 0.3s ease-in-out infinite" }}>
          <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-0.5">
              <Ticket className="w-3.5 h-3.5 text-fuchsia-400" />
              <p className="text-[11px] font-semibold text-white">
                {latestEvents[3]?.payment_type === "paid" ? "New ticket sold" : "New registration"}
              </p>
            </div>
            <p className="text-[10px] text-slate-600 truncate max-w-[150px]">
              {latestEvents[3]?.title ?? "Event"} · just now
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.2em] font-semibold">Scroll</p>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── TICKER ── */}
      {latestEvents.length > 0 && (
        <div className="relative z-10 border-y border-white/[0.05] bg-white/[0.015] py-4 overflow-hidden">
          <div
            className="flex gap-10 whitespace-nowrap w-max"
            style={{ animation: "ticker 32s linear infinite" }}
          >
            {[...Array(4)].flatMap(() =>
              latestEvents.map((e, i) => (
                <span
                  key={i}
                  onClick={() => navigate(`/events/${e.slug}`)}
                  className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 font-medium cursor-pointer transition-colors"
                >
                  <span>{categoryEmoji[e.event_category] ?? "✨"}</span>
                  <span className="text-slate-500">{e.title}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    e.payment_type === "free"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-amber-500/15 text-amber-500"
                  }`}>
                    {e.payment_type === "free" ? "FREE" : `₹${e.price}`}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10 mx-1" />
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── EVENTS SHOWCASE ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-24">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[11px] text-violet-400 font-semibold uppercase tracking-[0.2em] mb-2">Live on Eventify</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Upcoming Events
            </h2>
          </div>
          <button
            onClick={() => navigate("/events")}
            className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-500 hover:text-violet-400 font-semibold transition-colors group"
          >
            View all
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {openEvents.length === 0 ? (
          <div className="text-center py-16 text-slate-600 text-sm">No upcoming events yet.</div>
        ) : (
          <>
            {/* Featured event — first open event big card */}
            {openEvents[0] && (
              <div
                onClick={() => navigate(`/events/${openEvents[0].slug}`)}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.07] hover:border-violet-500/25 mb-4 cursor-pointer transition-all duration-500 hover:-translate-y-1"
              >
                {/* Banner */}
                <div className="relative h-56 sm:h-72 bg-gradient-to-br from-violet-900/60 to-blue-900/40 overflow-hidden">
                  {openEvents[0].bannerUrls?.[0] ? (
                    <img
                      src={openEvents[0].bannerUrls[0]}
                      alt={openEvents[0].title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white/5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-[#06060c]/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      openEvents[0].payment_type === "free"
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                        : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                    }`}>
                      <Tag className="w-2.5 h-2.5 inline mr-1" />
                      {openEvents[0].payment_type === "free" ? "Free" : `₹${openEvents[0].price}`}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-violet-500/15 border-violet-500/25 text-violet-300 capitalize">
                      {openEvents[0].event_category}
                    </span>
                  </div>

                  {/* Featured badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-white/70 backdrop-blur-sm">
                    ✦ Featured
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 bg-white/[0.02]">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-1">
                        {openEvents[0].title}
                      </h3>
                      {openEvents[0].description && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 max-w-xl">{openEvents[0].description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          {new Date(openEvents[0].start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 capitalize">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {openEvents[0].event_mode === "offline" && openEvents[0].location
                            ? openEvents[0].location
                            : openEvents[0].event_mode}
                        </span>
                        {openEvents[0].organizer_name && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span className="w-4 h-4 rounded-full bg-violet-500/30 border border-violet-500/20 inline-flex items-center justify-center text-[8px] font-black text-violet-300">
                              {openEvents[0].organizer_name.charAt(0).toUpperCase()}
                            </span>
                            {openEvents[0].organizer_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-bold group-hover:bg-violet-600/30 transition-all flex-shrink-0">
                      View Event <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
                {/* Bottom glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}

            {/* Remaining events — compact cards */}
            {openEvents.length > 1 && (
              <div className="flex flex-col sm:flex-row gap-4">
                {openEvents.slice(1, 4).map((event) => {
                  const isExpired = new Date(event.registration_deadline) < new Date();
                  return (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/events/${event.slug}`)}
                      className="group relative flex-1 bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Mini banner */}
                      <div className="relative h-28 bg-gradient-to-br from-violet-900/40 to-blue-900/30 overflow-hidden flex-shrink-0">
                        {event.bannerUrls?.[0] ? (
                          <img src={event.bannerUrls[0]} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-white/10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06060c]/80 via-transparent to-transparent" />
                        {/* Price badge */}
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold border flex items-center gap-1 ${
                          event.payment_type === "free"
                            ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                            : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                        }`}>
                          <Tag className="w-2 h-2" />
                          {event.payment_type === "free" ? "Free" : `₹${event.price}`}
                        </div>
                        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                          isExpired ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                        }`}>
                          {isExpired ? "Closed" : "Open"}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="text-sm font-black text-white group-hover:text-violet-300 transition-colors line-clamp-1 mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed flex-1 mb-3">{event.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-auto">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600">
                            <Calendar className="w-3 h-3 text-violet-400" />
                            {new Date(event.registration_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 capitalize ml-auto">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {event.event_mode}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View all mobile */}
            <div className="mt-6 sm:hidden text-center">
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-2 text-sm text-violet-400 font-semibold"
              >
                View all events <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-28">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.07] p-10 sm:p-14 text-center">
          {/* BG gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-[#06060c] to-blue-900/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-violet-500/20 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-blue-500/20 rounded-br-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> Get started today
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to host your<br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">next big event?</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
              Join thousands of organizers who trust Eventify to make their events unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => session ? navigate("/dashboard") : setOpen(true)}
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{session ? "Open Dashboard" : "Create Free Account"}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate("/events")}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {open && <Auth setOpen={setOpen}   />}

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        @keyframes barFill {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;