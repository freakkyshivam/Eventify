import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
import { approveRoleRequest,rejectRoleRequest } from '../../controllers/admin/organizer_request.controller';


const router  = express.Router();

 
router.patch('/organizer-request/:id/approve',authMiddleware, approveRoleRequest);
router.patch('/organizer-request/:id/reject',authMiddleware, rejectRoleRequest);

export default router;