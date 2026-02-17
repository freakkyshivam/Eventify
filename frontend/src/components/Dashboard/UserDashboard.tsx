 import { useEffect,useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Loader2, Calendar, Ticket, IndianRupee, Clock, Award,MapPin } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { getUserAllJoinedEvent } from "@/api/eventApi";
import type { eventI } from "@/types/Event";

const userStats = [
  { label: "Registered Events", value: 0, icon: Calendar },
  { label: "Tickets", value: 0, icon: Ticket },
  { label: "Total Spent", value: "₹0", icon: IndianRupee },
  { label: "Upcoming", value: 0, icon: Clock },
];

type UserDashboardProps = {
  activeTab: string;
};

export function UserDashboard({ activeTab }: UserDashboardProps) {

    const [events, setEvents] = useState<eventI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");


     useEffect(() => {
        fetchEvents();
      }, []);
    
      const fetchEvents = async () => {
        try {
          setLoading(true);
          setError("");
          
          const res = await getUserAllJoinedEvent();
          console.log("Fetched events:", res);
    
          if (Array.isArray(res)) {
            setEvents(res);
          } else {
            setError("Invalid response format");
          }
        } catch (error: any) {
          console.error("Failed to fetch events:", error);
          setError(error?.response?.data?.msg || "Failed to load events. Please try again.");
        } finally {
          setLoading(false);
        }
      };

  

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
        {userStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>My Upcoming Events</span>
              <Button size="sm" variant="ghost">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>

          {loading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
          )}

            {events.length === 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Calendar className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-sm text-gray-500 text-center py-8">
              No upcoming events. Browse events to register!
            </p>
        </div>
      </div>
              
            )}

              {events.map((event : eventI) => (
          <Card
            key={event.id}
            className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
          >
            <CardContent className="p-0 flex flex-col  ">
              

              {/* Event Details */}
              <div className="p-2">
                <h3 className="text-sm font-bold  text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {event.title}
                </h3>

                 {/* Description */}
                {event.description && (
                  <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
                

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="capitalize">{event.event_mode}</span>
                    <span> {event.payment_type === "free" ? "Free" : `₹${event.price}`}</span>
                  </div>

                    

               

                
              </div>
            </CardContent>
          </Card>
        ))}
            
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Browse All Events
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Award className="w-4 h-4 mr-2" />
              Request Organizer Access
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Ticket className="w-4 h-4 mr-2" />
              View My Tickets
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}