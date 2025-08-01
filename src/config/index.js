import { config } from 'dotenv';
config();
export default {
    PORT: Number(process.env.PORT),
    Mongo_URL: String(process.env.MONGO_URL),

    SUPERADMIN:{
        USERNAME: String(process.env.SUPERADMIN_USERNAME),
        PASSWORD: String(process.env.SUPERADMIN_PASSWORD),
        EMAIL: String(process.env.SUPERADMIN_EMAIL)
    },

    
    TOKEN:{
        ACCESS_KEY:String(process.env.ACCESS_TOKEN_KEY),
        ACCESS_TIME:String(process.env.ACCESS_TOKEN_TIME),
        REFRESH_KEY:String(process.env.REFRESH_TOKEN_KEY),
        REFRESH_TIME:String(process.env.REFRESH_TOKEN_TIME)
    },

    MAIL:{
        HOST:String(process.env.MAIL_HOST),
        PORT:Number(process.env.MAIL_PORT),
        USER:String(process.env.MAIL_USER),
        PASS:String(process.env.MAIL_PASS)
    },
    REDIS:{
        HOST:String(process.env.REDIS_HOST),
        PORT:Number(process.env.REDIS_PORT),
        PASS:String(process.env.REDIS_PASS)
    },
    CONFIRM_PASSWORD_URL:String(process.env.CONFIRM_PASSWORD_URL)
}