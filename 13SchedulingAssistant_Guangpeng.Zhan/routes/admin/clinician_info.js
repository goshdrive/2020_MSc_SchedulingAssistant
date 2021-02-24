var express= require('express');
var router = express.Router();
var isodate = require("isodate");
const { Db } = require('mongodb');
var mongoose =require('mongoose');
var clinicianmodel = require('../../modules/clinician.js')


console.log('line12');
router.get('/',function(req,res){

    var userinfo = req.session.userinfo;
   
    clinicianmodel.find({},function(err,result){

        if (err){
            console.log(err);
        }
       
        res.render('admin/clinician_info',{
            userinfo:userinfo,
            list:result
        })


    })


})



module.exports = router;