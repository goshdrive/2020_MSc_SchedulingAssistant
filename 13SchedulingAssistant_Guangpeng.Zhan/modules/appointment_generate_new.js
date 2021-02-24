var DB = require('./db.js');
var mongoose = require('mongoose')
var clinicianmodel = require('../modules/clinician.js')
var appointmentmodel = require('../modules/appointment.js');







//get the remaining working days of certan clinician
 function getRemain(clinician_id,clinician_target,selected_month,callback){
    appointmentmodel.find(
    {$or:[{clinician1_id:clinician_id},{clinician2_id:clinician_id}]},
    function(err,data){     
        date_list = []; //stores all the appoointment date of clinician1 in July (certain month) 
        for (var k=0; k<data.length;k++){

            var month = data[k].date.getMonth()
            
            var date = data[k].date.getDate()
            

            if (month ==selected_month){  //ensure the appointment in certain month

              
               appointment_date = date+"/"+month;
               
               date_list.push(appointment_date)

            }
            
        }

        
        var working_day_no_repeat= new Set(date_list).size;
        
        clinician_remain = clinician_target - working_day_no_repeat

        


        callback(clinician_remain);

        
                          
    })                
    }



function getAvaliableClinicians(selected_day,callback){

        
        console.log('selected day--'+selected_day);
        var selected_month = selected_day.getMonth()+1;
        var avaliable_clinician = []
        var selected_weekday = String(selected_day.getDay());

        clinicianmodel.find({},function(err,clinician_list){
     
            for (var i=0; i<clinician_list.length;i++){
             
            (function(i){
                var clinician_id = clinician_list[i]._id
                var clinician_target = parseInt(clinician_list[i].target)
                var clinician_workdays = clinician_list[i].workday;
                

                    getRemain(clinician_id,clinician_target,selected_month,function(remain){
                           
                            appointmentmodel.find({
                                date:selected_day,
                                $or:[{clinician1_id:clinician_id},{clinician2_id:clinician_id}]},
                            function(err,data){   
                                
                         
                                
                                if (data.length<1 && remain>0 && clinician_workdays.includes(selected_weekday)  ){
                                    avaliable_clinician.push(clinician_id)
                                }

                                if (i == clinician_list.length-1){

                                    
                                    callback(avaliable_clinician)
                                }

                                
                                  
                               
                               

                            })

                            
                            
                        })
                        
              })(i);     
            }  
            
           
                
        })
          
        


    

}



function getAvaliableappoint_time(patient_referal,callback){
    console.log('patient referal date');
    console.log(patient_referal);
    var patient_referal2 = new Date(patient_referal);
    var date1 = patient_referal2.setHours(patient_referal2.getHours() + 24*2)
    date1 = new Date(date1);
    var date2 = patient_referal2.setHours(patient_referal2.getHours()+24 *25)
    date2 = new Date(date2);
    var date3 = patient_referal2.setHours(patient_referal2.getHours()+24 *25)
    date3 = new Date(date3);
    var date4 = patient_referal2.setHours(patient_referal2.getHours()+24 *25)
    date4 = new Date(date4);
    

     
    var dates_list = [date1,date2,date3,date4]
    console.log('innitial  avaliable_date');
    console.log(dates_list);
    var avaliable_date = [];
    

    
    for (var i =0; i<dates_list.length; i++){
          for (var j=1; j<7; j++){

             (function(i,j){

        
                var base = new Date(dates_list[i]);
                var newitem = base.setHours(base.getHours() + 24*j)
                newitem = new Date(newitem);
                base.setHours(base.getHours() - 24*j);
                base = new Date(base);
                
                

                DB.find('appointment',{date:newitem},function(err,data){
                        
                  //check wehther newitem is bank holiday 

                        var day = newitem.getDate();
                        var month = newitem.getMonth();
                        var year = newitem.getFullYear();
                        var datestring = day+"/"+month+'/'+year;

                        console.log('line178');

                        console.log(datestring);
                        var bankholiday = ['30/11/2020','25/12/2020','26/12/2020','1/1/2021',
                         '2/4/2021','5/4/2021','31/5/2021','30/8/2021','25/8/2021','26/12/2021',
                         '27/12/2021','1/1/2022','3/1/2022','15/4/2022','18/4/2022','24/4/2022',
                         '2/5/2022','30/5/2022','29/8/2022','25/12/2022','26/12/2022'];

                        var isbankholiday = bankholiday.includes(datestring)
                        


                        

                        var length = avaliable_date.length
                        if ((newitem.getDay() == 1 || newitem.getDay() == 2 || newitem.getDay() == 3 ) && data.length<2 && length<4 && !isbankholiday ){
                                                       
                            
                            if (length > 3){  length = 3}
                            
                            if (dates_list[length].getTime() < newitem.getTime() ){

                                //console.log('new item---' +newitem);
            
                                avaliable_date.push(newitem)
                                
                                
                            }

                            if (avaliable_date.length==4){

                                
                                
                                callback(err,avaliable_date)                             
                                
                            }

                            
                        }
                      
                  
               })

               



            })(i,j);    
            
            
        
        
          }
        


    }

      


}

exports.AppointmentGenerate = function(callback){

DB.find('patient',{"status":0},function(err,patient_list){
       
    if (patient_list.length ==0){

        console.log('None Patient need to be arranged');
        callback()
    }else{


    
    
        for (var k = 0; k<patient_list.length; k++){
            (function(k){

    
            var patient_id = patient_list[k]._id;
            var patient_referal =patient_list[k].referal_date;
            var patient_identifier = patient_list[k].identifier;

            DB.update('patient',{"_id":new DB.ObjectID(patient_id)},{
                "status":1
            },function(err){

                console.log(err);
            })
            

            
            

            
            getAvaliableappoint_time(patient_referal,function(err,avaliable_date){
        
                        if (err){
                            console.log(err);
                        }
                        console.log('Final avaliable_date');
                        console.log(avaliable_date);
                        
                    


            
            for (var i =0; i <avaliable_date.length; i++){
            
                (function(i){
        
            //get the clinicians avaliable at the day
                getAvaliableClinicians(avaliable_date[i],function(avaliable_clinicians){
                     
                    console.log('avaliable_clinicians');
                    console.log(avaliable_clinicians);
                    for (var j =0; j<10; j++){

                        var random1=Math.floor(Math.random()*avaliable_clinicians.length);
                        var random2=Math.floor(Math.random()*avaliable_clinicians.length);

                        if (random1 !=random2){

                            break;

                        }

                        
                    }

                    console.log('random1---'+ random1);
                    console.log('random2---'+ random2);
                    var clinician1_id = avaliable_clinicians[random1]
                    var clinician2_id = avaliable_clinicians[random2]
                    
                    console.log('clinician1_id---'+clinician1_id)
                    console.log('clinician2_id---'+clinician2_id);

                    DB.find('clinician',{"_id":new DB.ObjectID(clinician1_id)},function(err,result1){
                        DB.find('clinician',{"_id":new DB.ObjectID(clinician2_id)},function(err,result2){

                        
                            
                            
                            if (result1.length >0 && result2.length>0){

                                    
                                    clinician1_name = result1[0].name;
                                    clinician2_name = result2[0].name;
        


                                    var appointment = new appointmentmodel({

                                        "patient_identifier":patient_identifier,
                                        "clinician1_id": clinician1_id,
                                        "clinician2_id": clinician2_id,
                                        "date":avaliable_date[i],
                                        "note":"none"


                                    })
            
                                   appointment.save(function(error){
            
                                        if (error){
                                            console.log(error);
                                        }

                                        callback(err);
                                        

                                        console.log('appointment has been inserted');
            
                                    })
                                
                                
                            }else{


                                console.log('Not enough clinicians to arrange four appointments');
                            }
                            
                            
                            
    
                        
                        })
                    })

                
            })


            })(i);
            }  


            })  
            
        
            
        })(k);  


        }


    }
        
        
        
      

})






}




