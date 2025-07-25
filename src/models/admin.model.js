import {Schema,model} from "mongoose";

const adminSchema=new Schema({
    username:{type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    hashedPassword:{type:String,required:true},
    is_active:{type:Boolean,default:true},
    role:{type:String,enum:['SUPPERADMIN',"ADMIN"],default:'ADMIN'}
},{
    timestamps:true,
    versionKey:false
})

export default model('admin',adminSchema);