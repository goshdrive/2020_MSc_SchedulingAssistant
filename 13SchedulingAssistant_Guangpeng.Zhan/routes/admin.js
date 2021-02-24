var express = require('express');

var router = express.Router();// modularization,mounting,router, handle
var url = require('url')

// Back end router deal with all back end router

var login = require('./admin/login.js');
var admininput = require('./admin/admininput.js');
var register = require('./admin/register.js');
var adminmain = require('./admin/adminmain.js');
var clinician_info = require('./admin/clinician_info.js')
console.log('line11_admin.js');


//Customized middleware,check the status of login
router.use(function(req,res,next){
    var pathname = url.parse(req.url).pathname
    
    if (pathname=='/login'|| pathname=='/login/dologin' || pathname=='/register'||pathname=='/register/doregister' || pathname=='/register/getCode' || pathname =='/forgetpassword' 
    ||pathname=='/doforgetpassword'||pathname=='/findpassword' || pathname=='/dofindpassword' || pathname=='/admin/login'  ||pathname=='/admin/login/dologin'  ||pathname=='/admin/register' ||pathname=='/admin/register/doregister'){
      
      next();
    }else{

        if(req.session.userinfo && req.session.userinfo.username != ''){ // check whether has logined
           
            console.log('line30'+req.session.userinfo.username);
            
            next();
       }else{
            console.log('line37  admin.js'+ req.url);
            res.redirect('/admin/login');
    
       }
    }   
})


console.log('line42_admin.js');
router.use('/login',login);
router.use('/admininput',admininput); // transfer to ./admin/admininput.js
router.use('/register',register);
router.use('/adminmain',adminmain);
router.use('/clinicianinfo',clinician_info);


module.exports = router;

