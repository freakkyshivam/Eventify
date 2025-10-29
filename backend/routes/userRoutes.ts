import express from 'express'
import { register,login,logout,googleAuth,googleRedirect,userInfo,updateName,updateUserName,updatePassword, passwordResetOtp, verifyResetOtpAndUpdatePassword } from "../controllers/userControllers";
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get("/google",googleRedirect)
router.get('/google/callback',googleAuth)
router.get('/user',authMiddleware, userInfo)
router.post('/update-name',authMiddleware,updateName);
router.post('/update-username',authMiddleware,updateUserName);
router.post('/update-password',authMiddleware,updatePassword);
router.post('/send-reset-otp',passwordResetOtp);
router.post('/reset-password',verifyResetOtpAndUpdatePassword)
export default router