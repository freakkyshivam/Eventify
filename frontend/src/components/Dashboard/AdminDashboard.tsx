 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, IndianRupee, Award } from "lucide-react";
import { StatsCard } from "./StatsCard";

const adminStats = [
  { label: "Total Users", value: 0, icon: Users },
  { label: "Total Events", value: 0, icon: CalendarDays },
  { label: "Total Revenue", value: "₹0", icon: IndianRupee },
  { label: "Pending Organizer Requests", value: 0, icon: Award },
];

type AdminDashboardProps = {
  activeTab: string;
};

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
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
        {adminStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Organizer Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Organizer Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Request */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">john@example.com</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested 2 hours ago
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                </div>
              </div>

              {/* Empty State */}
              <p className="text-sm text-gray-500 text-center py-4">
                No pending requests
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 text-center py-8">
              No recent payments
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}