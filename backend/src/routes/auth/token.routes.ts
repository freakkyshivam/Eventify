import express from 'express'
import { tokenRefresh } from '../../controllers/auth/token.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = express.Router();

router.get('/token/refresh', authMiddleware, tokenRefresh);

export default router;