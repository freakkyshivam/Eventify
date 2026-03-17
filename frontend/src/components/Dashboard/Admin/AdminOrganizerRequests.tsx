import { Award, Check, X, Mail, Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  approveOrganizerRequest,
  fetchAllOrganizerRequest,
  rejectOrganizerRequest,
} from "@/api/admin/admin.api";

type OrganizerRequestI = {
  id: string;
  status: "pending" | "approved" | "rejected";
  name: string;
  email: string;
  createdAt: string;
};

export function AdminOrganizerRequests() {
  const [requests, setRequests] = useState<OrganizerRequestI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      const res = await fetchAllOrganizerRequest();
      if (res?.results) {
        setRequests(res.results);
      } else {
        setError("Failed to fetch organizer requests");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching requests");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await approveOrganizerRequest(id);
      if (res?.success) {
        setSuccess(res?.msg || "Request approved successfully");
        setRequests(requests.filter((r) => r.id !== id));
      } else {
        setError(res?.msg || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while approving request");
    }
  };

  const handleReject = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await rejectOrganizerRequest(id);
      if (res?.success) {
        setSuccess(res?.msg || "Request rejected successfully");
        setRequests(requests.filter((r) => r.id !== id));
      } else {
        setError(res?.msg || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while rejecting request");
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Organizer Requests
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Review and manage requests from users who want to host events.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl text-sm text-[#f0f4f8] placeholder:text-[#4b6480] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-[#4b6480] text-sm font-medium">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center gap-4 text-center bg-[#0d1117] border border-[#1e2d3d] rounded-2xl">
            <div className="w-16 h-16 rounded-3xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
              <Award className="w-8 h-8 text-[#4b6480]" />
            </div>
            <div>
              <p className="text-[#f0f4f8] font-medium text-lg">All clear!</p>
              <p className="text-[#4b6480] text-sm mt-1">
                {searchQuery
                  ? "No requests found matching your search."
                  : "There are no pending organizer requests."}
              </p>
            </div>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-5 hover:border-[#243447] transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-lg shadow-amber-900/20">
                  {req.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[#f0f4f8] font-bold text-base truncate" title={req.name}>
                    {req.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#4b6480] text-sm mt-1 truncate" title={req.email}>
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{req.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[#1e2d3d]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-[#4b6480] text-xs font-medium bg-[#161f2e] px-2.5 py-1 rounded-md border border-[#1e2d3d]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    Pending
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-sm font-semibold transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/10"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
