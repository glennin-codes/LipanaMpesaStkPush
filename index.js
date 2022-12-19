const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const { response } = require("express");
const mongoose = require('mongoose');
const PaymentModule = require("./models/PaymentModel");
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('connected to Db succefull');
}).catch((err)=>{
    console.error(err.message);
})

app.get("/test", (req, res) => {
  res.send(`<h2>testing succesful...<h2>`);
});
app.listen(Port, () => {
  console.log(`app is listening on port :${Port}`);
});
//middlware function to generate token
const generateToken = async (req, res, next) =>
  //getting the  auth ..by encoding both consumer key and consumerSecret
  {
    const secret = process.env.MPESA_SECRET;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
//AUTH
const auth  = new Buffer.from(`${consumerKey}:${secret }`).toString(
    "base64"
  );

    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { 
        
      headers: {
        authorization: `Basic ${auth}`,
      },
    }).then((response)=>{
        token=response.data.access_token
        next()
    }).catch((err)=>{
        console.log(err.message);
    })
  };
  //processing api request
app.post("/stk", async (req, res) => {
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  res.json({ phone, amount });
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

  //(The base64 string is a combination of Shortcode+Passkey+Timestamp)
  const password = new Buffer.from(shortCode + passKey + timeStamp).toString(
    "base64"
  );

  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: "CustomerPayBillOnline", //"CustomerBuyGoodsOnline"
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: shortCode,
        PhoneNumber: "254708374149",
        CallBackURL: " https://2b28-154-122-138-177.eu.ngrok.io/callback",
        AccountReference: `254${phone}`,
        TransactionDesc: "fee payment recieved",
      },
      {
        headers: `Bearer ${token}`,
      }
    )
    .then((data) => {
      console.log(data.data);
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).json(err.message);
    });
});

app.post('/callback',(req,res)=>{
   
    const callBackData=req.body
    if(!callBackData.Body.stkCallback.CallbackMetadata){
        console.log(callBackData.Body.stkCallback.ResultDesc);
       return  res.json(callBackData.Body.stkCallback.ResultDesc)
    }
    const phone=callBackData.Body.stkCallback.CallbackMetadata.Item[4].Value
    const amount=callBackData.Body.stkCallback.CallbackMetadata.Item[0].Value
    const trnx_id=callBackData.Body.stkCallback.CallbackMetadata.Item[1].Value
console.log({phone,amount,trnx_id});
  PaymentModule.PhoneNumber= phone
  PaymentModule.amount= amount
  PaymentModule.trnx_id=trnx_id
  PaymentModule.save().then((data)=>{
    console.log({message:"Saved Succefully",data}).catch((err)=>{
      console.log(err.message);
    })
  })
})
