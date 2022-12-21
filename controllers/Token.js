const  axios =require("axios") ;
require("dotenv").config();
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
    CallBackURL: "https://fdda-154-122-161-9.eu.ngrok.io/callback",
    AccountReference: `254${phone}`,
    TransactionDesc: "fee payment",
  }
  await axios
  .post(Url,Data,{      
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((data) => {
    console.log(data.data);
    res.status(200).json(data.data);
  }) .catch((err) => {
    console.log(err);
    res.status(400).json(err.message);
  });
}


module.exports={CreateToken ,stkPush}