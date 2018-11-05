const StockFunctions = require('./StockFunctions');
const express = require('express');
const router = express.Router();

router.get('/stock-prices',(req,res) => new StockFunctions().getPrice(res, req.query.stock, req.ip, req.query.like) );

module.exports = router;