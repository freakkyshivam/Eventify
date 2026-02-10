export interface eventI {
  id: string;
  title: string;
  description: string;
  bannerUrls: string[];

  start_time: string;
  end_time: string;
  registration_deadline: string;

  location?: string;
  event_mode: "online" | "offline";

  capacity: number;

  event_category:
    | "conference"
    | "webinar"
    | "workshop"
    | "competition"
    | "technology"
    | "coding"
    | "other";

  payment_type: "paid" | "free";
  price: number;

  event_status: "upcoming" | "cancelled";

  authorId: string;

  createdAt: string;
  updatedAt: string;
}


export interface EventApiResponse {
  success: boolean;
  result: eventI[];
}