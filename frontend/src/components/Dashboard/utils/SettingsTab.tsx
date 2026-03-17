import { useState } from "react";
import { User, Mail, Shield, Bell,   CheckCircle2, ChevronRight, Save } from "lucide-react";
import { useAuth } from "@/hooks/useHook";

export function SettingsTab() {
  const { session } = useAuth();
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    
  });

  const [activeSegment, setActiveSegment] = useState<"profile" |  "notifications">("profile");
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual save logic
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Account Settings
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Manage your personal information, security preferences, and notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveSegment("profile")}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
              activeSegment === "profile" 
                ? "bg-[#161f2e] border border-indigo-500/30 text-indigo-400 shadow-md" 
                : "bg-transparent border border-transparent text-[#8a9fb1] hover:bg-[#161f2e]/50 hover:text-[#f0f4f8]"
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </div>
            {activeSegment === "profile" && <ChevronRight className="w-4 h-4" />}
          </button>

          

          <button
            onClick={() => setActiveSegment("notifications")}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
              activeSegment === "notifications" 
                ? "bg-[#161f2e] border border-indigo-500/30 text-indigo-400 shadow-md" 
                : "bg-transparent border border-transparent text-[#8a9fb1] hover:bg-[#161f2e]/50 hover:text-[#f0f4f8]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            {activeSegment === "notifications" && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
            
            {activeSegment === "profile" && (
              <form onSubmit={handleSave}>
                <div className="px-6 py-5 border-b border-[#1e2d3d] bg-[#161f2e]/50">
                  <h3 className="text-base font-bold text-[#f0f4f8]">Public Profile</h3>
                  <p className="text-xs text-[#4b6480] mt-1">This information will be displayed to other users.</p>
                </div>
                
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-5 pb-5 border-b border-[#1e2d3d]/50">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#f0f4f8]">{session?.user?.name}</div>
                      <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Shield className="w-3 h-3" />
                        {session?.user?.role || "Attendee"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#8a9fb1]">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#8a9fb1]">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#4b6480] cursor-not-allowed opacity-70"
                        />
                      </div>
                      <p className="text-[10px] text-[#4b6480] mt-1">Email cannot be changed directly.</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#1e2d3d] bg-[#161f2e]/50 flex items-center justify-end gap-3">
                  {isSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5 mr-2 animate-pulse">
                      <CheckCircle2 className="w-4 h-4" />
                      Saved Successfully
                    </span>
                  )}
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-500/20"
                  >
                    <Save className="w-4 h-4" />
                    Save Profile
                  </button>
                </div>
              </form>
            )}
 
            {activeSegment === "notifications" && (
              <div>
                <div className="px-6 py-5 border-b border-[#1e2d3d] bg-[#161f2e]/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#f0f4f8]">Notification Preferences</h3>
                    <p className="text-xs text-[#4b6480] mt-0.5">We're working on giving you granular notification controls!</p>
                  </div>
                </div>
                
                <div className="p-12 text-center">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                     <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                    </span>
                    Coming Soon Feature
                   </div>
                   <p className="text-[#8a9fb1] text-sm mt-4 max-w-sm mx-auto">
                     Soon you'll be able to toggle alerts for new event recommendations, ticket sales, and direct messages.
                   </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
