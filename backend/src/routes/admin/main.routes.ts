import express from 'express'
import updateRoleRouter from './update_role.routes'
import organizerRequestRouter from './organizer_request.routes';
import getRouter from './get.routes'

const router = express.Router();

router.use(updateRoleRouter)
router.use(organizerRequestRouter);
router.use(getRouter)

export default router;