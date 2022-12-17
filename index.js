const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.send(`<h2>testing succesful...<h2>`);
});
app.listen(Port, () => {
  console.log(`app is listening on port :${Port}`);
});
//middlware function to generate tokens
const generateToken= async(req,res,next)=>
//getting the  auth ..by encoding both sonsumer key and 
{
    await axios.get("",{
        headers:{
            authorization:`Basic ${auth}`
        }
    })
}
app.post("/stk", async (req, res) => {
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  res.json({ phone, amount });
//timestamp
const date=new Date();
const timeStamp=date.getFullYear()+
("0" + (date.getMonth() +1)).slice(-2) +
("0" + (date.getDate() +1)).slice(-2) +
("0" + (date.getHours() +1)).slice(-2) +
("0" + (date.getMinutes() +1)).slice(-2) +
("0" + (date.getSeconds() +1)).slice(-2) ;

const shortCode=process.env.MPESA_PAYBILL
const passKey=process.env.MPESA_PASSKEY

//(The base64 string is a combination of Shortcode+Passkey+Timestamp)
const password=new Buffer.from(shortCode + passKey +timeStamp).toString('base64');


  await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode:shortCode,
      Password:
        password,
      Timestamp: timeStamp ,
      TransactionType: "CustomerPayBillOnline",//"CustomerBuyGoodsOnline"
      Amount:amount,
      PartyA: `254${phone}`,
      PartyB: shortCode,
      PhoneNumber: "254708374149",
      CallBackURL: "https://mydomain.com/pat",
      AccountReference: "Test",
      TransactionDesc: "Test",
    },{
        headers:`Bearer ${  token}`
    }
  ).then((data)=>{
    console.log(data);
    res.status(200).json(data)
  }).catch((err)=>{
    console.log(err.message);
    res.status(400).json(err.message)
  })
});
