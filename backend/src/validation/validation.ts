import { z } from "zod";

export const eventsValidation = z.object({
  title: z.string().min(3).max(100),

  description: z.string().min(10),

  start_time: z.string().datetime(),

  end_time: z.string().datetime(),

  registration_deadline: z.string().datetime(),

  location: z.string().min(3),

  event_mode: z.enum(["online", "offline"]),

  capacity: z.number().int().positive(),

  event_category: z.enum([
  "conference",
  "webinar",
  "workshop",
  "competition",
  "technology",
  "coding",
  "other",
]),

  payment_type: z.enum(["free", "paid"]),

  price: z.number().nonnegative(),
})
.refine(data => data.end_time > data.start_time, {
  message: "End time must be after start time",
  path: ["end_time"],
})
.refine(data => data.payment_type === "free" || data.price > 0, {
  message: "Price must be greater than 0 for paid events",
  path: ["price"],
});

export const updateEventValidation = eventsValidation.partial()

 
export const updateNameValidation = z.object({
  updatedName : z.string().nonempty().min(5).max(255)
});

export const updateusernameValidation = z.object({
  updatedUsername : z.string().nonempty().trim().min(5).max(255)
})

export const magicLinkValidation = z.object({
  email : z.
  string()
  .trim()
  .email({message: "Enter valid email address"}),
})


 