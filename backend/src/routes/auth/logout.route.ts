import express from 'express'
import { logout } from "../../controllers/auth/logout.controller";
 

const router  = express.Router();

router.get('/logout', logout);

export default router;