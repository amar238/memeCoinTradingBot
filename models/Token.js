const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    mintAddress: String,
    name: String,
    symbol: String,
    supply: Number,
    price: Number
});

module.exports = mongoose.model('Token', TokenSchema);
