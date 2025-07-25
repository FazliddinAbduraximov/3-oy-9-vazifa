import { isValidObjectId } from "mongoose";


export class BaseController{
    constructor(model){
        this.modle=model;
    }
    create = async (req,res)=>{
        try {
            const data = await this.modle.create(req.body);
            return res.status(201).json({
                statusCode:201,
                message:'success',
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || 'Internal server error'
            });
        }
    }

    findAll=async(req,res)=>{
        try {
            const data= await this.modle.find();
            return res.status(200).json({
                statusCode:200,
                message:'success',
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || 'Internal server error'
            })
        }
    }

    findById=async(req,res)=>{
        try {
            const id=req.params?.id;
            if(!isValidObjectId(id)){
                return res.status(400).json({
                statusCode:400,
                message:'Bad request',
                })
            }
            const data= await this.modle.findById(id);
            if(!data){
                return res.status(404).json({
                statusCode:404,
                message:'not found',
                })
            }
            return res.status(200).json({
                statusCode:200,
                message:'success',
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || 'Internal server error'
            })
        }
    }

    update=async(req,res)=>{
        try {
            const id=req.params?.id;
            if(!isValidObjectId(id)){
                return res.status(400).json({
                statusCode:400,
                message:'Bad request',
                })
            }
            const data= await this.modle.findByIdAndUpdate(id,req.body,{new:true});
            if(!data){
                return res.status(404).json({
                statusCode:404,
                message:'not found',
                })
            }
            return res.status(200).json({
                statusCode:200,
                message:'success',
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || 'Internal server error'
            })
        }
    }

    delete=async(req,res)=>{
        try {
            const id=req.params?.id;
            if(!isValidObjectId(id)){
                return res.status(400).json({
                statusCode:400,
                message:'Bad request',
                })
            }
            const data= await this.modle.findByIdAndDelete(id);
            if(!data){
                return res.status(404).json({
                statusCode:404,
                message:'not found',
                })
            }
            return res.status(200).json({
                statusCode:200,
                message:'success',
                data:{}
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || 'Internal server error'
            })
        }
    }
}