const express = require("express");
const router=express.Router();
const {CreateToken, stkPush}= require('../controllers/Token')
router.post("/",CreateToken,stkPush)


module.exports=router