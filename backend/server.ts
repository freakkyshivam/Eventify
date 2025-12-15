 import app from "./app";
 
 const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/EventManagement";

 
  app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
})



