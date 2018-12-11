const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');


// create express app
const https = require('https');
const fs = require('fs');
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/firebaseUser.routes.js')(app);
require('./app/routes/location.routes')(app);
require('./app/routes/relation.routes')(app);
require('./app/routes/clusters.routes')(app);


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Moovfy application."});
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
    var requestLoop = setInterval(function(){
        request({
            url: "http://localhost:3000/optics",
            method: "GET",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10
        },function(error, response, body){
            if(!error && response.statusCode == 200){
                console.log('sucess!');
            }else{
                console.log('error' + response.statusCode);
            }
        });
    }, 60000);
});

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    ca: fs.readFileSync('server.pem')
}, app).listen(3001, () => {
    console.log("Listening on port 3001 in https");
})

