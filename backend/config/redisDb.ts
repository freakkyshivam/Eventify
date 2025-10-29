import Redis from "ioredis";

export const connectRedis = async ()=>{

try {
     const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
});
await redis.ping();
console.log("Redis DB connected sucessfully");
} catch (error) {
    console.log("Error to connect redis DB ", error);
    
}

}