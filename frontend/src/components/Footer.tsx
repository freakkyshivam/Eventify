import { Calendar, Github, Globe, Mail, Linkedin, Code2 } from "lucide-react";
 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1e2d3d] bg-[#080c12]">

      {/* ── Developer Section ── */}
      <section className="py-16 px-6 border-b border-[#1e2d3d] bg-[#0d1117]/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
              Built By
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f0f4f8]">
              Meet the Developer
            </h2>
          </div>

          {/* Developer Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-8 hover:border-[#243447] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(124,58,237,0.2)]">
                  <span className="font-display text-2xl font-extrabold text-white">SC</span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display text-xl font-bold text-[#f0f4f8] mb-1">
                    Shivam Chaudhary
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-sm text-cyan-400 font-medium">Backend Developer</span>
                  </div>
                  <p className="text-xs text-[#4b6480] leading-relaxed">
                    Passionate about building scalable backend systems and turning ideas into production-ready applications.
                  </p>
                </div>
              </div>

              {/* Social links
                    */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6 pt-6 border-t border-[#1e2d3d]">
                <a
                  href="https://github.com/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161f2e] border border-[#1e2d3d] text-[#4b6480] hover:text-[#f0f4f8] hover:border-[#243447] hover:bg-[#111827] transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-xs font-medium">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/freakkyshivam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161f2e] border border-[#1e2d3d] text-[#4b6480] hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://freakkyshivam.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161f2e] border border-[#1e2d3d] text-[#4b6480] hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium">Portfolio</span>
                </a>
                <a
                  href="mailto:skc722768@gmail.com"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161f2e] border border-[#1e2d3d] text-[#4b6480] hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-medium">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Bar ── */}
      <div className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-[#94a3b8]">Eventify</span>
          </div>
          
          <p className="text-xs text-[#2d4159]">
            Built with ❤️ by{" "}
            <a
              href="https://freakkyshivam.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4b6480] hover:text-violet-400 transition-colors"
            >
              Shivam Chaudhary
            </a>
            {" "}· © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;