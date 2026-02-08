import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
import { approveRoleRequest, updateRole,rejectRoleRequest } from '../../controllers/admin/update_role.controller';


const router  = express.Router();

router.patch('/update-role/:userId', authMiddleware, updateRole)
router.patch('/role-request/:id/approve',authMiddleware, approveRoleRequest);
router.patch('/role-request/:id/reject',authMiddleware, rejectRoleRequest);

export default router;