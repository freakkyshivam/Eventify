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

export interface eventI extends EventFormData {
  id : string
  slug : string
}
export interface UserEventApiResponse {
  success: boolean;
  results: {
    upcomingEvents: eventI[],
    completedEvents : eventI[],
    totalEvents : eventI[]
    
  };
}

export interface EventApiResponse {
  success: boolean;
  results: eventI[]
}

export interface apiResponse {
  success : boolean,
  results : []
}


interface Payment {
  amount: string;
  status: "completed" | "pending" | "failed";
}

export interface RegistrationI {
  user_name: string;
  email: string;
  event_title: string;
  event_id?: string;
  event_slug?: string;
  registration_date: string;
  registration_status: "registered" | "pending" | "cancelled";
  event_mode?: string;
  event_category?: string;
  bannerUrls?: string[];
  payment: Payment;
}