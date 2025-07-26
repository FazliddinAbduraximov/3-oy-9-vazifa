import adminModel from "../models/admin.model.js";
import { BaseController } from './base.controller.js';
import cripto from "../utils/Cripto.js";
import validator from '../validation/AdminValidation.js'
import config from '../config/index.js';
import token from '../utils/Token.js';


class AdminController extends BaseController {
    constructor() {
        super(adminModel);
    }

    async createAdmin(req, res) {
        try {
            
            const { username, email, password } = req.body;
            const existsUsername = await adminModel.findOne({ username })
            if (existsUsername) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Username already exists'
                });
            }
            const existsEmail = await adminModel.findOne({ email })
            if (existsEmail) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email adress already exists'
                });
            }
            const hashedPassword = await cripto.encrypt(password);
            const admin = await adminModel.create({
                username,
                email,
                hashedPassword
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: admin
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'intrnal server error'
            });
        }
    }

    async signIn(req, res) {
        try {
            const { username, password } = req.body;
            const admin = await adminModel.findOne({ username });
            const isMatchPassword = await cripto.decrypt(password, admin?.hashedPassword || "Error input validation");
            if (!isMatchPassword) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'User or password incarrect'
                })
            }
            const payload = { id: admin._id, role: admin.role, isActiv: admin.is_active };
            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, 'refreshTokenAdmin', refreshToken, 30);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    accessToken,
                    admin
                }
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'intrnal server error'
            });
        }
    }


    async generateAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token not fount'
                })
            }
            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                })
            }
            const admin = await adminModel.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Forbidden user'
                })
            }

            const paylod = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }
            const accessToken = token.generateAccessToken(paylod);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token: accessToken
                }
            })

        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'intrnal server error'
            });
        }
    }


    async signOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token not found'
                });
            }
            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                });
            }
            const admin = await adminModel.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Forbidden user'
                });
            }
            res.clearCookie('refreshTokenAdmin');
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch(error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message || 'intrnal server error'
        });
    }
}

}


export default new AdminController;



