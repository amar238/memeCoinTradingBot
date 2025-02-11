const axios = require('axios');
const logger = require('./logger');

exports.fetchMemeCoins = async () => {
    try {
        const response = await axios.post(process.env.HELIUS_API_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
                process.env.WALLET_PUBLIC_KEY,
                { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
                { encoding: "jsonParsed" }
            ]
        });

        logger.info("Meme coins fetched successfully");
        return response.data.result.value || [];
    } catch (error) {
        logger.error("Error fetching meme coins:", error);
        return [];
    }
};
