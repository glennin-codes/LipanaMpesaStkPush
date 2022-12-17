const mongoose =require('mongoose')
const PaymentSchema=new mongoose.Schema({
    number:{
        type:String,
        required:true
    },
    trnx_id:{
        type:String,
        required:true}
    
},{timestamps:true}
);
const PaymentModule=mongoose.model("PaymentSlips",PaymentSchema);
module.exports=PaymentModule;
