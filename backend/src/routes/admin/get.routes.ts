import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
 import { getAllUsersAD,getAllOrganizerRequest, getAllReg } from '../../controllers/admin/getAllUsers.controller';


const router  = express.Router();

 router.get('/users', authMiddleware, getAllUsersAD)
 router.get('/organizer-request', authMiddleware, getAllOrganizerRequest)
 router.get('/events/registration', authMiddleware, getAllReg)

export default router;