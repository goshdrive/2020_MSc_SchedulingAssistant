var mongoose = require('./mongoosedb.js');
const { Schema } = require('mongoose');


var clinicianschema = new mongoose.Schema({
 
    name:{
        type:String,
        default:"none",
    },
    email:{
        type:String, unique:true,
        default:"none"
    },
    password:String,
    target:Number,
    pic:String,
    workday:Array


})


module.exports = mongoose.model('Clinician', clinicianschema,'clinician');