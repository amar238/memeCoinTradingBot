const express = require('express');
require('dotenv').config();
const Redis = require('ioredis');
const app = express();
const {fetchMemeCoins} = require('./heliusService');
const port =  process.env.PORT;
const tradeController = require('./tradeController');

const memeRoutes = require('./memeRoutes');
app.use('/memes', memeRoutes);
const redis = new Redis();
const db = require('./mongoose');//db connection


setInterval(async () => {
    const coins = await fetchMemeCoins();
    console.log("Fetched Meme Coins:", coins);
}, 6000);


app.listen(port,(err)=>{
    if(err){
        console.log(`Error in running server: ${err}`);
        
    }
    console.log("server is running on port "+port);
});

