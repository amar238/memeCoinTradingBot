const express = require('express');
const router = express.Router();
const tradeController = require('./tradeController');

router.post('/trade', tradeController.executeTrade);

module.exports = router;