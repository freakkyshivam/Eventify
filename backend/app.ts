import express from "express";
import 'dotenv/config'
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import authRouter from "./src/routes/authRoutes";
import eventRouter from "./src/routes/eventRoutes";
import paymentRouter from "./src/routes/paymentRoutes";
import userRouter from "./src/routes/userRoutes";
import adminRouter from "./src/routes/adminRoutes";
const app = express();

const allowedOrigins = [
    'http://localhost:5473',
    'http://127.0.0.1:3001'
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
app.use('/api/event',eventRouter)
app.use('/api/user', userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/payment',paymentRouter);

export default app;
