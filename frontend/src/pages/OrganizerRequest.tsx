import { Award, ArrowRight, Zap, BarChart3, Headphones, Palette } from "lucide-react";

const perks = [
  { icon: <Zap className="w-3.5 h-3.5 text-violet-400" />, text: "Create unlimited events with advanced customization" },
  { icon: <BarChart3 className="w-3.5 h-3.5 text-blue-400" />, text: "Access to premium analytics and reporting tools" },
  { icon: <Headphones className="w-3.5 h-3.5 text-fuchsia-400" />, text: "Priority support and dedicated account manager" },
  { icon: <Palette className="w-3.5 h-3.5 text-amber-400" />, text: "Custom branding and white-label options" },
];

const OrganizerRequest = () => {
  return (
    <section id="ogR" className="relative py-24 bg-[#080810] overflow-hidden">

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            For Professionals
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/2.5 border border-white/8 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(124,58,237,0.08)]">
          <div className="grid md:grid-cols-2">

            {/* ── Left — Info Panel ── */}
            <div className="relative p-10 lg:p-14 flex flex-col justify-center overflow-hidden">
              {/* Panel bg glow */}
              <div className="absolute inset-0 bg-linear-to-br from-violet-600/10 via-fuchsia-600/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="absolute top-0 bottom-0 right-0 w-px bg-linear-to-b from-transparent via-white/6 to-transparent" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-7 shadow-[0_0_25px_rgba(124,58,237,0.2)]">
                  <Award className="w-7 h-7 text-violet-400" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                  Become an Event{" "}
                  <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                    Organizer
                  </span>
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                  Take your event hosting to the next level. Get access to premium features and tools designed for professional organizers.
                </p>

                {/* Perks list */}
                <ul className="space-y-3">
                  {perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
                        {perk.icon}
                      </div>
                      <span className="text-sm text-slate-400 leading-relaxed">{perk.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Right — Form Panel ── */}
            <div className="relative p-10 lg:p-14 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/6">

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1.5">Request Organizer Access</h3>
                <p className="text-slate-500 text-sm">Fill out this form and we'll review your request within 24 hours.</p>
              </div>

              <form className="space-y-5">

                {/* Full Name */}
                <div>
                  <label htmlFor="full-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="full-name"
                    className="w-full px-4 py-3 bg-white/4 border border-white/8 hover:border-white/[0.14] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white/4 border border-white/8 hover:border-white/[0.14] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] hover:shadow-[0_0_40px_rgba(124,58,237,0.55)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
                >
                  <Award className="w-4 h-4" />
                  Submit Request
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <p className="text-[11px] text-slate-600 text-center">
                  By submitting, you agree to our{" "}
                  <a href="#" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">Privacy Policy</a>
                </p>
              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default OrganizerRequest;