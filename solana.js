const { Connection, Keypair } = require('@solana/web3.js');
const logger = require('./logger');

const connection = new Connection("https://api.mainnet-beta.solana.com");

const keypair = Keypair.generate(); // Replace with a real keypair for actual transactions

logger.info("Solana Connection Established");

module.exports = { connection, keypair };
