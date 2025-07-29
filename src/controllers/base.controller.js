import { isValidObjectId } from "mongoose";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-res.js";


export class BaseController {
    constructor(model) {
        this.modle = model;
    }
    create = async (req, res, next) => {
        try {
            const data = await this.modle.create(req.body);
            successRes(res,data,201)
        } catch (error) {
            next(error);
        }
    }

    findAll = async (req, res, next) => {
        try {
            const data = await this.modle.find();
            successRes(res,data)
        } catch (error) {
            next(error);
        }
    }
    findById = async (req, res, next) => {
        try {
            const id = req.params?.id;
            const data=await this.checById(id)
            return successRes(res,data);
        } catch (error) {
            next(error);
        }
    }

    update = async (req, res, next) => {
        try {
            const id = req.params?.id;
            await this.checById(id);
            const data = await this.modle.findByIdAndUpdate(id, req.body, { new: true });
            if (!data) {
                throw new AppError('Not found');
            }
            return successRes(res,data);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = req.params?.id;
            await this.checById(id);
            const data = await this.modle.findByIdAndDelete(id);
            if (!data) {
                throw new AppError('Not found');
            }
            return successRes(res,data);
        } catch (error) {
            next(error);
        }
    }

    checById=async (id)=>{
        if(!isValidObjectId(id)){
            throw new AppError('invalid objectId')
        }
        const data=await this.modle.findById(id);
        if(!data){
            throw new AppError('Not found',404)
        }
        return data
    }

    static async checByIdPas(schmea, id){
        if(!isValidObjectId(id)){
            throw new AppError('invalid objectId',400)
        }
        const data=await schmea.findById(id);
        if(!data){
            throw new AppError('Not found',404)
        }
        return data
    }
}
