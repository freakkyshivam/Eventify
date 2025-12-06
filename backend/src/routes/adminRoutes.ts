import express from "express"
import { allUsers, createEvent } from '../controllers/adminController';
import {upload} from "../middlewares/multer"
import { authMiddleware } from '../middlewares/authMiddleware';
const adminRouter = express.Router();

adminRouter.post('/create-event',authMiddleware,upload.array("banner", 5), createEvent);
adminRouter.get('/users' , authMiddleware,allUsers);

export default adminRouter