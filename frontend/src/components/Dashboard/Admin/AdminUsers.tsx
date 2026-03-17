import { Users, Mail, Shield, Calendar, Search, RefreshCw, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllUser, updateUserRole } from "@/api/admin/admin.api";

type UserI = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export function AdminUsers() {
  const [users, setUsers] = useState<UserI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await fetchAllUser();
        if (res?.results) {
          setUsers(res.results);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      setError("");
      setSuccessMsg("");
      const res = await updateUserRole(userId, newRole);
      if (res?.success) {
        setSuccessMsg("User role updated successfully.");
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(res?.msg || "Failed to update user role");
      }
    } catch (err) {
      setError("An error occurred while updating the role");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f0f4f8] flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Platform Users
          </h2>
          <p className="text-[#4b6480] text-sm mt-1">
            Manage and view all registered users across the platform.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b6480]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl text-sm text-[#f0f4f8] placeholder:text-[#4b6480] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2d3d] bg-[#161f2e]/50">
                <th className="px-6 py-4 text-xs font-semibold text-[#4b6480] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#4b6480] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#4b6480] uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d3d]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#4b6480] text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#4b6480] text-sm">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#161f2e] border border-[#1e2d3d] flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#4b6480]" />
                      </div>
                      No users found matching your search.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#161f2e] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-sm border border-violet-500/30">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#f0f4f8]">{user.name}</div>
                          <div className="text-xs text-[#4b6480] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                            user.role === "admin"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : user.role === "organizer"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </div>
                        
                        <div className="relative">
                           <select 
                            disabled={updatingId === user.id}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="appearance-none bg-[#161f2e] border border-[#1e2d3d] text-[#8a9fb1] text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-violet-500/50 hover:border-[#243447] transition-colors cursor-pointer disabled:opacity-50"
                           >
                            <option value="organizer">Organizer</option>
                            <option value="attendee">Attendee</option>
                           </select>
                           {updatingId === user.id ? (
                              <RefreshCw className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-violet-400 animate-spin pointer-events-none" />
                           ) : (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 border-b-2 border-r-2 border-[#4b6480] transform rotate-45 pointer-events-none"></div>
                           )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4b6480]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
