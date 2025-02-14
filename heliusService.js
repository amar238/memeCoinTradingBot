require('dotenv').config(); 
const axios = require('axios');
const logger = require('./logger');

exports.fetchMemeCoins = async () => {
    try {

        // Log API request for debugging
        logger.info("Fetching meme coins from Helius API...");

        const response = await axios.post(
            process.env.HELIUS_API_URL, 
            {
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenAccountsByOwner",
                params: [
                    process.env.WALLET_PUBLIC_KEY,
                    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
                    { encoding: "jsonParsed" }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.HELIUS_API_KEY}`  // Add API key here
                }
            }
        );

        if (!response.data || !response.data.result) {
            throw new Error("Invalid response from Helius API");
        }

        logger.info("Meme coins fetched successfully");
        return response.data.result.value || [];
    } catch (error) {
        if (error.response) {
            logger.error(`Error fetching meme coins: ${error.response.status} - ${error.response.data.error.message}`);
        } else {
            logger.error(`Error fetching meme coins: ${error.message}`);
        }
        return [];
    }
};
