const mongoose = require('mongoose');

const memeCoinSchema = new mongoose.Schema({
    name: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MemeCoin', memeCoinSchema);