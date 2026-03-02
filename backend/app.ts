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
import { authMiddleware } from "./src/middlewares/authMiddleware";
import { findUserById } from "./src/services/user/user.service";
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    
]

// middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Headers"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

 app.use('/api/auth',authRouter);
 app.use('/api/events',eventRouter);
 app.use('/api/user',userRouter)
 app.use('/api/admin', adminRouter)
 app.use('/api/payment', paymentRouter)

 app.get("/api/me", authMiddleware, async (req, res) => {

   try {
     const user = req.user;

    if(!user?.id){
        return res.status(404).json({
            success : false,
            msg : "Unauthorized"
        })
    }
    const {access_token } = req.cookies;

    const data = await findUserById(user.id);

  res.json({
    user : {
        id : data?.id,
        name : data?.name,
        email : data?.email,
        role : data?.role,
        isAccountVerified : data?.isAccountVerified,
        profileImage : data?.profileImageUrl,
        organizer_request : data?.organizer_request
    },
    access_token
  });
   } catch (error) {
    console.error(error)
   }
});




app.get("/",(req,res)=>{
    res.json("Server is running")
})

export default app;
