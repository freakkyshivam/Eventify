
import {
  Calendar,
  CalendarDays,
  Plus,
  Users,
  Settings,
  Ticket,
  IndianRupee,
  Award,
} from "lucide-react";

export const getSidebarItems = (role: "admin" | "organizer" | "user") => {
  switch (role) {
    case "admin":
      return [
        { label: "Dashboard", icon: CalendarDays },
        { label: "All Events", icon: Calendar },
        { label: "Users", icon: Users },
        { label: "Organizer Requests", icon: Award },
        { label: "Payments", icon: IndianRupee },
        { label: "Settings", icon: Settings },
      ];
    case "organizer":
      return [
        { label: "Dashboard", icon: CalendarDays },
        { label: "My Events", icon: Calendar },
        { label: "Create Event", icon: Plus },
        { label: "Registrations", icon: Ticket },
        { label: "Revenue", icon: IndianRupee },
        { label: "Settings", icon: Settings },
      ];
    case "user":
      return [
        { label: "Dashboard", icon: CalendarDays },
        { label: "Browse Events", icon: Calendar },
        { label: "My Registrations", icon: Ticket },
        { label: "Request Organizer Access", icon: Award },
        { label: "Settings", icon: Settings },
      ];
    default:
      return [];
  }
};