import rateLimit from "express-rate-limit";

 
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

 
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests. Try later.",
  standardHeaders: true,
  legacyHeaders: false,
});

 
export const resetPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

 
export const updateUserNameLimiter = rateLimit({
  windowMs: 60 * 60 * 1000 * 24 * 7,
  max: 1,
  message: "Too many username updates, Try after one week",
  standardHeaders: true,
  legacyHeaders: false,
});


export const updateNameLimiter = rateLimit({
  windowMs: 60 * 60 * 1000 * 24 * 7,
  max: 5,
  message: "Too many updates. Try after one week.",
  standardHeaders: true,
  legacyHeaders: false,
});

 
export const updatePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password changes.",
  standardHeaders: true,
  legacyHeaders: false,
});
