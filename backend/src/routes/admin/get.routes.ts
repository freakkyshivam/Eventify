import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
 import { getAllUsersAD } from '../../controllers/admin/getAllUsers.controller';


const router  = express.Router();

 router.get('/users', authMiddleware, getAllUsersAD)

export default router;