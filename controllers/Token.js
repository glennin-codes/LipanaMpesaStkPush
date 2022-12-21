const  axios =require("axios") ;
require("dotenv").config();
const PaymentModule = require('../models/PaymentModel')
const CreateToken=async(req,res,next)=>{
      //getting the  auth ..by encoding both consumer key and consumerSecret
  
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
//AUTH
const auth  = new Buffer.from(`${consumerKey}:${secret}`).toString(
    "base64"
  );

  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { 
        
      headers: {
        authorization: `Basic ${auth}`,
      },
    }).then((data)=>{
        console.log(data.data.access_token);
        token=data.data.access_token
        next();
    }).catch((err)=>{
        console.log(err.message);
    })
     
  };

const stkPush=async(req,res)=>{
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    // res.json({ phone, amount });
    //timestamp
    const date = new Date();
    const timeStamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + (date.getDate() + 1)).slice(-2) +
      ("0" + (date.getHours() + 1)).slice(-2) +
      ("0" + (date.getMinutes() + 1)).slice(-2) +
      ("0" + (date.getSeconds() + 1)).slice(-2);
  
    const shortCode = process.env.MPESA_PAYBILL;
    const passKey = process.env.MPESA_PASSKEY;
    const Url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
  
    //(The base64 string is a combination of Shortcode+Passkey+Timestamp)
    const password = new Buffer.from(shortCode + passKey + timeStamp).toString(
      "base64"
    );
  //stk bodyy
  const Data={
    BusinessShortCode: shortCode,
    Password:password,
    Timestamp: timeStamp,
    TransactionType: "CustomerPayBillOnline", //"CustomerBuyGoodsOnline"
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://fdda-154-122-161-9.eu.ngrok.io/stk/callback",
    AccountReference: `254${phone}`,
    TransactionDesc: "fee payment",
  }
  await axios
  .post(Url,Data,{      
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response.data);
    res.status(200).json(response.data);
  }) .catch((err) => {
    console.log(err);
    res.status(400).json(err.message);
  });
}
const callBack=async(req,res)=>{
   
    const  callbackData =req.body;
    console.log( callbackData);
    if(! callbackData.Body.stkCallback.CallbackMetadata){
        console.log( callbackData.Body.stkCallback.ResultDesc);
       return  res.json( 'ok')
    }
    const phone= callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value
    const amount= callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value
    const trnx_id= callbackData.Body.stkCallback.CallbackMetadata.Item[1].Value
console.log({phone,amount,trnx_id});
  PaymentModule.PhoneNumber= phone
  PaymentModule.amount= amount
  PaymentModule.trnx_id=trnx_id
  PaymentModule.save()
.then((data)=>{
    console.log({message:"Saved Succefully",data}).catch((err)=>{
      console.log(err.message);
    })

})}

module.exports={CreateToken ,stkPush,callBack}