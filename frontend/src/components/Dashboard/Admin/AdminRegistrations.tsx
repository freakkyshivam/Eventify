import { Ticket, Search, IndianRupee, Calendar, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllRegistrations } from "@/api/admin/admin.api";

type PaymentInfo = {
  amount: string;
  status: "completed" | "pending" | "failed";
};

type RegistrationI = {
  user_name: string;
  email: string;
  event_title: string;
  registration_date: string;
  registration_status: "registered" | "pending" | "cancelled";
  payment: PaymentInfo | null;
  ticket_code: string;
};

export function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<RegistrationI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      try {
        setLoading(true);
        const res = await fetchAllRegistrations();
        if (res?.success && res.results) {
          setRegistrations(res.results);
        } else {
          setError("Failed to fetch registrations");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching registrations");
      } finally {
        setLoading(false);
      }
    }
    loadRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.event_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.ticket_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-400" />
            Global Registrations
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Monitor all ticket sales and event registrations platform-wide.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl text-sm text-[#f0f4f8] placeholder:text-[#4b6480] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1e2d3d] bg-[#161f2e]/80">
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8a9fb1] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d3d]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[#4b6480] text-sm">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      Loading registrations...
                    </div>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[#4b6480] text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-3xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-[#4b6480]" />
                      </div>
                      <p className="text-[#f0f4f8] font-medium text-lg mt-2">No registrations found</p>
                      <p>Try adjusting your search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg, idx) => {
                  const isPaid = reg.payment?.status === "completed";
                  const isPending = reg.payment?.status === "pending";
                  const isFree = !reg.payment || Number(reg.payment.amount) === 0;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-[#161f2e] transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                            {reg.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#f0f4f8]">{reg.user_name}</div>
                            <div className="text-xs text-[#4b6480]">{reg.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#f0f4f8] max-w-[200px] truncate" title={reg.event_title}>
                          {reg.event_title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {reg.ticket_code ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1117] border border-[#1e2d3d] text-xs font-mono text-[#8a9fb1]">
                            <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                            {reg.ticket_code}
                          </div>
                        ) : (
                          <span className="text-xs text-[#4b6480]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="text-sm font-bold text-[#f0f4f8] flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-[#8a9fb1]" />
                            {reg.payment?.amount || "0"}
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isPaid
                                ? "bg-emerald-500/10 text-emerald-400"
                                : isPending
                                ? "bg-amber-500/10 text-amber-400"
                                : isFree
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            <Activity className="w-3 h-3" />
                            {isFree ? "Free" : reg.payment?.status || "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8a9fb1]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(reg.registration_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
