const express = require('express');
require('dotenv').config();
const Redis = require('ioredis');
const app = express();
const {fetchMemeCoins, getRecentTokenMints} = require('./services/heliusService');
const port =  process.env.PORT;
const tradeController = require('./controllers/tradeController');

const memeRoutes = require('./memeRoutes');
app.use('/memes', memeRoutes);
const redis = new Redis();
const db = require('./config/mongoose');//db connection


setInterval(async () => {
    const coins = await getRecentTokenMints();
    console.log("New Meme Coins:", coins);
}, 6000);

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

