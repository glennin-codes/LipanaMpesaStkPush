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

app.use('/stk',Payee)
