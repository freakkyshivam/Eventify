import { Calendar, Users, Zap, Award } from "lucide-react";

const features = [
  {
    icon: <Calendar className="w-5 h-5 text-violet-400" />,
    iconBg: "bg-violet-500/10 border-violet-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
    bottomLine: "via-violet-500/60",
    tag: "For Everyone",
    title: "Easy Event Creation",
    desc: "Set up your event in minutes with our intuitive interface. Add details, set pricing, and publish instantly.",
  },
  {
    icon: <Users className="w-5 h-5 text-blue-400" />,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    bottomLine: "via-blue-500/60",
    tag: "Attendees",
    title: "Seamless Registration",
    desc: "Attendees can register with just a few clicks. Support for both free and paid events with secure payments.",
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    bottomLine: "via-amber-500/60",
    tag: "Insights",
    title: "Real-time Analytics",
    desc: "Track registrations, revenue, and engagement with powerful analytics and insights dashboard.",
  },
  {
    icon: <Award className="w-5 h-5 text-emerald-400" />,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    bottomLine: "via-emerald-500/60",
    tag: "Organizers",
    title: "Become an Organizer",
    desc: "Request organizer status and unlock advanced features to create and manage professional events.",
  },
];

const About = () => {
  return (
    <section id="about" className="relative py-24 bg-[#080810] overflow-hidden">

      {/* Ambient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            Platform Features
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Everything You{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Powerful features to make your event management effortless
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative bg-white/3 hover:bg-white/5.5 border border-white/[0.07] hover:border-white/13 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden cursor-default ${feature.glow} transition-shadow`}
            >
              {/* Bottom gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent ${feature.bottomLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Top row */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-600 border border-white/[0.07] rounded-full px-2 py-0.5">
                  {feature.tag}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;