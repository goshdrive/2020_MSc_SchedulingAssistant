var express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
var md5 =require('md5-node');
var DB = require('../../modules/db.js');
var multiparty = require('multiparty');
const { Db } = require('mongodb');
const Mail=require('../../modules/email.js')



router.get('/', function(req,res){

    res.render('admin/register')
    
})


router.post('/doregister', function(req,res){

    var form = new multiparty.Form();
    //  form.uploadDir='upload';    // the path where you store the images
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully

      */

      var full_name = fields.full_name[0];
      var email = fields.email[0];
      var password = md5(fields.password[0]);

     

    DB.find('admin',{email:email},function(err,result){
        if (result.length>1){

            res.send("<script>alert('The email has been used, Please change one'); location.href='/admin/register'</script>")
        }else{

            
            let code ="http://localhost:8010/admin/login";
            // codeObj[mail]=code;
            // console.log(codeObj);
            
            Mail.send(email,code,(state)=>{
                if(state===1){
                    res.send('发送ok')
                    
                }else{
                    res.send('发送失败')
                }
            })

            DB.insert('admin',{

                    username:full_name,
                    email:email,
                    password:password,
                    status:1
            },function(err,data){

                res.send("<script>alert('Register Successfully'); location.href='/admin/login'</script>")
            })
        }
    })
      


    });


    
})

router.post('getCode',function(req,res){

    
    //let mail =req.query.mail;  //获取数据
    var mail = 'guangpeng.zhan@outlook.com';
    let code =Math.floor(Math.random()*11000-1001);
    codeObj[mail]=code;
    console.log(codeObj);
    Mail.send(mail,code,(state)=>{
        if(state===1){
            res.send('发送ok')
            
        }else{
            res.send('发送失败')
        }
    })
})








module.exports = router;