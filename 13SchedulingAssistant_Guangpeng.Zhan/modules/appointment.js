var mongoose = require('./mongoosedb.js');

var Schema= mongoose.Schema;



var AppointmentSchema = new mongoose.Schema({

    patient_identifier:{
        type:String,
        trim: true, // remove space
        index:true,
        required:true
    },
    
    clinician1_id:{type:Schema.Types.ObjectId},
    clinician2_id:{type:Schema.Types.ObjectId},
    date:Date,
    note:String


})

module.exports =  mongoose.model('Appointment',AppointmentSchema,'appointment');