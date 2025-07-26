import config from "../config/index.js";
import token from "../utils/Token.js";

export const AuthGuard=async (req,res,next)=>{
    try {
        const auth=req?.headers?.authorization;
        if(!auth){
            return res.status(401).json({
                statusCode:401,
                message:'Authorizationdagi error'
            })
        }
        const bearer=auth.split(' ')[0];
        const authToken=auth.split(' ')[1];
        if(bearer!=='Bearer' || !authToken){
            return res.status(401).json({
                statusCode:401,
                message:'Unauthhorized'
            })
        }
        const user =token.verifyToken(authToken,config.TOKEN.ACCESS_KEY)
        // console.log("Auth .Guarddan chiqgan token tekshirish natijasi",user);
        req.user=user;
        next();
    } catch (error) {
        return res.status(500).json({
            statusCode:500,
            message:error.message || 'Internal server error'
        })
    }
}