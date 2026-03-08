import { type EventFormData } from "@/types/Event";
import React from "react";

 
 export const EventFormDataValidation = (
  data: EventFormData,
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof EventFormData, string>>>
  >
) => {
  const newErrors: Partial<Record<keyof EventFormData, string>> = {};

  if (!data.title.trim()) newErrors.title = "Title is required";
  if (!data.description.trim()) newErrors.description = "Description is required";
  if (!data.start_time) newErrors.start_time = "Start time is required";
  if (!data.end_time) newErrors.end_time = "End time required";
  if (!data.registration_deadline)
    newErrors.registration_deadline = "Registration deadline is required";
  if (!data.event_mode) newErrors.event_mode = "Event mode is required";
  if (!data.event_category) newErrors.event_category = "Event category is required";
  if (!data.payment_type) newErrors.payment_type = "Payment type is required";

  if (data.event_mode === "offline" && !data.location.trim()) {
    newErrors.location = "Location is required for offline events";
  }

  if (data.capacity < 1) {
    newErrors.capacity = "Capacity must be at least 1";
  }

  if (data.payment_type === "paid" && data.price <= 0) {
    newErrors.price = "Price must be greater than 0 for paid events";
  }

  const now = new Date();
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);
  const deadline = new Date(data.registration_deadline);

  if (startTime <= now) {
    newErrors.start_time = "Start time must be in the future";
  }

  if (endTime <= startTime) {
    newErrors.end_time = "End time must be after start time";
  }

  if (deadline >= startTime) {
    newErrors.registration_deadline =
      "Registration deadline must be before start time";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};