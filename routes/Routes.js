const express = require("express");
const Routes=express.Router();
const {CreateToken, stkpush}= require('../controllers/Token')
Routes.get('/',CreateToken,stkpush)


module.exports=Routes