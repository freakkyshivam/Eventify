import express from 'express'
import { createEvent, updateEvent } from '../../controllers/event/create&update_event.controller'
import { authMiddleware } from '../../middlewares/authMiddleware';
const router = express.Router();

router.post('/events',authMiddleware, createEvent)
router.patch('/events/:eventId',authMiddleware, updateEvent)

export default router;