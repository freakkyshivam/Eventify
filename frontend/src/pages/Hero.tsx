import { Calendar, Zap, ArrowRight, Users, Sparkles, TrendingUp, Globe, Ticket, MapPin, Tag, ChevronRight, Shield, BarChart3, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { useState, useEffect, useRef } from "react";
import Auth from "./Auth";
import { getAllEvent } from "@/api/event/eventApi";
import type { eventI } from "@/types/Event";
import Footer from "@/components/Footer";

// ── Animated counter that starts when scrolled into view ──────────────────────
const Counter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── Fade-in on scroll wrapper ─────────────────────────────────────────────────
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
      { threshold: 0.1 }
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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<eventI[]>([]);

  useEffect(() => {
    getAllEvent()
      .then((res) => { if (Array.isArray(res)) setEvents(res); })
      .catch(() => {});
  }, []);

  const isOrganizer = session?.user?.role === "organizer" || session?.user?.role === "admin";

  const totalEvents  = events.length;
  const freeEvents   = events.filter((e) => e.payment_type === "free").length;
  const onlineEvents = events.filter((e) => e.event_mode === "online").length;
  const openEvents   = events.filter((e) => new Date(e.registration_deadline) > new Date());

  const handleGetStarted = () => {
    if (session) navigate(isOrganizer ? "/create-events" : "/events");
    else setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c12] overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-28 px-6">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">

          {/* Badge */}
          <FadeIn className="inline-flex">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-600/20 mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
              </span>
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-violet-400">Your All-in-One Event Platform</span>
            </div>
          </FadeIn>

          {/* Heading */}
          <FadeIn delay={80}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f0f4f8] leading-tight mb-6">
              Discover & Create
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Events That Matter
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={160}>
            <p className="text-base sm:text-lg text-[#4b6480] max-w-2xl mx-auto mb-10 leading-relaxed">
              Build unforgettable experiences, connect with your community, and manage every detail seamlessly —{" "}
              <span className="text-[#94a3b8] font-medium">all in one place.</span>
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 h-11 px-8 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-150"
              >
                <Sparkles className="w-5 h-5" />
                {session ? (isOrganizer ? "Create Event" : "Browse Events") : "Get Started Free"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {session && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 h-11 px-8 text-sm font-medium border border-[#243447] hover:border-[#2d4159] text-[#94a3b8] hover:text-[#f0f4f8] bg-[#161f2e] hover:bg-[#111827] rounded-lg transition-all duration-150"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Go to Dashboard
                </button>
              ) }
            </div>
          </FadeIn>

          {/* Social proof */}
          <FadeIn delay={360}>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-[#4b6480]">Free to use</span>
              </div>
              <div className="w-px h-4 bg-[#1e2d3d]" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-[#4b6480]">Razorpay payments</span>
              </div>
              <div className="w-px h-4 bg-[#1e2d3d] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-[#4b6480]">Magic link auth</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-y border-[#1e2d3d]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Calendar className="w-4 h-4" />, color: "bg-violet-600/10 text-violet-400 border-violet-600/20", target: totalEvents,      suffix: "+", label: "Events Listed"  },
            { icon: <Users className="w-4 h-4" />,    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",       target: openEvents.length, suffix: "",  label: "Open Now"       },
            { icon: <TrendingUp className="w-4 h-4" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", target: freeEvents,   suffix: "",  label: "Free Events"    },
            { icon: <Globe className="w-4 h-4" />,    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",        target: onlineEvents,      suffix: "",  label: "Online Events"  },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 80} className="h-full">
              <div className="h-full bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5 hover:border-[#243447] transition-all duration-200 group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${s.color}`}>
                    {s.icon}
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-[#2d4159] group-hover:text-[#4b6480] transition-colors" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-display text-2xl font-bold text-[#f0f4f8]">
                    <Counter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-[#4b6480]">{s.label}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-b border-[#1e2d3d]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f0f4f8] mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"> Host Great Events</span>
            </h2>
            <p className="text-sm text-[#4b6480] max-w-lg mx-auto">
              From event creation to payment collection — Eventify handles the entire workflow so you can focus on building your community.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Sparkles className="w-5 h-5" />, title: "Easy Event Creation",    desc: "Create beautiful event listings with banners, categories, and pricing in minutes.",               color: "bg-violet-600/10 text-violet-400 border-violet-600/20", delay: 0   },
              { icon: <Ticket className="w-5 h-5" />,   title: "Seamless Registration",  desc: "One-click registrations with automatic seat tracking and waitlist management.",                   color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",       delay: 80  },
              { icon: <Shield className="w-5 h-5" />,   title: "Role-Based Access",       desc: "Admins, organizers, and attendees — each role gets exactly the access they need.",               color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", delay: 160 },
              { icon: <Tag className="w-5 h-5" />,      title: "Flexible Pricing",        desc: "Free or paid events with integrated Razorpay payments. Collect fees effortlessly.",              color: "bg-amber-500/10 text-amber-400 border-amber-500/20",    delay: 240 },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Dashboard Analytics",   desc: "Track registrations, view attendee lists, and manage all your events from one place.",           color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20", delay: 320 },
              { icon: <Zap className="w-5 h-5" />,      title: "Magic Link Auth",         desc: "Passwordless authentication with magic links and Google Sign In. Secure and fast.",              color: "bg-red-500/10 text-red-400 border-red-500/20",           delay: 400 },
            ].map((feature) => (
              <FadeIn key={feature.title} delay={feature.delay}>
                <div className="group p-6 bg-[#0d1117] border border-[#1e2d3d] rounded-2xl hover:border-[#243447] transition-all duration-200 h-full">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#f0f4f8] mb-2">{feature.title}</h3>
                  <p className="text-xs text-[#4b6480] leading-relaxed">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      

      {/* ── Events Showcase ──────────────────────────────────────────────────── */}
      <section id="events-showcase" className="py-24 px-6 border-b border-[#1e2d3d]">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-end justify-between mb-12">
            <FadeIn>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Live on Eventify</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f0f4f8]">Upcoming Events</h2>
            </FadeIn>
            <button
              onClick={() => navigate("/events")}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {openEvents.length === 0 ? (
            <div className="text-center py-16 text-[#4b6480] text-sm border border-[#1e2d3d] rounded-2xl bg-[#0d1117]">
              No upcoming events yet.
            </div>
          ) : (
            <>
              {/* Featured event */}
              {openEvents[0] && (
                <FadeIn>
                  <div
                    onClick={() => navigate(`/events/${openEvents[0].slug}`)}
                    className="group relative rounded-2xl overflow-hidden border border-[#1e2d3d] hover:border-[#243447] mb-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-56 sm:h-72 bg-gradient-to-br from-violet-900/40 to-blue-900/30 overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080c12] via-[#080c12]/30 to-transparent" />

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
                      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-bold text-white/70 backdrop-blur-sm">
                        ✦ Featured
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 bg-[#0d1117]">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-display font-bold text-[#f0f4f8] group-hover:text-violet-300 transition-colors mb-2 line-clamp-1">
                            {openEvents[0].title}
                          </h3>
                          {openEvents[0].description && (
                            <p className="text-[#4b6480] text-sm leading-relaxed line-clamp-2 max-w-xl">
                              {openEvents[0].description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4b6480]">
                              <Calendar className="w-3.5 h-3.5 text-violet-400" />
                              {new Date(openEvents[0].start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4b6480] capitalize">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              {openEvents[0].event_mode === "offline" && openEvents[0].location
                                ? openEvents[0].location
                                : openEvents[0].event_mode}
                            </span>
                            {openEvents[0].organizer_name && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4b6480]">
                                <span className="w-4 h-4 rounded-full bg-violet-500/30 border border-violet-500/20 inline-flex items-center justify-center text-[8px] font-bold text-violet-300">
                                  {openEvents[0].organizer_name.charAt(0).toUpperCase()}
                                </span>
                                {openEvents[0].organizer_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600/20 border border-violet-600/30 text-violet-300 text-sm font-medium group-hover:bg-violet-600/30 transition-all flex-shrink-0">
                          View Event <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Remaining events */}
              {openEvents.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {openEvents.slice(1, 4).map((event, i) => (
                    <FadeIn key={event.id} delay={i * 80}>
                      <div
                        onClick={() => navigate(`/events/${event.slug}`)}
                        className="group bg-[#0d1117] border border-[#1e2d3d] hover:border-[#243447] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col h-full"
                      >
                        <div className="relative h-28 bg-gradient-to-br from-violet-900/30 to-blue-900/20 overflow-hidden flex-shrink-0">
                          {event.bannerUrls?.[0] ? (
                            <img src={event.bannerUrls[0]} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Calendar className="w-7 h-7 text-white/10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/80 via-transparent to-transparent" />
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold border flex items-center gap-1 ${
                            event.payment_type === "free"
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                              : "bg-amber-500/20 border-amber-500/30 text-amber-300"
                          }`}>
                            <Tag className="w-2 h-2" />
                            {event.payment_type === "free" ? "Free" : `₹${event.price}`}
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <h4 className="text-sm font-semibold text-[#f0f4f8] group-hover:text-violet-300 transition-colors line-clamp-1 mb-1">{event.title}</h4>
                          {event.description && (
                            <p className="text-[11px] text-[#4b6480] line-clamp-2 leading-relaxed flex-1 mb-3">{event.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-auto">
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#4b6480]">
                              <Calendar className="w-3 h-3 text-violet-400" />
                              {new Date(event.registration_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#4b6480] capitalize ml-auto">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              {event.event_mode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}

              <div className="mt-6 sm:hidden text-center">
                <button
                  onClick={() => navigate("/events")}
                  className="inline-flex items-center gap-2 text-sm text-violet-400 font-medium"
                >
                  View all events <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-b border-[#1e2d3d]">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f0f4f8] mb-4">
            Ready to Create Your Event?
          </h2>
          <p className="text-sm text-[#4b6480] mb-8 max-w-md mx-auto leading-relaxed">
            Join organizers who trust Eventify to make their events unforgettable.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 h-11 px-10 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-150"
          >
            <Sparkles className="w-5 h-5" />
            {session ? "Open Dashboard" : "Get Started — It's Free"}
          </button>
        </FadeIn>
      </section>

      <Footer />

      {open && <Auth setOpen={setOpen} />}
    </div>
  );
};

export default HomePage;