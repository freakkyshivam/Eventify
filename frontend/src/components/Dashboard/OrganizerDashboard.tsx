 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, IndianRupee, Calendar, Plus } from "lucide-react";
import { StatsCard } from "./StatsCard";

const organizerStats = [
  { label: "My Events", value: 0, icon: CalendarDays },
  { label: "Total Registrations", value: 0, icon: Users },
  { label: "Total Revenue", value: "₹0", icon: IndianRupee },
  { label: "Upcoming Events", value: 0, icon: Calendar },
];

type OrganizerDashboardProps = {
  activeTab: string;
};

export function OrganizerDashboard({ activeTab }: OrganizerDashboardProps) {
  if (activeTab === "Create Event") {
    return (
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Event creation form coming soon...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab !== "Dashboard") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Content for "{activeTab}" coming soon...</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {organizerStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <Button className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>My Events</span>
              <Button size="sm" variant="ghost">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-8">
              No events created yet. Create your first event!
            </p>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-8">
              No registrations yet
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}