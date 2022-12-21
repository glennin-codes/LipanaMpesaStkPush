const express = require("express");
const Routes=express.Router();
const {CreateToken}= require('../controllers/Token').default
Routes.get('/',CreateToken)


module.exports=Routes