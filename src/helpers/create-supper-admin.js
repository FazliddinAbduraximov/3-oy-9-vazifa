import { disconnect } from "mongoose";
import { connectDb } from "../db/index.js";
import adminModel from "../models/admin.model.js";
import cripto from "../utils/Cripto.js";
import config from "../config/index.js";
import { Roles } from "../const/index.js";

(async function () {
    try {
        await connectDb();
        const hashedPassword = await cripto.encrypt(config.SUPERADMIN.PASSWORD);
        await adminModel.create({
            username: config.SUPERADMIN.USERNAME,
            email: config.SUPERADMIN.EMAIL,
            hashedPassword,
            role:Roles.SUPPERADMIN 
        })
        console.log('Super admin success create');
        console.log(hashedPassword);
        await disconnect();
    } catch (error) {
        console.log('Error on creating supperAdmin', error)
        await disconnect();
    }
}())