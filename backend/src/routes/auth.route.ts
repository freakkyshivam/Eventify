import express from 'express'
import { register,login,logout,  passwordResetOtp, verifyResetOtpAndUpdatePassword } from "../controllers/auth.controller";
import { authMiddleware } from '../middlewares/authMiddleware';
import { loginLimiter, otpLimiter, resetPasswordLimiter,} from '../middlewares/rateLimiter';
import { userInfo } from '../controllers/auth.controller';
const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login',loginLimiter, login)
authRouter.post('/logout', logout)
// authRouter.get("/google",googleRedirect)
// authRouter.get('/google/callback',googleAuth)
authRouter.post('/send-reset-otp',otpLimiter, passwordResetOtp);
authRouter.post('/reset-password',resetPasswordLimiter, verifyResetOtpAndUpdatePassword)

authRouter.get("/me", authMiddleware, userInfo)
export default authRouter