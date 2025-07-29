import redisClient from "../db/redis-client.js";



class Redis{
    async setData(key,value,time=300){
        return redisClient.set(key,value,{
            EX:time
        })
    }

    async getData(key){
        return redisClient.get(key);
    }


    async deleteData(key){
        return redisClient.del(key);
    }
}
export default new Redis();