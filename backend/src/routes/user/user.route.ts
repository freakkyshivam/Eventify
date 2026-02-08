 
import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
import {change_role_request} from '../../controllers/user/change_role.controller'

const router = express.Router();

router.post('/role-request', authMiddleware, change_role_request)


export default router;