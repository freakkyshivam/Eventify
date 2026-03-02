import { Award, Zap, BarChart3, Headphones, Palette, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";

const perks = [
  {
    icon: <Zap className="w-5 h-5 text-violet-400" />,
    iconBg: "bg-violet-500/10 border-violet-500/20",
    glow: "group-hover:shadow-[0_0_25px_rgba(124,58,237,0.12)]",
    bottomLine: "via-violet-500/60",
    title: "Unlimited Events",
    text: "Create unlimited events with advanced customization and full control over every detail.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    glow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]",
    bottomLine: "via-blue-500/60",
    title: "Premium Analytics",
    text: "Access powerful analytics and reporting tools to track registrations, revenue, and engagement.",
  },
  {
    icon: <Headphones className="w-5 h-5 text-fuchsia-400" />,
    iconBg: "bg-fuchsia-500/10 border-fuchsia-500/20",
    glow: "group-hover:shadow-[0_0_25px_rgba(217,70,239,0.12)]",
    bottomLine: "via-fuchsia-500/60",
    title: "Priority Support",
    text: "Get priority support and a dedicated account manager to help you every step of the way.",
  },
  {
    icon: <Palette className="w-5 h-5 text-amber-400" />,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    glow: "group-hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]",
    bottomLine: "via-amber-500/60",
    title: "Custom Branding",
    text: "Apply custom branding and white-label options to make every event uniquely yours.",
  },
];

const OrganizerRequest = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const isLoggedIn = !!session;

  return (
    <section id="ogR" className="relative py-24 bg-[#080810] overflow-hidden">

      

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            For Professionals
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Become an Event{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              Organizer
            </span>
          </h2>

          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Take your event hosting to the next level. Unlock powerful tools designed for professional organizers.
          </p>
        </div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {perks.map((perk, i) => (
            <div
              key={i}
              className={`group relative bg-white/3 hover:bg-white/5.5 border border-white/[0.07] hover:border-white/13 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden cursor-default ${perk.glow}`}
            >
              {/* Hover bottom line */}
              <div className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent ${perk.bottomLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 ${perk.iconBg}`}>
                {perk.icon}
              </div>

              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-200">
                {perk.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {perk.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_50px_rgba(124,58,237,0.55)] hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Award className="w-5 h-5" />
            {isLoggedIn ? "Request Organizer Access" : "Get Started"}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-500" />
            No forms required · Reviewed within 24 hours · One request per account
          </p>
        </div>

      </div>
    </section>
  );
};

export default OrganizerRequest;