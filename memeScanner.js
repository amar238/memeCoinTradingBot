const redis = require('./redis');
const { fetchMemeCoins } = require('./heliusService');
const logger = require('./logger');

setInterval(async () => {
    const memeCoins = await fetchMemeCoins();
    if (memeCoins.length > 0) {
        logger.info("New Meme Coins Found", memeCoins);
        redis.set('latestMemeCoins', JSON.stringify(memeCoins), 'EX', 600);
    }
}, 60000);