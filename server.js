
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var flash = require('connect-flash');
var mongoose = require('mongoose');
var async = require('async');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var customRoutes = require('./app/customRoutes');


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var configDB = require('./config/db.js');



mongoose.connect(configDB.url); // connect to our database
// Config
app.enable('trust proxy');
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
})); // get information from html forms
app.use(bodyParser.json());
//app.use(express.static());
app.use(express.static(path.join(__dirname, 'public'))); // Use static Files
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(flash()); // use connect-flash for flash messages stored in session

//Routes
require('./app/routes.js')(app);
app.use('/customRoutes', customRoutes);

//Start
app.listen(port);
console.log('The magic happens on port ' + port);
