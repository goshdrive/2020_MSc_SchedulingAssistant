
var express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
var multiparty = require('multiparty');
var md5 =require('md5-node');
var DB = require('../modules/db.js');
const Mail=require('../modules/email.js')
var fs = require('fs');
var url = require('url')


var mongoose = require('mongoose')
var clinicianmodel = require('../modules/clinician.js')
var appointmentmodel = require('../modules/appointment.js');




router.use(function(req,res,next){
    
    var pathname = url.parse(req.url).pathname
    
    if (pathname=='/login'|| pathname=='/login/dologin' || pathname=='/register'|| pathname=='/register/doregister' ||pathname=='/register/getCode' || pathname=='/forgetpassword'
        || pathname=='/doforgetpassword'||pathname=='/findpassword' || pathname=='/dofindpassword' || pathname=='/admin/login'  ||pathname=='/admin/login/dologin' ||pathname=='/admin/register' ||pathname=='/admin/register/doregister'){
          
          next();
    }else{

        if(req.session.userinfo && req.session.userinfo.username != ''){ // check whether has logined
            //In ejs, set the lobal variant, used in all pages
            /*
            app.locals global variables
            req.app.locals // current req's global variables

            */
            
           
            
            // req.app.locals['userinfo'] = req.session.userinfo;  
            // console.log(userinfo.username+"line33");        
            next();
       }else{
            
           
            res.redirect('/login');
    
       }
    }   
})












router.get('/login',function(req,res){
    
    res.render('login')
})

router.post('/login/dologin',function(req,res){

    var form = new multiparty.Form();
     form.uploadDir='upload';    // the path where you store the images
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully

      */
         

      
      var email = fields.email[0];
      var password = md5(fields.password[0]);

     

   clinicianmodel.find({
    email:email,
    password:password
   },function(err,data){
 
    if (data.length>0){
        console.log('login successfully');
        
        //store user information
        req.session.userinfo = data[0];
        
        res.redirect('/profile');
    }else{
        
        res.send("<script>alert('fail to login'); location.href='/login'</script>")
    }

   })

})
})


router.get('/register',function(req,res){
        
    res.render('register')

})

router.post('/register/doregister', function(req,res){

    var form = new multiparty.Form();
     form.uploadDir='upload';    // the path where you store the images
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully

      */

      console.log(fields);

    

      var full_name = fields.full_name[0];
      var email = fields.email[0];
      var target = parseInt(fields.target[0]);
      var password = md5(fields.password[0]);
      var workday = fields.workday;

      
      var pic = files.photo[0].path;
      
    
    
      clinicianmodel.find({email:email},function(err,result){
        if (result.length>=1){

            res.send("<script>alert('The email has been used, Please change one'); location.href='/register'</script>")
        }else{

            
            let code ="http://localhost:8010/login";
            // codeObj[mail]=code;
            // console.log(codeObj);
            
            Mail.send(email,code,(state)=>{
                if(state===1){
                    res.send('sent successfully')
                    
                }else{
                    res.send('fail to send')
                }
            })

            var clinician = new clinicianmodel({

                name: full_name,
                email:email,
                password:password,
                target:target,
                pic:pic,
                workday:workday

            })

            clinician.save(function(err){

                if (!err){
                    res.send("<script>alert('Register Successfully'); location.href='/login'</script>")
                }

            });


           
        }
    })
      

    });

})


router.get('/forgetpassword',function(req,res){

    res.render('forgetpassword')
    
})

router.post('/doforgetpassword', function(req,res){

    var form = new multiparty.Form();
    form.uploadDir='upload';    // the path where you store the images
    form.parse(req, function(err, fields, files) {
        var email = fields.email[0];
        
        clinicianmodel.find({email:email},function(err,result){
 

            if (result.length<1){

                res.send("<script>alert('The email not exists, please input again'); location.href='/forgetpassword'</script>")
            }else{
             
                var id = result[0]._id;
                var id_string = String(id);
                console.log(typeof id_string);
                
                let code ="http://localhost:8010/findpassword?id="+id_string;
                console.log(code);
                // codeObj[mail]=code;
                // console.log(codeObj);
                
                Mail.send(email,code,(state)=>{
                    if(state===1){
                        res.send("<script>alert('Verificaion Email has been send successfully,please check your email'); location.href='/forgetpassword'</script>")
                        
                    }else{
                        res.send("<script>alert('Fail to send email'); location.href='/forgetpassword'</script>")
                    }
                })
    


            }

                

        })


    })


})


router.get('/findpassword', function(req,res){

//console.log(req.query.id);
      var id = String(req.query.id);
      res.render('findpassword',{id:id})

})

router.post('/dofindpassword',function(req,res){

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
         
        console.log(fields);
        var id = fields.id[0];
        var password1 = md5(fields.newpassword[0]);
        var password2 = md5(fields.confirmpassword[0]);

       if (password1==password2){

        clinicianmodel.updateOne({_id:id},{
            
            password:password1

        },function(err){

            res.send("<script>alert('Change password successfully'); location.href='/login'</script>")


        })
       }

    })



})




router.get('/mainpage',function(req,res){

    var userinfo = req.session.userinfo;
    appointmentmodel.aggregate([

        {
            $lookup:
            {
                from:"clinician",
                localField:"clinician1_id",
                foreignField:"_id",
                as:"clinician1"
    
            }
             
        },{

            $lookup:
            {
                from:"clinician",
                localField:"clinician2_id",
                foreignField:"_id",
                as:"clinician2"
    
            }

        },
        {
            $match:{$or:[{clinician1_id:mongoose.Types.ObjectId(userinfo._id)},{clinician2_id:mongoose.Types.ObjectId(userinfo._id)}]}
        }
    // 
    
    ],function(err,docs){
    
    
        if (err){
    
            console.log(err);
            return;
        }
    
       
        
          res.render('clinic_mainpage',{
            userinfo:userinfo,
            list:docs
            
        });

        //console.log(JSON.stringify(docs));
    })
    
    
    
   
})


router.get('/mainpage/addnote',function(req,res){

var id = req.query.id;



appointmentmodel.aggregate([

    {
        $lookup:
        {
            from:"clinician",
            localField:"clinician1_id",
            foreignField:"_id",
            as:"clinician1"

        }
         
    },{

        $lookup:
        {
            from:"clinician",
            localField:"clinician2_id",
            foreignField:"_id",
            as:"clinician2"

        }

    },
    {
        $match:{_id:mongoose.Types.ObjectId(id)}
    }


],function(err,docs){


    if (err){

        console.log(err);
        return;
    }

   
    
      res.render('clinician_addnote',{
        
        list:docs
        
    });

    //console.log(JSON.stringify(docs));
})






})





router.post('/mainpage/addnote/doaddnote',function(req,res){



    var form = new multiparty.Form();
    form.uploadDir='upload';    // the path where you store the images
    form.parse(req, function(err, fields, files) {
     /*get the posted data and return the uploaded images;
       fields: form data
       files: the path where the images uploaded successfully

     */

     var id = fields._id[0];
    //  var clinician1_id = fields.clinician1_id[0];
    //  var clinician1_name = fields.clinician1_name[0];
    //  var clinician2_id = fields.clinician2_id;
    //  var clinician2_name = fields.clinician2_name;
    var note = fields.note[0];

   
    
     appointmentmodel.updateOne({_id:id},{


        note:note
     },function(err){
         if (!err){
            res.redirect('/mainpage')
         }
     })
    })



})





router.get('/profile',function(req,res){
    
    
    var userinfo = req.session.userinfo;
    
    clinicianmodel.find({"_id":userinfo._id},function(err,data){

        console.log(data);
        var username = data[0].name
        var email=data[0].email
        var target=data[0].target
        var pic =data[0].pic
        var id = data[0]._id

        res.render('profile',{

            username:username,
            email:email,
            target:target,
            pic:pic,
            id:id
        

    });
    })
    
})



router.get('/profile/edit',function(req,res){
    
    var userinfo = req.session.userinfo;
    
    
    var id = userinfo._id;
    
  
    clinicianmodel.find({"_id":id},function(err,data){

        
        res.render('profileedit',{
            list:data[0]
        })
    })
    

})

router.post('/profile/doedit',function(req,res){

    var form = new multiparty.Form();
     form.uploadDir='upload';    // the path where you store the images
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully

      */
      
         
         
          var _id = fields._id[0]  // conditions for edit
          var name = fields.full_name[0]
          var target = fields.target[0]
          var pic = files.photo[0].path
          var originalFilename = files.photo[0].originalFilename
          console.log('line29'+originalFilename);

          if (originalFilename){

            var setData={ // if change photo

                name,
                target,
                pic
              };
            
          }else{   //if not change photo

            var setData = {
                   name,
                   target,        
               };
            //delete temporarily photo   
            fs.unlink(pic,function(err){
                if(err){
                    console.log(err);
                }
            });
          }
          console.log('line228');
     clinicianmodel.updateOne({"_id":_id},setData,function(err,data){
            if (!err){
             res.redirect('/profile');
         }
     })
   

})

})

router.post('/profile/editpassword',function(req,res){

    
    var form = new multiparty.Form();
     
    userinfo =  req.session.userinfo;
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully

      */
    
     var _id = userinfo._id
     var oldpassword = md5(fields.password[0])
     var new_password = md5(fields.new_password[0])
     var new_password2 =md5( fields.new_password2[0])
     
     clinicianmodel.find({"_id":_id,"password":oldpassword},function(err,data){

     
        if (err){
            console.log(err);
        }
       
        if (data.length>0){


            if (new_password==new_password2){
                 
                console.log('279--index.js');
                clinicianmodel.updateOne({"_id":_id},{

                    password:new_password
                },function(err,data){

                    res.send("<script>alert('change password successfully'); location.href='/profile'</script>")
                })
                
            }else{
                res.send("<script>alert('New passwords are not the same'); location.href='/profile'</script>")

            }

        }else{

            res.send("<script>alert('Old password is not correct, please try again'); location.href='/profile'</script>")
        }
      })
     })
    

})







module.exports=router;



