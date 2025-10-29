 
import { log } from "console";
import app from "./app";
 import connectDb from "./config/db";
 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EventManagement";

connectDb()
.then(()=> 
  app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
}))
.catch(()=>{
  console.log("Error to connect Database and server");
  
})



