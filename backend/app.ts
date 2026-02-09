import express from "express";
import 'dotenv/config'
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import authRouter from "./src/routes/main/auth.routes";
import eventRouter from './src/routes/event/events.route'
import userRouter from './src/routes/user/user.route'
import adminRouter from './src/routes/admin/main.routes';
import paymentRouter from './src/routes/payment/payment.routes'
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    
]

// middlewares
app.use(cors({
    origin : allowedOrigins
}));
app.use(express.json());
app.use(express.urlencoded())
app.use(morgan("dev"));
app.use(cookieParser());

 app.use('/api/auth',authRouter);
 app.use('/api/events',eventRouter);
 app.use('/api/user',userRouter)
 app.use('/api/admin', adminRouter)
 app.use('/api/payment', paymentRouter)
app.get("/",(req,res)=>{
    res.json("Server is running")
})

export default app;
