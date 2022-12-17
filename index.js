const express=require('express');
const cors=require('cors');
const app=express();
const axios = require('axios')
require('dotenv').config();

//middlewares
app.use(cors());
app.use(express.json());
