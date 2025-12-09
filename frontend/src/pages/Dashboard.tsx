// src/pages/Dashboard.tsx

import { Calendar, Ticket, IndianRupee, CalendarDays, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Events", value: 12, icon: CalendarDays },
  { label: "Upcoming Events", value: 4, icon: Calendar },
  { label: "Tickets Sold (Today)", value: 134, icon: Ticket },
  { label: "Revenue (This Month)", value: "₹45,200", icon: IndianRupee },
];

const upcomingEvents = [
  { name: "Tech Conference 2025", date: "12 Dec 2025", location: "Delhi", status: "Published" },
  { name: "Startup Meetup", date: "18 Dec 2025", location: "Online", status: "Draft" },
  { name: "Music Fest", date: "22 Dec 2025", location: "Mumbai", status: "Published" },
];

const recentBookings = [
  { customer: "Rahul Sharma", event: "Tech Conference 2025", tickets: 2, time: "2h ago" },
  { customer: "Priya Verma", event: "Music Fest", tickets: 4, time: "5h ago" },
  { customer: "Aman Gupta", event: "Startup Meetup", tickets: 1, time: "Yesterday" },
];

type SidebarItemProps = {
  label: string;
  active?: boolean;
};

function SidebarItem({ label, active }: SidebarItemProps) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-background bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-semibold text-lg">Eventify</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <SidebarItem label="Dashboard" active />
          <SidebarItem label="Events" />
          <SidebarItem label="Bookings" />
          <SidebarItem label="Customers" />
          <SidebarItem label="Calendar" />
          <SidebarItem label="Settings" />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 gap-3">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="md:hidden font-semibold">Eventify</span>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Overview of your events, bookings and revenue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <Input placeholder="Search events or bookings..." className="w-64" />
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                SC
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Stats */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                  {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Upcoming + Bookings */}
          <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            {/* Upcoming Events */}
            <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Upcoming Events</CardTitle>
                <Button variant="outline" size="sm">
                  View all
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.name}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={event.status === "Published" ? "default" : "outline"}
                            className="text-xs"
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-sm">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between text-sm border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-xs text-muted-foreground">{booking.event}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">
                        {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Calendar + Quick actions */}
          <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar (placeholder)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Integrate a real calendar later (e.g. fullcalendar, custom component, or simple list
                view by date).
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Event
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View All Events
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Export Bookings Report
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
