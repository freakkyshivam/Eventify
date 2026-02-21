export type EventFormData = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  location: string;
  event_mode: "online" | "offline" | "";
  capacity: number;
  event_category:
    | "conference"
    | "webinar"
    | "workshop"
    | "competition"
    | "technology"
    | "coding"
    | "other"
    | "";
  payment_type: "free" | "paid" | "";
  price: number;
  bannerUrls: string[];
};


export interface EventApiResponse {
  success: boolean;
  results: {
    upcomingEvents: EventFormData,
    completedEvents : EventFormData,
    
  };
}