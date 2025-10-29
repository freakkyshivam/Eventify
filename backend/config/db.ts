 import mongoose from "mongoose";

 const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EventManagement";

 const connectDb = async ()=>{
    mongoose.connect(MONGO_URI)
.then(()=>{
  console.log("✅ Mongodb connented successfully");
})
.catch(err => console.error("MongoDB connection error ❌", err));
 }

 export default connectDb