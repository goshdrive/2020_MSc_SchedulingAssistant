var express= require('express');
var router = express.Router();
var DB = require('../../modules/db.js');
var multiparty = require('multiparty');
var isodate = require("isodate");


router.get('/', function(req,res){
    
    // for the header "Admin2 Page"
    
    var userinfo =  req.session.userinfo;
    
    DB.find('patient',{},function(err,data){

        res.render('admin/admin_inputpage',{
            list:data,
            userinfo:userinfo
        });

    })
})


router.post('/add', function(req,res){
    var form = new multiparty.Form();
    
     form.uploadDir='upload';    // the path where you store the images
     form.parse(req, function(err, fields, files) {
      /*get the posted data and return the uploaded images;
        fields: form data
        files: the path where the images uploaded successfully
     */
        
        console.log(fields);
 
        var identifier = fields.identifier[0];
        var additional_note =fields.additional_note[0];
        timelist=fields.referal_date[0].split("/");

        var date_string = fields.referal_date[0].split(" ");
       var date1 = isodate(date_string[0]+"T"+date_string[1]+":00.00Z");
       
        
        DB.insert('patient',{

            identifier:identifier,
            referal_date:date1,
            additional_note:additional_note,
            status:0



        },function(err,data){

            if (!err){
                res.redirect('/admin/admininput')
            }

        })
    
    })
    
})


router.get('/edit',function(req,res){

    var id = req.query.id;

    console.log(id);
   //  res.render('admin/patientedit')
     DB.find('patient',{"_id":new DB.ObjectID(id)},function(err,result){

          if (err){
              console.log(err);
          }
 
          console.log(result);
          res.render('admin/patientedit',{list:result})
          

     })

})

router.post('/doedit',function(req,res){

    
    var form = new multiparty.Form();
    
    
    form.parse(req, function(err, fields, files) {
     /*get the posted data and return the uploaded images;
       fields: form data
       files: the path where the images uploaded successfully
    */
        console.log(fields);
       var id = String(fields._id[0]);
       var identifier = fields.identifier[0];
       var date_string = fields.referal_date[0].split(" ");
       var date1 = isodate(date_string[0]+"T"+date_string[1]+":00.00Z");
       var note = fields.note[0]

       DB.update('patient',{"_id":new DB.ObjectID(id)},{

           identifier:identifier,
           referal_date:date1,
           additional_note:note
       },function(err){

            if (err){

                console.log(err);
            }
             
            res.redirect('/admin/admininput')
          
       })



    })


})


router.get('/delete',function(req,res){
    
    
     //get id from url  
     var id = req.query.id;
     DB.deleteOne('patient',{"_id":new DB.ObjectID(id)},function(err){ //get the self increment ID
 
         if (!err){
 
             res.redirect('/admin/admininput');
         }
     })
})


module.exports = router;