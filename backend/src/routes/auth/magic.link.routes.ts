import express from 'express'
import { magicLink, verifyMagicLink } from '../../controllers/auth/magicLink.controller';

const router = express.Router();

router.post('/magiclink',magicLink);
router.get('/verify', verifyMagicLink)

export default router