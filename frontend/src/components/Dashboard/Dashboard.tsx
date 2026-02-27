import { Calendar, LogOut, ShieldCheck, Award, User } from "lucide-react";
import { useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { OrganizerDashboard } from "./OrganizerDashboard";
import { UserDashboard } from "./UserDashboard";
import { SidebarItem } from "./SidebarItem";
import { getSidebarItems } from "./sidebarConfig";

type DashboardPageProps = {
  userRole?: "admin" | "organizer" | "user";
};

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
  user: {
    label: "User",
    icon: <User className="w-3.5 h-3.5" />,
    color: "text-violet-400",
    chipBg: "bg-violet-500/10 border-violet-500/20",
    title: "My Dashboard",
    subtitle: "Browse events and manage your registrations",
  },
};

export default function DashboardPage({ userRole = "user" }: DashboardPageProps) {
  const [role, setRole] = useState<"admin" | "organizer" | "user">(userRole);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-[#080810] flex text-white">

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 flex flex-col bg-[#080810] border-r border-white/6 sticky top-0 h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/6">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">Eventify</h1>
            <div className={`inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${config.chipBg} ${config.color}`}>
              {config.icon}
              {config.label}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {getSidebarItems(role).map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={activeTab === item.label}
              onClick={() => setActiveTab(item.label)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/6">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/[0.07] border border-transparent hover:border-red-500/15 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#080810]/80 backdrop-blur-xl border-b border-white/6 px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{config.title}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{config.subtitle}</p>
            </div>

            {/* Role chip */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 ${config.chipBg} ${config.color}`}>
              {config.icon}
              {config.label}
            </div>
          </div>

          {/* Demo Role Switcher */}
          <div className="mt-4 flex items-center gap-3 p-3 bg-white/3 border border-white/[0.07] rounded-xl">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider shrink-0">
              Demo Role:
            </span>
            <div className="flex gap-2">
              {(["user", "organizer", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setActiveTab("Dashboard"); }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    role === r
                      ? `${roleConfig[r].chipBg} ${roleConfig[r].color} border`
                      : "text-slate-600 hover:text-slate-300 border border-transparent hover:border-white/10 hover:bg-white/5"
                  }`}
                >
                  {roleConfig[r].icon}
                  {roleConfig[r].label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-8">
          {role === "admin" && <AdminDashboard activeTab={activeTab} />}
          {role === "organizer" && <OrganizerDashboard activeTab={activeTab} />}
          {role === "user" && <UserDashboard activeTab={activeTab} />}
        </div>

      </main>
    </div>
  );
}