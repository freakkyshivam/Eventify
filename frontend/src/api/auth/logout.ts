import api from "@/services/axiosInstance";

export const handleLogout = async (): Promise<void> => {
  try {
    localStorage.clear();
    await api.get("/auth/logout",   { withCredentials: true });
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    localStorage.clear();
    window.location.href = "/";
  }
};