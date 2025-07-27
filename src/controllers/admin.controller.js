import adminModel from "../models/admin.model.js";
import { BaseController } from './base.controller.js';
import cripto from "../utils/Cripto.js";
import validator from '../validation/AdminValidation.js'
import config from '../config/index.js';
import token from '../utils/Token.js';
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-res.js";


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

}


export default new AdminController;



