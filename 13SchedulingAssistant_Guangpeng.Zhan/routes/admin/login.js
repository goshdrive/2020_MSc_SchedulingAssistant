var express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
var md5 =require('md5-node');
var DB = require('../../modules/db.js');


router.get('/', function(req,res){

    res.render('admin/login')
    
})


router.post('/dologin', function(req,res){
    

    

    var email = req.body.email;
    var password =md5(req.body.password); //encrypte the password inputted by user
   // 1, get the password and email in login page
   //2,connect to db and look up the data
   
   DB.find('admin',{
    email:email,
    password:password
   },function(err,data){
 
    if (data.length>0){
        console.log('login successfully');
        
        //store user information
        req.session.userinfo = data[0];
        
        res.redirect('/admin/adminmain');
    }else{
        console.log('fail to login');
        res.send("<script>alert('fail to login'); location.href='/admin/login'</script>")
    }

   })
   
})

router.get('/loginOut',function(req,res){

    req.session.destroy(function(err){
        if (err){
            console.log(err);
        }else{
            res.redirect('/admin/login');
        }
    })
})

module.exports = router;