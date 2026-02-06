import express from 'express'
import { googleRedirect,googleAuth } from '../../controllers/auth/google.auth.controller';

const router = express.Router();

router.get("/google",googleRedirect)
router.get('/google/callback',googleAuth)


export default router;