export interface IUser {
  name: string;
  id: string;
  role: "admin" | "organizer" | "attendee";
}

export interface JwtUserPayload {
  id: string;
  name: string;
   role: "admin" | "organizer" | "attendee";
}