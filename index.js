const express = require('express');
require('dotenv').config();
const Redis = require('ioredis');
const app = express();

const port =  process.env.PORT;
const tradeController = require('./tradeController');

const memeRoutes = require('./memeRoutes');
app.use('/memes', memeRoutes);
const redis = new Redis();
const db = require('./mongoose');//db connection

app.listen(port,(err)=>{
    if(err){
        console.log(`Error in running server: ${err}`);
        
    }
    console.log("server is running on port "+port);
});

