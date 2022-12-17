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
app.post("/stk", async (req, res) => {
  const phone = req.body.phone;
  const amount = req.body.amount;
  res.json({ phone, amount });
  await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: "174379",
      Password:
        "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",
      Timestamp: "20160216165627",
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254708374149",
      PartyB: "174379",
      PhoneNumber: "254708374149",
      CallBackURL: "https://mydomain.com/pat",
      AccountReference: "Test",
      TransactionDesc: "Test",
    }
  );
});
