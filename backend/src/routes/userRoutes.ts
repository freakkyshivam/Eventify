import express from 'express'
import { updateName,updateUserName,updatePassword,profileImage} from '../controllers/student.controller'
import { authMiddleware } from '../middlewares/authMiddleware';
import { updateNameLimiter, updatePasswordLimiter, updateUserNameLimiter } from '../middlewares/rateLimiter';
import { upload } from '../middlewares/multer';
const userRouter = express.Router()

 
userRouter.post('/update-name',updateNameLimiter, authMiddleware,updateName);
userRouter.post('/update-username',updateUserNameLimiter, authMiddleware,updateUserName);
userRouter.post('/update-password',updatePasswordLimiter, authMiddleware,updatePassword);
userRouter.post('/avtar',authMiddleware,upload.single('avtar'),profileImage)

export default userRouter