
import {
  Calendar,
  CalendarDays,
  Users,
  Settings,
  Ticket,
  IndianRupee,
  Award,
} from "lucide-react";

export const getSidebarItems = (role: "admin" | "organizer" | "attendee") => {
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
        
        { label: "Registrations", icon: Ticket },
        { label: "Revenue", icon: IndianRupee },
        { label: "Settings", icon: Settings },
      ];
    case "attendee":
      return [
        { label: "Dashboard", icon: CalendarDays },
        { label: "My Registrations", icon: Calendar },
        { label: "My Tickets", icon: Ticket },
        { label: "Request Organizer Access", icon: Award },
        { label: "Settings", icon: Settings },
      ];
    default:
      return [];
  }
};