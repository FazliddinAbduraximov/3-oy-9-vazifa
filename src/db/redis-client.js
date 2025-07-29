import { createClient } from "redis";
import config from "../config/index.js";


const redisClient=createClient({
    socket:{
        host:config.REDIS.HOST,
        port:config.REDIS.PORT
    },
    password:config.REDIS.PASS
});
redisClient.on('error',(err)=>console.log("Error connecting to redis",err));
await redisClient.connect();


export default redisClient;