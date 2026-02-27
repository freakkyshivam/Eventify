import express from 'express'
import { createEvent, updateEvent, } from '../../controllers/event/create&update_event.controller';
import { getAllEvent } from '../../controllers/event/getAllEvent.controller';
import {event_registration} from '../../controllers/event/event_registration.controller'
import { authMiddleware } from '../../middlewares/authMiddleware';
import { upload } from '../../middlewares/multer';

const router = express.Router();

router.post('/',authMiddleware, upload.array('banners',3), createEvent);
router.post('/:eventId',authMiddleware, event_registration);
router.patch('/:eventId',authMiddleware, updateEvent);
router.get('/', getAllEvent)

export default router;