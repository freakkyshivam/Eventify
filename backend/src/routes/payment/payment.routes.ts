import express from 'express'
import { verifyRazorpaySignature } from '../../middlewares/verifyPaymentSignature';
import { confirmPayment } from '../../controllers/payment/confirm_payment.controller';

const router  = express.Router();

router.post('/verify',verifyRazorpaySignature, confirmPayment);

export default router;