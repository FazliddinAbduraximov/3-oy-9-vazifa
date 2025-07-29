import {Schema,model} from "mongoose";
import { Roles } from "../const/index.js";

const adminSchema=new Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    hashedPassword:{type:String,required:true},
    is_active:{type:Boolean,default:true},
    role:{type:String,enum:[Roles.SUPPERADMIN,Roles.ADMIN],default:Roles.ADMIN}
},{
    timestamps:true,
    versionKey:false
})

export default model('admin',adminSchema);