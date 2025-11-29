import express from 'express'
import { register,login,logout,googleAuth,googleRedirect, passwordResetOtp, verifyResetOtpAndUpdatePassword } from "../controllers/authControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { loginLimiter, otpLimiter, resetPasswordLimiter,} from '../middlewares/rateLimiter';
const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login',loginLimiter, login)
authRouter.post('/logout', logout)
authRouter.get("/google",googleRedirect)
authRouter.get('/google/callback',googleAuth)
authRouter.post('/send-reset-otp',otpLimiter, passwordResetOtp);
authRouter.post('/reset-password',resetPasswordLimiter, verifyResetOtpAndUpdatePassword)
export default authRouter