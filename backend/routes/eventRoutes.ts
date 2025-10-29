import express from 'express'
import { createEvent } from '../controllers/eventControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
const eventRouter = express.Router();

 eventRouter.post('/events',authMiddleware, createEvent);
export default  eventRouter