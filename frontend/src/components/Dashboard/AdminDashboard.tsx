import { Users, CalendarDays, IndianRupee, Award, ChevronRight, Sparkles, Check, X, ClipboardList, ShieldCheck } from "lucide-react";
import { StatsCard } from "./utils/StatsCard";
import { useEffect, useState } from "react";
import { approveOrganizerRequest, fetchAllOrganizerRequest, fetchAllUser, rejectOrganizerRequest, fetchAllRegistrations } from "@/api/admin/admin.api";
import { getAllEvent } from "@/api/event/eventApi";


 

import { AdminUsers } from "./Admin/AdminUsers";
import { AdminAllEvents } from "./Admin/AdminAllEvents";
import { AdminRegistrations } from "./Admin/AdminRegistrations";
import { AdminOrganizerRequests } from "./Admin/AdminOrganizerRequests";
import { AdminPayments } from "./Admin/AdminPayments";
import { SettingsTab } from "./utils/SettingsTab";
import { type eventI } from "@/types/Event";

type pendingRequestsI = {
  id: string,
  status: "pending" | "approved" | "rejected",
  name: string,
  email: string,
  createdAt: string
}

type AdminDashboardProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function AdminDashboard({ activeTab }: AdminDashboardProps) {

  const [allUsers, setAllUsers] = useState([]);
  const [pendingRequests, setpendingRequests] = useState<pendingRequestsI[]>();
  const [errors, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [allEvents, setAllEvents] = useState<eventI[]>([]);
  const [recentPayments, setRecentPayments] = useState<[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    async function ft1() {
      try {
        const res = await fetchAllOrganizerRequest();
        if (!res) {
          setError("Failed to fetch organizer request")
          return;
        }
        setpendingRequests(res.results)
      } catch (error) {
        console.error(error);
        setError("Failed to fetch organizer request")
      }

    }

    async function ft2() {
      try {
        const res = await fetchAllUser();
        if (!res) {
          setError("Failed to fetch users")
          return;
        }
        setAllUsers(res.results)
      } catch (error) {
        console.error(error);

      }

    }

    async function fetchEvents() {
      try {
        const res = await getAllEvent();
        if (res) {
          setAllEvents(res);
        }
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchRegistrations() {
      try {
        const res = await fetchAllRegistrations();
        if (res?.success) {
          const regs = res.results;
          let revenue = 0;
          for (const reg of regs) {
            if (reg.payment && reg.payment.status === 'completed') {
               revenue += Number(reg.payment.amount || 0);
            }
          }
          setTotalRevenue(revenue);
          setRecentPayments(regs.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    }

    ft1();
    ft2();
    fetchEvents();
    fetchRegistrations();
  }, [])

  const adminStats = [
    { label: "Total Users", value: allUsers ? allUsers.length : 0, icon: Users },
    { label: "Total Events", value: allEvents ? allEvents.length : 0, icon: CalendarDays },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee },
    { label: "Pending Requests", value: pendingRequests ? pendingRequests.length : 0, icon: Award },
  ];

  const handleReject = async (id: string) => {
    setError("");
    setSuccess("")
    try {
      const res = await rejectOrganizerRequest(id);
      if (res?.success) {
        setSuccess(res?.msg)
        setpendingRequests(pendingRequests?.filter((r) => r.id != id))
      } else {
        setError(res?.msg)
      }
    } catch (error) {
      console.error(error);
      setError("Failed to reject organizer request")
    }
  }
  const handleApprove = async (id: string) => {
    setError("");
    setSuccess("")
    try {
      const res = await approveOrganizerRequest(id)
      if (res?.success) {
        setSuccess(res?.msg)
        setpendingRequests(pendingRequests?.filter((r) => r.id != id))
      } else {
        setError(res?.msg)
      }
    } catch (error) {
      console.error(error);
      setError("Failed to approve organizer request")
    }
  }

  setTimeout(() => {
    setSuccess("");
    setError("");
  }, 4000)

  // ── Other Tabs ──
  if (activeTab === "Users") {
    return <AdminUsers />;
  }

  if (activeTab === "Payments") {
    return <AdminPayments />;
  }

  if (activeTab === "Settings") {
    return <SettingsTab />;
  }

  if (activeTab === "All Events") {
    return <AdminAllEvents />;
  }

  if (activeTab === "Registrations") {
    return <AdminRegistrations />;
  }

  if (activeTab === "Organizer Requests") {
    return <AdminOrganizerRequests />;
  }

  if (activeTab !== "Dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#94a3b8]" />
        </div>
        <p className="text-[#4b6480] text-sm">
          Content for <span className="text-[#f0f4f8] font-medium">"{activeTab}"</span> coming soon...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} theme="red" />
        ))}
      </div>

      {errors && (
        <div className="w-full p-4 rounded-md bg-red-600/10 text-red-600 font-bold text-sm">
          {errors}
        </div>
      )}

      {success && (
        <div className="w-full p-4 rounded-md bg-green-600/10 text-green-600 font-bold text-sm">
          {success}
        </div>
      )}


      {/* ── Admin notice banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex items-center gap-4">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />
        <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-red-300">Admin Panel</p>
          <p className="text-xs text-[#4b6480]">You have full access to manage users, events, and platform settings.</p>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pending Organizer Requests */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4f8]">Organizer Requests</h3>
            </div>
            {pendingRequests && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] font-bold">
                {pendingRequests?.length} pending
              </span>
            )}
          </div>

          <div className="p-4 space-y-3">
            {pendingRequests ? (
              pendingRequests?.map((req, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#080c12] hover:bg-[#161f2e] border border-[#1e2d3d]/50 hover:border-[#1e2d3d] transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 text-white font-bold text-xs border border-violet-500/30">
                      {req?.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#f0f4f8] truncate">{req?.name}</p>
                      <p className="text-[11px] text-[#4b6480] truncate">{req?.email}</p>
                      <p className="text-[10px] text-[#4b6480] mt-0.5">{new Date(req?.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all duration-200">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#080c12] border border-[#1e2d3d]/50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#94a3b8]" />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs font-medium mb-0.5">All clear</p>
                  <p className="text-[#4b6480] text-xs">No pending organizer requests.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-[#f0f4f8]">Recent Payments</h3>
            </div>
            <button className="text-xs text-[#4b6480] hover:text-emerald-400 flex items-center gap-1 transition-colors duration-200">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {recentPayments && recentPayments.length > 0 ? (
              recentPayments.map((payment: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#080c12] hover:bg-[#161f2e] border border-[#1e2d3d]/50 hover:border-[#1e2d3d] transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shrink-0 text-white font-bold text-xs border border-emerald-500/30">
                      {payment.user_name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                       <p className="text-xs font-semibold text-[#f0f4f8] truncate">{payment.user_name}</p>
                       <p className="text-[11px] text-[#4b6480] truncate">{payment.event_title}</p>
                       <p className="text-[10px] text-[#4b6480] mt-0.5">{new Date(payment.registration_date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                     <span className="text-sm font-bold text-emerald-400">₹{payment.payment?.amount || 0}</span>
                     <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                        payment.payment?.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        payment.payment?.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                     }`}>
                        {payment.payment?.status || 'Free'}
                     </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#080c12] border border-[#1e2d3d]/50 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-[#94a3b8]" />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs font-medium mb-0.5">No payments yet</p>
                  <p className="text-[#4b6480] text-xs">Payment transactions will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}