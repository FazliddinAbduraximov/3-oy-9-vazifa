import config from "../config/index.js";
import { createTransport } from "nodemailer";
export const sendOTPToMail=(mail,otp)=>{
    console.log()
    const transporter=createTransport({
        port:config.MAIL.PORT,
        host:config.MAIL.HOST,
        auth:{
            user:config.MAIL.USER,
            pass:config.MAIL.PASS
        },
        secure:true
    })
    const mailOptions={
        from:config.MAIL.USER,
        to:mail,
        subject:'Online kurs',
        text:otp,
    }
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            console.log(info)
        }
    })
}