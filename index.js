const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
const PaymentModule = require("./models/PaymentModel");
const Payee= require("./routes/Routes");
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = 5000;



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



    
  

app.post('/callback',(req,res)=>{
   
    const callBackData=req.body
    console.log(callBackData);
//     if(!callBackData.Body.stkcallback.CallbackMetadata){
//         console.log(callBackData.Body.stkCallback.ResultDesc);
//        return  res.json(callBackData.Body.stkCallback.ResultDesc)
//     }
//     const phone=callBackData.Body.stkCallback.CallbackMetadata.Item[4].Value
//     const amount=callBackData.Body.stkCallback.CallbackMetadata.Item[0].Value
//     const trnx_id=callBackData.Body.stkCallback.CallbackMetadata.Item[1].Value
// console.log({phone,amount,trnx_id});
//   PaymentModule.PhoneNumber= phone
//   PaymentModule.amount= amount
//   PaymentModule.trnx_id=trnx_id
//   PaymentModule.save()
// .then((data)=>{
//     console.log({message:"Saved Succefully",data}).catch((err)=>{
//       console.log(err.message);
//     })
//   })
})
app.use('/stk',Payee)