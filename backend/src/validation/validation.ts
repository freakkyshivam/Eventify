import { z } from "zod";

const baseEventSchema = z.object({
  title: z.string().min(3).max(100),

  description: z.string().min(10),

  start_time: z.string().datetime(),

  end_time: z.string().datetime(),

  registration_deadline: z.string().datetime(),

  location: z.string().min(3).optional().or(z.literal("")),

  event_mode: z.enum(["online", "offline"]),

  capacity: z.coerce.number().int().positive(),

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

  price: z.coerce.number().nonnegative(),
});

export const eventsValidation = baseEventSchema
  .refine(data => {
    return new Date(data.end_time) > new Date(data.start_time);
  }, {
    message: "End time must be after start time",
    path: ["end_time"],
  })
  .refine(data => {
    if (data.payment_type === "free") {
      return data.price === 0;
    }
    return data.price > 0;
  }, {
    message: "Invalid price for selected payment type",
    path: ["price"],
  });

export const updateEventValidation = baseEventSchema
  .partial()
  .refine(data => {
    if (data.start_time && data.end_time) {
      return new Date(data.end_time) > new Date(data.start_time);
    }
    return true;
  }, {
    message: "End time must be after start time",
    path: ["end_time"],
  })
  .refine(data => {
    if (data.payment_type && data.price !== undefined) {
      if (data.payment_type === "free") {
        return data.price === 0;
      }
      return data.price > 0;
    }
    return true;
  }, {
    message: "Invalid price for selected payment type",
    path: ["price"],
  });

 
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


 