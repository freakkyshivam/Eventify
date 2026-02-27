import api from "@/services/axiosInstance";
import { loadRazorpay } from "@/services/loadRazorpay";
import type React from "react";

export const handleJoin = async (eventId: string,   eventTitle: string, setProcessingEventId:React.SetStateAction) => {
    try {
      setProcessingEventId(eventId);

      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Create order
      const { data: order } = await api.post(
        `/api/events/${eventId}`,
        {},
        { withCredentials: true }
      );

      if (!order || !order.order_id) {
        alert("Failed to create order. Please try again.");
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
        
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.post(
              `/api/payment/verify`,
              {
                eventId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            // Success
            alert("Payment successful! Registration confirmed.");
            // Optionally redirect to ticket page or refresh events
          } catch (verifyError: any) {
            console.error("Payment verification failed:", verifyError);
            alert("Payment verification failed. Please contact support.");
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
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setProcessingEventId(null);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Join event error:", error);
      alert(error?.response?.data?.msg || "Failed to process registration. Please try again.");
      setProcessingEventId(null);
    }
  };