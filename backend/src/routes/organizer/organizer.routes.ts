import express from 'express'

import { getAllEventsOrg,getAllReg , getRegPerEvents} from '../../controllers/organizer/getAllOrganizerEvents.org.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';


const router = express.Router();

router.get('/events', authMiddleware, getAllEventsOrg)
router.get('/events/registration', authMiddleware, getAllReg)
router.get('/events/:slug/registrations', authMiddleware, getRegPerEvents)


export default router;