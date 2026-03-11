import api from "@/services/axiosInstance";
import { loadRazorpay } from "@/services/loadRazorpay";
 
import type React from "react";
import { toast } from "react-toastify";
 

export const handleJoin = async (eventId: string,   eventTitle: string, setProcessingEventId:React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
      setProcessingEventId(eventId);

      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Create order
      const { data: order } = await api.post(
        `/events/${eventId}`,
        {},
        { withCredentials: true }
      );

      if (!order || !order.order_id) {
        toast.error("Failed to create order. Please try again.")
        // alert("Failed to create order. Please try again.");
        return;
      }

      // Razorpay options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        order_id: order.order_id,
        name: "Eventify",
        description: `Registration for ${eventTitle}`,
        image: "/logo.png", // Optional: Add your logo
        
        handler: async function (response: unknown) {
          try {
            // Verify payment
            const res = response as { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; };
            await api.post(
              `/payment/verify`,
              {
                eventId,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_signature: res.razorpay_signature,
              },
              { withCredentials: true }
            );

            // Success
            toast.success("Payment successful! Registration confirmed.");
            // Optionally redirect to ticket page or refresh events
          } catch (verifyError: unknown) {
            console.error("Payment verification failed:", verifyError);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setProcessingEventId(null);
          }
        },

        prefill: {
          name: "", // Can be populated from user context
          email: "",
          contact: "",
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            setProcessingEventId(null);
            console.log("Payment cancelled by user");
          },
        },
      };

      // Open Razorpay
      const rzp = new (window as unknown as { Razorpay: new (options: unknown) => { on: (event: string, callback: (response: unknown) => void) => void; open: () => void; } }).Razorpay(options);
      rzp.on("payment.failed", function (response: unknown) {
        console.error("Payment failed:", (response as { error?: unknown }).error);
        toast.error(`Payment failed: ${(response as { error?: { description?: string } }).error?.description || 'Unknown error'}`);
        setProcessingEventId(null);
      });

      rzp.open();
    } catch (error: unknown) {
      console.error("Join event error:", error);
      toast.error((error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Failed to process registration. Please try again.");
      setProcessingEventId(null);
    }
  };