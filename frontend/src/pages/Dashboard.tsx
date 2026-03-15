import { Calendar, ShieldCheck, Award, User, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminDashboard } from "../components/Dashboard/AdminDashboard";
import { OrganizerDashboard } from "../components/Dashboard/OrganizerDashboard";
import { UserDashboard } from "../components/Dashboard/UserDashboard";
import { SidebarItem } from "../components/Dashboard/utils/SidebarItem";
import { getSidebarItems } from "../components/Dashboard/utils/sidebarConfig";
import { useAuth } from "@/hooks/useHook";
import Auth from "./Auth";
import { fetchUser } from "@/api/user/userApi";
import { useNavigate, useParams } from "react-router-dom";

const roleConfig = {
  admin: {
    label: "Admin",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    color: "text-red-400",
    chipBg: "bg-red-500/10 border-red-500/20",
    title: "Admin Dashboard",
    subtitle: "Manage events, users, and organizer requests",
  },
  organizer: {
    label: "Organizer",
    icon: <Award className="w-3.5 h-3.5" />,
    color: "text-amber-400",
    chipBg: "bg-amber-500/10 border-amber-500/20",
    title: "Organizer Dashboard",
    subtitle: "Manage your events and track registrations",
  },
  attendee: {
    label: "User",
    icon: <User className="w-3.5 h-3.5" />,
    color: "text-violet-400",
    chipBg: "bg-violet-500/10 border-violet-500/20",
    title: "My Dashboard",
    subtitle: "Browse events and manage your registrations",
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const { setSession, session } = useAuth();
  const [open, setOpen] = useState(true);

  // Helper to convert URL slug to readable tab name (e.g. "my-events" -> "My Events")
  // and handle special casing if necessary
  const formatTabName = (slug?: string) => {
    if (!slug) return "Dashboard";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const activeTab = formatTabName(tab);

  // Navigation handler to pass down
  const handleTabChange = (tabName: string) => {
    if (tabName === "Dashboard") {
      navigate("/dashboard");
    } else {
      const slug = tabName.toLowerCase().replace(/\s+/g, "-");
      navigate(`/dashboard/${slug}`);
    }
  };

  useEffect(() => {
    const ft = async () => {
      const response = await fetchUser();
      setSession({
        user: response.user,
        access_token: response.access_token,
      });
    };
    ft();
  }, []);

//   const { data } = useQuery({
//   queryKey: ["me"],
//   queryFn: fetchUser,
//   staleTime: 5 * 60 * 1000
// });


  if (!session) {
    if (open === false) {
      navigate(-1);
      return null;
    }
    return <Auth setOpen={setOpen} />;
  }

  const role = session?.user?.role || "attendee";
  const config = roleConfig[role];
  const name = session?.user?.name || session?.user?.email || "";
  const initials = name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="min-h-screen bg-[#080c12] flex text-[#f0f4f8]">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#0d1117] border-r border-[#1e2d3d] sticky top-0 h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e2d3d]">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-base font-bold text-[#f0f4f8] tracking-tight">Eventify</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[#2d4159] uppercase tracking-widest px-3 mb-2">Menu</p>
          {getSidebarItems(role).map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={activeTab === item.label}
              onClick={() => handleTabChange(item.label)}
            />
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-[#1e2d3d] space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#161f2e] border border-[#1e2d3d]">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-violet-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              {name && (
                <p className="text-xs font-medium text-[#f0f4f8] truncate">{name.split("@")[0]}</p>
              )}
              <div className={`inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${config.chipBg} ${config.color}`}>
                {config?.icon}
                {config?.label}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#080c12]/80 backdrop-blur-md border-b border-[#1e2d3d] px-4 lg:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#4b6480] text-xs mb-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <h2 className="font-display text-xl font-bold text-[#f0f4f8] tracking-tight">{config.title}</h2>
              <p className="text-[#4b6480] text-xs mt-0.5">{config.subtitle}</p>
            </div>

            {/* Role chip */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shrink-0 ${config.chipBg} ${config.color}`}>
              {config.icon}
              {config.label}
              <ChevronRight className="w-3 h-3 opacity-50" />
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-4 lg:p-6 xl:p-8">
          {role === "admin" && <AdminDashboard activeTab={activeTab} setActiveTab={handleTabChange} />}
          {role === "organizer" && <OrganizerDashboard activeTab={activeTab} setActiveTab={handleTabChange} />}
          {role === "attendee" && <UserDashboard activeTab={activeTab} setActiveTab={handleTabChange} />}
        </div>
      </main>
    </div>
  );
}