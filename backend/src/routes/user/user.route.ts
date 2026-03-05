 
import express from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware';
import {change_role_request} from '../../controllers/user/organizerRequest.controller'
import { getAllUserJoinedEvent,getAllTickets } from '../../controllers/user/getEvents&Tickets.controller';
import { getAllPendingPaymentAndEvents } from '../../controllers/user/getPendingPayment.controller';
const router = express.Router();

router.post('/orgainzer-request', authMiddleware, change_role_request)
router.get('/events', authMiddleware, getAllUserJoinedEvent)
router.get('/pending/payment', authMiddleware, getAllPendingPaymentAndEvents);
router.get('/events/tickets', authMiddleware, getAllTickets);

export default router;