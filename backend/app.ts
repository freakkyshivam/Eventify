import express from "express";
import 'dotenv/config'
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import authRouter from "./src/routes/authRoutes";
import eventRouter from "./src/routes/eventRoutes";
import paymentRouter from "./src/routes/paymentRoutes";
import userRouter from "./src/routes/userRoutes";
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api',eventRouter)
app.use('/api/user', userRouter)
app.use('/api/payment',paymentRouter);

export default app;
