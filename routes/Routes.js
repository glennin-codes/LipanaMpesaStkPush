const express = require("express");
const router=express.Router();
const {CreateToken, callBac, callBack,stkPush}= require('../controllers/Token')
router.post("/",CreateToken,stkPush)

router.post('/callback',callBack)
module.exports=router