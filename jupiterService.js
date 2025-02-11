const axios = require('axios');
const logger = require('./logger');

exports.getBestTrade = async (inputMint, outputMint, amount) => {
    try {
        const url = `${process.env.JUPITER_API_URL}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
        const response = await axios.get(url);
        logger.info("Trade route found via Jupiter");
        return response.data;
    } catch (error) {
        logger.error("Error fetching trade route:", error);
        return null;
    }
};
