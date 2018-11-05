"use strict"
require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const api = require('./routes/apiController');

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'script.js'"],
//       styleSrc: ["'self'"]
//     }
//   }))

app.use(express.static('public'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DB, {useNewUrlParser: true });
mongoose.connection.once('open',()=>{
    console.log("Connected to Mongo via Mongoose")
    }).on('error',(err) => console.log("Connection Error: " + err));

app.use('/api',api);
app.listen(3000, () => console.log('Server On') )

/*
User Stories
Set the content security policies to only allow loading of scripts and css from your server.
I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference betwwen the likes) on both.
A good way to recieve current price is the following external API(replacing 'GOOG' with your stock): https://finance.google.com/finance/info?q=NASDAQ%3aGOOG
All 5 functional tests are complete and passing.
*/