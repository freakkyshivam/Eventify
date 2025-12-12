 import * as z from "zod";

export const loginValidation = z.object({
    email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" }),
});


export const signupValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" }),

  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" }),

  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" }),

    branch: z
    .string("Enter a valid branch")
    .trim().min(3).max(8),
    
  year : z.
  number().min(1).max(4),

  rollNumber : z.
  string().trim().min(10).max(15),

  phone : z.
  string().trim().min(10).max(15)


});


export const CompleteProfileSchema = z.object({
  token: z.string(),
  branch: z.string().min(1),
  year: z.string().min(1),
  rollNumber: z.string().min(1),
  phone: z.string().min(7),
});