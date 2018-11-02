const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Stock = new Schema({
    name: String,
    likes: Number,
    ipAddresses: Array
})

module.exports = mongoose.model('stocks', Stock);