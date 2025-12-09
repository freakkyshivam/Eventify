import * as z from "zod";

const identifierValidation = z
  .string()
  .trim()
  .min(1, { message: "Email or username is required" })
  .refine((value) => {
    const isEmail = z.string().email().safeParse(value).success;
    const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value);
    return isEmail || isUsername;
  }, {
    message: "Enter a valid email or username",
  });

export const loginValidation = z.object({
  identifiers: identifierValidation,
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
});
