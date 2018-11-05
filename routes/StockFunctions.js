const Stock = require('../models/Stock');
const request = require('request');

class StockFunctions {
    getPrice(res, company, ip, addLike) {
        if(typeof company === 'string') {
            this.oneCompany(res, company, ip, addLike);
        }
        else {
            this.twoCompanies(res, company, ip, addLike);
        }

    }

    oneCompany(res, company, ip, addLike){
        request('https://api.iextrading.com/1.0/stock/'+company+'/chart/1d', (err, response,body) => {
            if(err) console.log(err);

            if(body === 'Unknown symbol') { 
                return res.send('Cannot find stock.')
            }

            if(addLike) {
                this.addLike(company, ip, (alreadyLiked) => {
                    if(alreadyLiked) {
                        res.header("Content-Type",'text/html');
                       return res.send("You can only like a stock once per IP Address")
                    }

                    this.getLikes(company, (likes) => {
                        res.header("Content-Type",'application/json');
                        res.send({stock: company, price: JSON.parse(body)[0].average, likes: likes});
                    });
                });
            }

            else {
                this.getLikes(company, (likes) => {
                    res.header("Content-Type",'application/json');
                    res.send({stock: company, price: JSON.parse(body)[0].average, likes: likes});
                });
            }

        }); 
    }
    
    twoCompanies(res, company, ip, addLike) {
        request('https://api.iextrading.com/1.0/stock/'+company[0]+'/chart/1d', (err, response,body1) => {
            if(err) console.log(err);

            if(body1 === 'Unknown symbol') { 
                return res.send('Cannot find stock.')
            }

            request('https://api.iextrading.com/1.0/stock/'+company[1]+'/chart/1d', (err, response,body2) => {

                if(body2 === 'Unknown symbol') { 
                    return res.send('Cannot find stock.')
                }

                if(addLike) {
                    this.addLike(company[0], ip, (alreadyLiked) => {
                        if(alreadyLiked) {
                            res.header("Content-Type",'text/html');
                        return res.send("You can only like a stock once per IP Address")
                        }

                        this.addLike(company[1], ip, (alreadyLiked) => {
                            if(alreadyLiked) {
                                res.header("Content-Type",'text/html');
                            return res.send("You can only like a stock once per IP Address")
                            }    

                            this.getLikes(company[0], (likes1) => {
                                this.getLikes(company[1], (likes2) => {
                                    res.header("Content-Type",'application/json');
                                    res.send([{stock: company[0], price: JSON.parse(body1)[0].average, rel_likes: this.compareLikes(likes1, likes2)},
                                              {stock: company[1], price: JSON.parse(body2)[0].average, rel_likes: this.compareLikes(likes2, likes1)}]);
                                });
                            });
                        });
                    });
                }

                else {
                    this.getLikes(company[0], (likes1) => {
                        this.getLikes(company[1], (likes2) => {
                            res.header("Content-Type",'application/json');
                            res.send([{stock: company[0], price: JSON.parse(body1)[0].average, rel_likes: this.compareLikes(likes1, likes2)},
                                      {stock: company[1], price: JSON.parse(body2)[0].average, rel_likes: this.compareLikes(likes2, likes1)}]);
                        });
                    });
                }

            }); 
        }); 
    }

    addLike(name, ip, cb) {
        Stock.findOne({name: name},(err,response) => {
            if(err) console.log(err);

            let userAlreadyLiked

            if(response) {
                userAlreadyLiked = response.ipAddresses.indexOf(ip) > -1;
            }

            if(response !== null && !userAlreadyLiked) {
                Stock.findOneAndUpdate({name: name}, {$inc: {likes: 1}}, (err,response) => {
                    if(err) console.log(err);

                    cb(false);
                })
            }
            else if(userAlreadyLiked) {
                cb(true);
            }
            else {
                new Stock({
                    name: name,
                    likes: 1,
                    ipAddresses: [ip]
                }).save(() => cb(false) );
            }
        })
    }

    getLikes(name, cb) {
        return Stock.findOne({name: name}, (err,response) => {
            if(err) console.log(err);

            if(response){
                cb(response.likes);
            }
            else {
                cb(0);
            }
        })
    }

    compareLikes(current, other) {
        return current-other;
    }
}

module.exports = StockFunctions;