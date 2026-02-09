import { Calendar, Ticket, IndianRupee, CalendarDays, Plus, Users, TrendingUp, DollarSign, Settings, LogOut } from "lucide-react";
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
import { useState } from "react";

// Admin Dashboard Stats
const adminStats = [
  { label: "Total Users", value: 1245, icon: Users },
  { label: "Total Events", value: 89, icon: CalendarDays },
  { label: "Total Revenue", value: "₹8,45,200", icon: IndianRupee },
  { label: "Active Organizers", value: 34, icon: TrendingUp },
];

// Organizer Dashboard Stats
const organizerStats = [
  { label: "Total Events", value: 12, icon: CalendarDays },
  { label: "Upcoming Events", value: 4, icon: Calendar },
  { label: "Tickets Sold (Today)", value: 134, icon: Ticket },
  { label: "Revenue (This Month)", value: "₹45,200", icon: IndianRupee },
];

// User Dashboard Stats
const userStats = [
  { label: "Upcoming Events", value: 3, icon: Calendar },
  { label: "Past Events", value: 8, icon: CalendarDays },
  { label: "Tickets Booked", value: 15, icon: Ticket },
  { label: "Total Spent", value: "₹12,400", icon: IndianRupee },
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

const allOrganizers = [
  { name: "Event Masters", events: 23, revenue: "₹2,34,000", status: "Active" },
  { name: "Creative Events Co", events: 15, revenue: "₹1,56,000", status: "Active" },
  { name: "Mega Shows", events: 8, revenue: "₹89,000", status: "Pending" },
];

const myTickets = [
  { event: "Tech Conference 2025", date: "12 Dec 2025", tickets: 2, status: "Confirmed" },
  { event: "Music Fest", date: "22 Dec 2025", tickets: 4, status: "Confirmed" },
  { event: "Startup Meetup", date: "18 Dec 2025", tickets: 1, status: "Pending" },
];

type SidebarItemProps = {
  label: string;
  active?: boolean;
  icon?: any;
};

function SidebarItem({ label, active, icon: Icon }: SidebarItemProps) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
        active
          ? "bg-white text-black"
          : "hover:bg-gray-800 text-gray-400 hover:text-white"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

type DashboardPageProps = {
  userRole?: "admin" | "organizer" | "user";
};

export default function DashboardPage({ userRole = "organizer" }: DashboardPageProps) {
  const [role, setRole] = useState(userRole);

  const getStats = () => {
    switch (role) {
      case "admin":
        return adminStats;
      case "organizer":
        return organizerStats;
      case "user":
        return userStats;
      default:
        return organizerStats;
    }
  };

  const getSidebarItems = () => {
    switch (role) {
      case "admin":
        return [
          { label: "Dashboard", active: true, icon: CalendarDays },
          { label: "All Events", icon: Calendar },
          { label: "Organizers", icon: Users },
          { label: "Users", icon: Users },
          { label: "Revenue", icon: DollarSign },
          { label: "Settings", icon: Settings },
        ];
      case "organizer":
        return [
          { label: "Dashboard", active: true, icon: CalendarDays },
          { label: "Events", icon: Calendar },
          { label: "Bookings", icon: Ticket },
          { label: "Customers", icon: Users },
          { label: "Calendar", icon: Calendar },
          { label: "Settings", icon: Settings },
        ];
      case "user":
        return [
          { label: "Dashboard", active: true, icon: CalendarDays },
          { label: "Browse Events", icon: Calendar },
          { label: "My Tickets", icon: Ticket },
          { label: "Favorites", icon: Calendar },
          { label: "Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-gray-800 bg-black">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="font-semibold text-lg text-white">Eventify</span>
          <Badge className="ml-2 bg-white text-black text-xs">{role}</Badge>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          {getSidebarItems().map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Button variant="outline" className="w-full text-black border-gray-300 hover:bg-gray-400" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 gap-3 bg-black">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="md:hidden font-semibold text-white">Eventify</span>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                {role === "admin" ? "Admin Dashboard" : role === "organizer" ? "Organizer Dashboard" : "My Dashboard"}
              </h1>
              <p className="text-xs text-gray-400">
                {role === "admin" 
                  ? "Manage all events, organizers and users."
                  : role === "organizer"
                  ? "Overview of your events, bookings and revenue."
                  : "Your upcoming events and bookings."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <Input 
                placeholder={role === "user" ? "Search events..." : "Search events or bookings..."} 
                className="w-64 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-white focus:border-white" 
              />
              {role !== "user" && (
                <Button size="sm" className="gap-1 bg-white text-black hover:bg-gray-200">
                  <Plus className="h-4 w-4" />
                  New Event
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs font-medium text-black">
                {role === "admin" ? "AD" : role === "organizer" ? "OR" : "US"}
              </div>
            </div>
          </div>
        </header>

        {/* Role Switcher (for demo purposes) */}
        <div className="p-4 bg-gray-950 border-b border-gray-800">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-400">Demo: Switch Role:</span>
            <Button 
              size="sm" 
              variant={role === "admin" ? "default" : "outline"}
              onClick={() => setRole("admin")}
              className={role === "admin" ? "bg-white text-black" : "border-gray-700 text-gray-400 hover:bg-gray-800"}
            >
              Admin
            </Button>
            <Button 
              size="sm" 
              variant={role === "organizer" ? "default" : "outline"}
              onClick={() => setRole("organizer")}
              className={role === "organizer" ? "bg-white text-black" : "border-gray-700 text-gray-400 hover:bg-gray-800"}
            >
              Organizer
            </Button>
            <Button 
              size="sm" 
              variant={role === "user" ? "default" : "outline"}
              onClick={() => setRole("user")}
              className={role === "user" ? "bg-white text-black" : "border-gray-700 text-gray-400 hover:bg-gray-800"}
            >
              User
            </Button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6 bg-black">
          {/* Stats */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {getStats().map((item) => (
              <Card key={item.label} className="border border-gray-800 bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400">
                    {item.label}
                  </CardTitle>
                  {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-white">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Role-specific content */}
          {role === "admin" && (
            <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              {/* All Organizers */}
              <Card className="lg:col-span-2 border border-gray-800 bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white">All Organizers</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-black hover:bg-gray-400">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-gray-800">
                        <TableHead className="text-gray-400">Organizer</TableHead>
                        <TableHead className="text-gray-400">Events</TableHead>
                        <TableHead className="text-gray-400">Revenue</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrganizers.map((org) => (
                        <TableRow key={org.name} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{org.name}</TableCell>
                          <TableCell className="text-gray-400">{org.events}</TableCell>
                          <TableCell className="text-gray-400">{org.revenue}</TableCell>
                          <TableCell>
                            <Badge
                              variant={org.status === "Active" ? "default" : "outline"}
                              className={`text-xs ${org.status === "Active" ? "bg-white text-black" : "border-gray-700 text-white"}`}
                            >
                              {org.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-gray-800 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm border-b border-gray-800 pb-2">
                    <p className="font-medium text-white">New organizer registered</p>
                    <p className="text-xs text-gray-400">Event Masters - 2h ago</p>
                  </div>
                  <div className="text-sm border-b border-gray-800 pb-2">
                    <p className="font-medium text-white">Event published</p>
                    <p className="text-xs text-gray-400">Tech Conference - 5h ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-white">Payment received</p>
                    <p className="text-xs text-gray-400">₹23,400 - Yesterday</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {role === "organizer" && (
            <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              {/* Upcoming Events */}
              <Card className="lg:col-span-2 border border-gray-800 bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white">Upcoming Events</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-black hover:bg-gray-400">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-gray-800">
                        <TableHead className="text-gray-400">Event</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Location</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingEvents.map((event) => (
                        <TableRow key={event.name} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{event.name}</TableCell>
                          <TableCell className="text-gray-400">{event.date}</TableCell>
                          <TableCell className="text-gray-400">{event.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={event.status === "Published" ? "default" : "outline"}
                              className={`text-xs ${event.status === "Published" ? "bg-white text-black" : "border-gray-700 text-white"}`}
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
              <Card className="border border-gray-800 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm text-white">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentBookings.map((booking, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between text-sm border-b border-gray-800 last:border-b-0 pb-2 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-white">{booking.customer}</p>
                        <p className="text-xs text-gray-400">{booking.event}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-white">
                          {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-400">{booking.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {role === "user" && (
            <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
              {/* My Tickets */}
              <Card className="lg:col-span-2 border border-gray-800 bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white">My Upcoming Tickets</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 text-black hover:bg-gray-400">
                    View all
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-gray-800">
                        <TableHead className="text-gray-400">Event</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Tickets</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTickets.map((ticket) => (
                        <TableRow key={ticket.event} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{ticket.event}</TableCell>
                          <TableCell className="text-gray-400">{ticket.date}</TableCell>
                          <TableCell className="text-gray-400">{ticket.tickets}</TableCell>
                          <TableCell>
                            <Badge
                              variant={ticket.status === "Confirmed" ? "default" : "outline"}
                              className={`text-xs ${ticket.status === "Confirmed" ? "bg-white text-black" : "border-gray-700 text-white"}`}
                            >
                              {ticket.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-gray-800 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-white text-black hover:bg-gray-200" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Browse Events
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                    View My Tickets
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                    Download Tickets
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Bottom section */}
          <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2 border border-gray-800 bg-transparent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  Calendar (placeholder)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400">
                Integrate a real calendar later (e.g. fullcalendar, custom component, or simple list
                view by date).
              </CardContent>
            </Card>

            <Card className="border border-gray-800 bg-transparent">
              <CardHeader>
                <CardTitle className="text-sm text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {role === "admin" && (
                  <>
                    <Button className="w-full bg-white text-black hover:bg-gray-200" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Organizer
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      View All Events
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      Generate Report
                    </Button>
                  </>
                )}
                {role === "organizer" && (
                  <>
                    <Button className="w-full bg-white text-black hover:bg-gray-200" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Create New Event
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      View All Events
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      Export Bookings Report
                    </Button>
                  </>
                )}
                {role === "user" && (
                  <>
                    <Button className="w-full bg-white text-black hover:bg-gray-200" size="sm">
                      Browse New Events
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      My Favorites
                    </Button>
                    <Button variant="outline" className="w-full border-gray-700 text-black hover:bg-gray-400" size="sm">
                      Past Events
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}