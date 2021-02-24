var express= require('express');
var router = express.Router();
var DB = require('../../modules/db.js');
var Appointment_get = require('../../modules/appointment_generate_new.js')
var multiparty = require('multiparty');
var isodate = require("isodate");
const { Db } = require('mongodb');
var mongoose =require('mongoose');


var clinicianmodel = require('../../modules/clinician.js')
var appointmentmodel = require('../../modules/appointment.js')



router.get('/',function(req,res){

    var userinfo =  req.session.userinfo;
    
    var list = [];


   

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

        }
        // ,
        // {
        //     $match:{"_id":mongoose.Types.ObjectId('5f4a17e2dbb82e2124c1d701')}
        // }
    
    
    ],function(err,docs){
    
    
        if (err){
    
            console.log(err);
            return;
        }

       
          res.render('admin/admin_mainpage',{
            list:docs,
            userinfo:userinfo
        });

        //console.log(JSON.stringify(docs));
    })
    


})


router.get('/generatetable', function(req,res){
    
    // for the header "Admin2 Page"
    
    var userinfo =  req.session.userinfo;

    
   
    Appointment_get.AppointmentGenerate(function(err){



        if (err){

            console.log(err);
        }
        

        
        
       


    })
   
    res.redirect('/admin/adminmain');
})


router.get('/appointmentedit', function(req,res){

    
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
            $match:{"_id":mongoose.Types.ObjectId(id)}
        }
    
    
    ],function(err,docs){
    
    
        if (err){
    
            console.log(err);
            return;
        }
    
         // console.log(docs[0].clinician1);
        
          res.render('admin/appointment_edit',{
            list:docs,
            
        });

        //console.log(JSON.stringify(docs));
    })
    
})


router.post('/appointmentdoedit',function(req,res){

    var form = new multiparty.Form();
    
    
    form.parse(req, function(err, fields, files) {
     /*get the posted data and return the uploaded images;
       fields: form data
       files: the path where the images uploaded successfully
    */
        console.log(fields);
       var id = String(fields._id);
       var patient_identifier = fields.patient_identifier[0];
       var clinician1_name = fields.clinician1_name[0];
       var clinician2_name = fields.clinician2_name[0];       
       var date_string = fields.date[0].split(" ");
       var date1 = isodate(date_string[0]+"T"+date_string[1]+":00.00Z");
       var note = fields.note[0]
       
      
       clinicianmodel.find({name:clinician1_name},function(err1,result1){
        clinicianmodel.find({name:clinician2_name},function(err2,result2){
 
     

            if (result1.length ==0 || result2.length==0 ){               
        
                res.send("<script>alert('The clinician not exist, please input again'); location.href='/admin/adminmain' </script>")

            }else{

                
                var clinician1_id = result1[0]._id;
                var clinician2_id = result2[0]._id;
    
                

      

                console.log(clinician1_id);
               
                appointmentmodel.updateOne({_id:id},{
     
                     patient_identifier:patient_identifier,
                     clinician1_id:clinician1_id,             
                     clinician2_id:clinician2_id,                     
                     date:date1,
                     note:note
    
    
    
                },function(err){
    
                    if (err){
    
                       console.log(err);
                    }

                    res.redirect('/admin/adminmain')


                    
                })

            }
              

       })

       })
    

    })


})

router.get('/delete',function(req,res){


    var id = req.query.id;

    appointmentmodel.deleteOne({'_id':id},function(err){

        if (!err){
 
            res.redirect('/admin/adminmain');
        }
    })

})


router.post('/add',function(req,res){

    var form = new multiparty.Form();
    
    
    form.parse(req, function(err, fields, files) {
     /*get the posted data and return the uploaded images;
       fields: form data
       files: the path where the images uploaded successfully
    */
       
       var patient_identifier = fields.patient_identifier[0];
       var clinician1_name = fields.clinician1_name[0];
       var clinician2_name = fields.clinician2_name[0];
       var date_string = fields.date[0].split(" ");
       var date1 = isodate(date_string[0]+"T"+date_string[1]+":00.00Z");
       var note = fields.note[0];

       clinicianmodel.find({name:clinician1_name},function(err1,result1){
        clinicianmodel.find({name:clinician2_name},function(err2,result2){
 
        if (result1.length ==0 || result2.length ==0){

            res.send("<script>alert('The clinician not exist, please input again'); location.href='/admin/adminmain' </script>")

        }else{

            var clinician1_id = result1[0]._id;
            var clinician2_id = result2[0]._id;
           
           
            DB.insert('appointment',{
 
                 patient_identifier:patient_identifier,
                 clinician1_id:new DB.ObjectID(clinician1_id),
                 clinician2_id:new DB.ObjectID(clinician2_id),
                 
                 date:date1,
                 note:note

            },function(err){

                if (!err){

                    res.redirect('/admin/adminmain')
                }           
            })

        }
            
          




       })

       })
 
      

     
    })


})



module.exports = router;