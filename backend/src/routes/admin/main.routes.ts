import express from 'express'
import updateRoleRouter from './update_role.routes'

const router = express.Router();

router.use(updateRoleRouter)

export default router;