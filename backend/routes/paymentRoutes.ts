import  express  from "express";
import { createOrder } from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/authMiddleware";
const paymentRouter = express.Router();

paymentRouter.post('/order',authMiddleware, createOrder);
export default paymentRouter;