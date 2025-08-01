import adminModel from "../models/admin.model.js";
import { BaseController } from './base.controller.js';
import cripto from "../utils/Cripto.js";
import validator from '../validation/AdminValidation.js'
import config from '../config/index.js';
import token from '../utils/Token.js';
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-res.js";
import { isValidObjectId } from "mongoose";
import { generateOtp } from "../utils/generate-otp.js";
import {sendOTPToMail} from '../utils/send-mail.js'
import redis from "../utils/Redis.js";




class AdminController extends BaseController {
    constructor() {
        super(adminModel);
    }

    async createAdmin(req, res, next) {
        try {

            const { username, email, password } = req.body;
            const existsUsername = await adminModel.findOne({ username })
            if (existsUsername) {
                throw new AppError('Username already exists', 409)
            }
            const existsEmail = await adminModel.findOne({ email })
            if (existsEmail) {
                throw new AppError('Email adress already exists', 409)
            }
            const hashedPassword = await cripto.encrypt(password);
            const admin = await adminModel.create({
                username,
                email,
                hashedPassword
            });
            successRes(res,admin,201)
        
        } catch (error) {
            next(error)
        }
    }

    async signIn(req, res, next) {
        try {
            const { username, password } = req.body;
            const admin = await adminModel.findOne({ username });
            const isMatchPassword = await cripto.decrypt(password, admin?.hashedPassword || "Error input validation");
            if (!isMatchPassword) {
                throw new AppError('User or password incarrect',400);
            }
            const payload = { id: admin._id, role: admin.role, isActiv: admin.is_active };
            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, 'refreshTokenAdmin', refreshToken, 30);
            successRes(res,{
                    accessToken,
                    admin
                })
            
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    accessToken,
                    admin
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async generateAccessToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Authorization error',401);
            }
            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expire',401);
            }
            const admin = await adminModel.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError('Forbidden user',403);
            }

            const paylod = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }
            const accessToken = token.generateAccessToken(paylod);
            return successRes({token:accessToken})
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Refresh token not found',401);
            }
            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expire',401);
            }
            const admin = await adminModel.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError('Forbidden user',403);
            }
            res.clearCookie('refreshTokenAdmin');
            return successRes(res,{})
        } catch (error) {
            next(error)
        }
    }

    async updateAdmin(req,res,next){
        try {
            const id=req.params?.id;
            const admin =await this.checById(id);
            const {username,email,password}=req.body;
            if(username){
                const exists=await adminModel.findOne({username});
                if(exists && exists.username !== username){
                    throw new AppError('Username already exists',409);
                }
            }
            if(email){
                const exists=await adminModel.findOne({email});
                if(exists && exists.username !== username){
                    throw new AppError('Email adress already exists',409);
                }
            }
            let hashedPassword=admin.hashedPassword;
            if(password){
                hashedPassword=await cripto.encrypt(password);
                delete req.body.password;
            }
            const updatedAdmin=await adminModel.findByIdAndUpdate(id,{...req.body,hashedPassword},{new:true})
            successRes(res,updatedAdmin)
        } catch (error) {
            next(error)
        }
    }

    async updataPasswordForAdmin(req,res,next){
        try {
            const id=req.params?.id;
            const admin=await BaseController.checByIdPas(adminModel,id);
            const {oldPassword,newPassword}=req.body;
            const isMatchPassword=await cripto.decrypt(oldPassword,admin.hashedPassword);
            if(!isMatchPassword){
                throw new AppError('Incorrect old password',400)
            }
            const hashedPassword=await cripto.encrypt(newPassword);
            const updatedAdmin=await adminModel.findByIdAndUpdate(id,hashedPassword,{new:true})
            return successRes(res,updatedAdmin)
        } catch (error) {
            next(error)
        }
    }

    async forgetPassword(req,res,next){
        try {
            const {email}=req.body;
            const admin=await adminModel.findOne({email});
            if(admin){
                throw new AppError('Email not found',404);
            }
            const otp=generateOtp();
            sendOTPToMail(email,otp);
            await redis.setData(email,otp);
            return successRes(res,{
                email,
                otp,
                expireOTP:'5 minutes'
            })
        } catch (error) {
            next(error)
        }
    }

    async confirmOTP(req,res,next){
        try {
            const {email,otp}=req.body;
            const checkOTP=await redis.getData(email);
            if(checkOTP!=otp){
                throw new AppError('OTP incorrect or expired',400)
            }
            await redis.deleteData(email);
            return successRes(res,{
                confirmPasswordURL:config.CONFIRM_PASSWORD_URL,
                requesMethod:"PATCH",
                email
            })
        } catch (error) {
            next(error)
        }
    }


    async confirmPassword(req,res,next){
        try {
            const {email,newPassword}=req.body;
            const admin=await adminModel.findOne({email});
            if(!admin){
                throw new AppError('Emmail adres not found',404);
            }
            const hashedPassword=await cripto.encrypt(newPassword);
            const updatedAdmin=await adminModel.findByIdAndUpdate(admin._id,{hashedPassword},{new:true});
            return successRes(res,updatedAdmin);
        } catch (error) {
            next(error)
        }
    }

}



export default new AdminController;



