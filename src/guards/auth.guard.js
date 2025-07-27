import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import token from "../utils/Token.js";

export const AuthGuard=async (req,res,next)=>{
    try {
        const auth=req?.headers?.authorization;
        if(!auth){
            throw new AppError('Authorizationdagi error',401)
        }
        const bearer=auth.split(' ')[0];
        const authToken=auth.split(' ')[1];
        if(bearer!=='Bearer' || !authToken){
            throw new AppError('Unauthhorized',401)
        }
        const user =token.verifyToken(authToken,config.TOKEN.ACCESS_KEY)
        // console.log("Auth .Guarddan chiqgan token tekshirish natijasi",user);
        req.user=user;
        next();
    } catch (error) {
        next(error);
    }
}