import express from "express";
import 'dotenv/config'
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import router from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api/auth',router);
app.use('/api/user', eventRouter)

export default app;
