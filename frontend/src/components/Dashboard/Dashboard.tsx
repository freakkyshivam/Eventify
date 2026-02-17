 
import { Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { OrganizerDashboard } from "./OrganizerDashboard";
import { UserDashboard } from "./UserDashboard";
import { SidebarItem } from "./SidebarItem";
import { getSidebarItems } from "./sidebarConfig";

type DashboardPageProps = {
  userRole?: "admin" | "organizer" | "user";
};

export default function DashboardPage({ userRole = "user" }: DashboardPageProps) {
  const [role, setRole] = useState(userRole);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Eventify</h1>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
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

        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {role === "admin"
                  ? "Admin Dashboard"
                  : role === "organizer"
                  ? "Organizer Dashboard"
                  : "My Dashboard"}
              </h2>
              <p className="text-gray-600 mt-1">
                {role === "admin"
                  ? "Manage events, users, and organizer requests"
                  : role === "organizer"
                  ? "Manage your events and track registrations"
                  : "Browse events and manage your registrations"}
              </p>
            </div>
          </div>

          {/* Role Switcher - Demo Only */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              🎭 Demo Mode - Switch Role:
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setRole("user");
                  setActiveTab("Dashboard");
                }}
                variant={role === "user" ? "default" : "outline"}
                className={
                  role === "user"
                    ? "bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }
              >
                User
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setRole("organizer");
                  setActiveTab("Dashboard");
                }}
                variant={role === "organizer" ? "default" : "outline"}
                className={
                  role === "organizer"
                    ? "bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }
              >
                Organizer
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setRole("admin");
                  setActiveTab("Dashboard");
                }}
                variant={role === "admin" ? "default" : "outline"}
                className={
                  role === "admin"
                    ? "bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }
              >
                Admin
              </Button>
            </div>
          </div>
        </header>

        {/* Role-specific Dashboard */}
        <div className="p-8">
          {role === "admin" && <AdminDashboard activeTab={activeTab} />}
          {role === "organizer" && <OrganizerDashboard activeTab={activeTab} />}
          {role === "user" && <UserDashboard activeTab={activeTab} />}
        </div>
      </main>
    </div>
  );
}