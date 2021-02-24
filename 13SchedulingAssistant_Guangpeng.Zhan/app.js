var express = require('express');
var app = new express();
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
//store user informaion
var session = require("express-session");


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000*60*30
     },
     rolling:true
  }))


 
//admin pages
var admin =require('./routes/admin.js')

//clinician pages
var index = require('./routes/index.js') //clinican mainpage

//ejs view engine setting
app.set('view engine','ejs');
app.use(express.static('public'));

// upload/l9dhpnr-ucRVPEHbWbXDfcoQ
app.use('/upload',express.static('upload'));

app.use('/', index);
app.use('/admin',admin);

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(404).send('Something broke!')
// })

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use(function(err, req, res, next) {

//   if (err){console.log(err);}
//   // responds to client or test with error
//   res.status(err.status || 500).json({
//  message: "this is not the web page you're looking for. - obi-wan codenobi"
// });
// });






app.listen(8010,'127.0.0.1'); 


// module.exports = app;