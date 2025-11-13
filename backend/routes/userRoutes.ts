import express from 'express'
import { register,login,logout,googleAuth,googleRedirect,userInfo,updateName,updateUserName,updatePassword, passwordResetOtp, verifyResetOtpAndUpdatePassword } from "../controllers/userControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
import { loginLimiter, otpLimiter, resetPasswordLimiter, updateNameLimiter, updatePasswordLimiter, updateUserNameLimiter } from '../middlewares/rateLimiter';
const router = express.Router();

router.post('/register', register)
router.post('/login',loginLimiter, login)
router.post('/logout', logout)
router.get("/google",googleRedirect)
router.get('/google/callback',googleAuth)
router.get('/user',authMiddleware, userInfo)
router.post('/update-name',updateNameLimiter, authMiddleware,updateName);
router.post('/update-username',updateUserNameLimiter, authMiddleware,updateUserName);
router.post('/update-password',updatePasswordLimiter, authMiddleware,updatePassword);
router.post('/send-reset-otp',otpLimiter, passwordResetOtp);
router.post('/reset-password',resetPasswordLimiter, verifyResetOtpAndUpdatePassword)
export default router