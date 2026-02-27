import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
 
import { handleJoin } from "@/api/eventJoin";
import { getAllEvent } from "@/api/eventApi";

import { Calendar, MapPin, Users, Loader2, AlertCircle } from "lucide-react";
import type { eventI } from "@/types/Event";

 

const Events = () => {
  const [events, setEvents] = useState<eventI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await getAllEvent();
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

  

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchEvents} className="bg-black text-white hover:bg-gray-800">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Calendar className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
          <p className="text-gray-500">Check back later for upcoming events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2 text-gray-900">Upcoming Events</h2>
        <p className="text-gray-600">Discover and join amazing events near you</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Card
            key={event.id}
            className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
          >
            <CardContent className="p-0">
              {/* Event Image Placeholder */}
              <div className="bg-linear-to-br from-purple-100 to-pink-100 h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                {event?.bannerUrls.map((file : string)=>(
                  <img src={file} alt="" />
                ))}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.payment_type === "free" ? "Free" : `₹${event.price}`}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {event.title}
                </h3>

                {/* Event Meta */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.registration_deadline).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="capitalize">{event.event_mode}</span>
                  </div>

                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.capacity} spots available</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    View Details
                  </Button>

                  <Button
                    onClick={() => handleJoin(event.id, event.title,setProcessingEventId)}
                    disabled={processingEventId === event.id}
                    className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processingEventId === event.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {event.payment_type === "free" ? "Join Free" : `Join ₹${event.price}`}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;