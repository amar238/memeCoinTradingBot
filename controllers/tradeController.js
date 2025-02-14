const { connection, keypair } = require('../services/solanaService');
const { getBestTrade } = require('./jupiterService');
const { Transaction } = require('@solana/web3.js');
const logger = require('../utils/logger');

exports.executeTrade = async (req, res) => {
    try {
        const { inputMint, outputMint, amount } = req.body;

        const tradeRoute = await getBestTrade(inputMint, outputMint, amount);
        if (!tradeRoute) return res.status(400).json({ message: "No profitable trade found." });

        const tx = Transaction.from(Buffer.from(tradeRoute.tx, "base64"));
        tx.sign(keypair);

        const signature = await connection.sendRawTransaction(tx.serialize());
        logger.info(`Trade executed: ${signature}`);
        res.json({ success: true, txId: signature });

    } catch (error) {
        logger.error("Trade Execution Error:", error);
        res.status(500).json({ message: "Trade execution failed." });
    }
};
