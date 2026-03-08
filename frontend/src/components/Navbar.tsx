import { Calendar, LayoutDashboard, LogOut, ChevronDown, Shield, Users, Ticket } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useHook";
import { handleLogout } from "@/api/auth/logout";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session;
  const role = session?.user?.role;
  const name = session?.user?.name || session?.user?.email || "";
  const profileImage = session?.user?.profileImage;
  const initials = name?.charAt(0)?.toUpperCase() ?? "U";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  const roleConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    admin:     { label: "Admin",     color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     icon: <Shield className="w-3 h-3" /> },
    organizer: { label: "Organizer", color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20",  icon: <Calendar className="w-3 h-3" /> },
    attendee:  { label: "Attendee",  color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    icon: <Ticket className="w-3 h-3" /> },
  };
  const rc = roleConfig[role ?? ""] ?? { label: role ?? "", color: "text-slate-400", bg: "bg-white/[0.05]", border: "border-white/10", icon: <Users className="w-3 h-3" /> };

  const navLinks = [
    { label: "Events", to: "/events" },
    ...(role === "organizer" || role === "admin" ? [{ label: "Create Event", to: "/create-events" }] : []),
  ];

  return (
    <div className="bg-[#080810]/85 backdrop-blur-xl sticky top-0 z-50 border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 group-hover:bg-violet-600/30 group-hover:border-violet-500/50 flex items-center justify-center transition-all duration-200">
              <Calendar className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-base font-black text-white tracking-tight group-hover:text-violet-300 transition-colors duration-200">
              Eventify
            </span>
          </Link>

          {/* ── Nav links (desktop) ── */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Right section ── */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {isAuthenticated && (
              <>
                {/* Dashboard shortcut */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/dashboard"
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08] group"
                  >
                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-violet-500/40 transition-all duration-200 flex-shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-600/50 to-blue-600/30 flex items-center justify-center">
                          <span className="text-sm font-black text-violet-200">{initials}</span>
                        </div>
                      )}
                      {/* Online dot */}
                      <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#080810]" />
                    </div>

                    {/* Name + role */}
                    <div className="hidden sm:block text-left min-w-0">
                      <p className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                        {name.split("@")[0]}
                      </p>
                      <div className={`inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${rc.bg} ${rc.border} ${rc.color}`}>
                        {rc.icon}
                        {rc.label}
                      </div>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-all duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#0d0d18] border border-white/[0.09] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                      {/* Header */}
                      <div className="px-4 py-3.5 border-b border-white/[0.06]">
                        <p className="text-xs font-bold text-white truncate">{name.split("@")[0]}</p>
                        <p className="text-[10px] text-slate-600 truncate mt-0.5">{session?.user?.email}</p>
                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold border ${rc.bg} ${rc.border} ${rc.color}`}>
                          {rc.icon}
                          {rc.label}
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                          Dashboard
                        </button>
                        {(role === "organizer" || role === "admin") && (
                          <button
                            onClick={() => navigate("/create-events")}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                          >
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            Create Event
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="p-1.5 border-t border-white/[0.06]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all duration-150"
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
      </nav>
    </div>
  );
};

export default Navbar;