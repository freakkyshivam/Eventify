 import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { type eventI } from "@/types/Event";
import { getAllEvent,loadRazorpay } from "@/api/axiosInstance";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_DEV_URL;
const Events = () => {

const [events, setEvents] = useState<eventI[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchEvent = async () => {
    try {
       
      const res = await getAllEvent();
      console.log(res);
      
if (Array.isArray(res)) {
  setEvents(res)
}

    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, []);

if (loading) return <p>Loading events...</p>;

const handleJoin = async (eventId: string) => {
  try {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const { data: order } = await axios.post(
      `${BASE_URL}/api/events/${eventId}`,
      {},
      { withCredentials: true }
    );

    const options = {
      key: order.key,
      amount: order.amount,
      currency: "INR",
      order_id: order.order_id,
      name: "Join event payment",
      description: "Event Registration Payment",

      handler: async function (response: any) {
        await axios.post(
          `${BASE_URL}/api/payment/verify`,
          {
            eventId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          },
          { withCredentials: true }
        );
      },
    };

    // 🔥 THIS WAS MISSING
    const rzp = new (window as any).Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error(error);
  }
};



  return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Upcoming Events</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {events?.map((event) => (
            <Card key={event.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                <h3 className="text-xl font-semibold mb-2 text-black">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.event_mode} · {event.payment_type}</p>
                <div className="flex max-w-fit justify-between gap-4">
                  <Button className="w-fit bg-black text-white hover:bg-gray-800">View Details</Button>
                
                  <Button className="w-fit bg-black text-white hover:bg-gray-800"
                  onClick={()=>handleJoin(event.id)}
                  >Join now  ₹{event.price}</Button>
               
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  )
}

export default Events