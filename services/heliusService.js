require('dotenv').config(); 
const axios = require('axios');
const logger = require('../utils/logger');

const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"; // SPL Token Program
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

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
                    { programId: TOKEN_PROGRAM },
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

// ✅ Fetch recent token mints
exports.getRecentTokenMints = async () => {
    try {
        logger.info("Fetching recent token mints...");

        // Fetch latest transactions for the SPL Token Program
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getSignaturesForAddress",
            params: [TOKEN_PROGRAM, { limit: 10 }]
        });

        const signatures = response.data.result.map(tx => tx.signature);
        logger.info(`Found ${signatures.length} recent transactions`);

        // Process each mint transaction
        for (const signature of signatures) {
            await getTransactionDetails(signature);
        }
    } catch (error) {
        logger.error("Error fetching token mints:", error.message);
    }
};

// ✅ Fetch and filter transaction details
async function getTransactionDetails(signature) {
    try {
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: [signature, { encoding: "jsonParsed" }]
        });

        const tx = response.data.result;
        if (!tx) return;

        let mintAddress, tokenSupply;
        
        // Extract token mint information
        for (const balance of tx.meta.postTokenBalances || []) {
            if (balance.owner && balance.mint) {
                mintAddress = balance.mint;
                tokenSupply = balance.uiTokenAmount.uiAmount;
                break;
            }
        }

        if (!mintAddress) {
            logger.warn(`No mint address found in transaction: ${signature}`);
            return;
        }

        // Fetch token metadata
        const tokenInfo = await getTokenMetadata(mintAddress);
        const tokenName = tokenInfo.name || "Unknown";
        const tokenSymbol = tokenInfo.symbol || "Unknown";

        // ✅ Check if it's a stablecoin (dynamic filtering)
        const isStable = await isStablecoin(tokenName);
        if (isStable) {
            logger.info(`Skipping stablecoin: ${tokenName} (${tokenSymbol})`);
            return;
        }

        // Log only meme coins
        logger.info(`New Meme Coin Mint Found!`);
        logger.info(`Mint Address: ${mintAddress}`);
        logger.info(`Token Name: ${tokenName} (${tokenSymbol})`);
        logger.info(`Total Supply: ${tokenSupply}`);
        logger.info(`------------------------------------`);
    } catch (error) {
        logger.error(`Error fetching transaction ${signature}:`, error.message);
    }
}

// ✅ Fetch token metadata using Helius' getAsset API
async function getTokenMetadata(mintAddress) {
    try {
        const response = await axios.post(RPC_URL, {
            jsonrpc: "2.0",
            id: 1,
            method: "getAsset",
            params: { id: mintAddress }
        });

        const metadata = response.data.result?.content?.metadata;
        if (!metadata) return {};

        return {
            name: metadata.name || null,
            symbol: metadata.symbol || null
        };
    } catch (error) {
        logger.warn(`Error fetching metadata for ${mintAddress}:`, error.message);
        return {};
    }
}

// ✅ Function to check if token is a stablecoin (dynamic filtering needed)
// wont function if new stable coin is launched
async function isStablecoin(tokenName) {
    if (!tokenName) return false;
    const lowerName = tokenName.toLowerCase();

    // Common stablecoin indicators
    const stableKeywords = ["usd", "tether", "wrapped", "busd", "usdt", "usdc", "paypal", "zusd", "eurc", "usdh", "dai"];
    
    return stableKeywords.some(keyword => lowerName.includes(keyword));
}