import { Calendar, LayoutDashboard, LogOut, ChevronDown, Shield, Users, Ticket, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { handleLogout } from "@/api/auth/logout";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session;
  const role = session?.user?.role;
  const name = session?.user?.name || session?.user?.email || "";
  const profileImage = session?.user?.profileImage;
  const initials = name?.charAt(0)?.toUpperCase() ?? "U";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const roleConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    admin:     { label: "Admin",     color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    icon: <Shield className="w-3 h-3" /> },
    organizer: { label: "Organizer", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  icon: <Calendar className="w-3 h-3" /> },
    attendee:  { label: "Attendee",  color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", icon: <Ticket className="w-3 h-3" /> },
  };
  const rc = roleConfig[role ?? ""] ?? {
    label: role ?? "",
    color: "text-slate-400",
    bg: "bg-white/[0.05]",
    border: "border-white/10",
    icon: <Users className="w-3 h-3" />,
  };

  const navLinks = [
    { label: "Events", to: "/events" },
    ...(role === "organizer" || role === "admin" ? [{ label: "Create Event", to: "/create-events" }] : []),
  ];

  // Navigate and close dropdown immediately — no flicker waiting for route change effect
  const go = (to: string) => {
    setDropdownOpen(false);
    navigate(to);
  };

  return (
    <div className="bg-[#080c12]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#1e2d3d]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 group-hover:bg-violet-500 transition-colors duration-200">
              {/* FIX 1: h-4.5 w-4.5 is not a valid Tailwind class — icon was 0×0 */}
              <Calendar className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="font-display text-lg font-bold text-[#f0f4f8] tracking-tight group-hover:text-violet-300 transition-colors duration-200">
              Eventify
            </span>
          </Link>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                      : "text-[#4b6480] hover:text-[#94a3b8] hover:bg-[#161f2e]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-[#4b6480] hover:text-[#94a3b8] p-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isAuthenticated && (
              <>
                {/* Dashboard shortcut (desktop) */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname === "/dashboard"
                      ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                      : "text-[#4b6480] hover:text-[#94a3b8] hover:bg-[#161f2e]"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                
                <div className="relative sm:border-l sm:border-[#1e2d3d] sm:pl-3" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#1e2d3d] group-hover:border-violet-600/40 transition-all duration-200 flex-shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-violet-400">{initials}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#080c12]" />
                    </div>

                    <div className="hidden sm:block text-left min-w-0">
                      <p className="text-xs font-medium text-[#f0f4f8] leading-none truncate max-w-[100px]">
                        {name.split("@")[0]}
                      </p>
                      <div className={`inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${rc.bg} ${rc.border} ${rc.color}`}>
                        {rc.icon}
                        {rc.label}
                      </div>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-[#4b6480] group-hover:text-[#94a3b8] transition-all duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d1117] border border-[#1e2d3d] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                      <div className="px-4 py-3.5 border-b border-[#1e2d3d]">
                        <p className="text-xs font-medium text-[#f0f4f8] truncate">{name.split("@")[0]}</p>
                        <p className="text-[10px] text-[#4b6480] truncate mt-0.5">{session?.user?.email}</p>
                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold border ${rc.bg} ${rc.border} ${rc.color}`}>
                          {rc.icon}
                          {rc.label}
                        </div>
                      </div>

                      <div className="p-1.5">
                         
                        <button
                          onClick={() => go("/dashboard")}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-[#4b6480] hover:text-[#f0f4f8] hover:bg-[#161f2e] transition-all duration-150"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                          Dashboard
                        </button>
                        {(role === "organizer" || role === "admin") && (
                          <button
                            onClick={() => go("/create-events")}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-[#4b6480] hover:text-[#f0f4f8] hover:bg-[#161f2e] transition-all duration-150"
                          >
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            Create Event
                          </button>
                        )}
                      </div>

                      <div className="p-1.5 border-t border-[#1e2d3d]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all duration-150"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-[#1e2d3d] mt-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                      : "text-[#4b6480] hover:text-[#94a3b8] hover:bg-[#161f2e]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  location.pathname === "/dashboard"
                    ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                    : "text-[#4b6480] hover:text-[#94a3b8] hover:bg-[#161f2e]"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;