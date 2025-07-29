import { required, string } from "joi";
import {Schema,model} from "mongoose";
import { Roles } from "../const/index.js";

const sallerSchema=new Schema({
    phoneNumber:{type:String,unique:true,required:true},
    fullName:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    hashedPassword:{type:String,required:true},
    is_active:{type:Boolean,default:true},
    image:{type:String},
    adress:{type:String},
    role:{type:String,default:Roles.SALLER}
},{
    timestamps:true,
    versionKey:false
})

export default model('saller',sallerSchema);