var MongoClient = require("mongodb").MongoClient   
var DbUrl = 'mongodb://localhost: 27017/clinicianschedule';// 连接数据库的地址  student为数据库名称
var ObjectID = require('mongodb').ObjectID;


function _connectDb(callback){

    //    MongoClient.connect(urlDB,{ useUnifiedTopology: true },function(err,client){
  
    
   //MongoClient.connect(DbUrl, function(err,db){
    MongoClient.connect(DbUrl,{ useUnifiedTopology: true },function(err,client){
  
        
        if (err){

            console.log('fail to connect database');
            return;
        }


        // database operation: add delete edit

        
        var db = client.db("clinicianschedule");
        
       // var callback =function(err,db,client){}
        callback(err,db,client); //pass the "client" to function 

    

    })
}

// exports ObjectID
exports.ObjectID = ObjectID;


// database search
/*
  db.find(user,{},function(err,data){
      
    data

  })

*/
exports.find = function(collectionname,json,callback){
    
     _connectDb(function(err,db,client){

        if (err){
            log(err);
        }
        
        
        var result = db.collection(collectionname).find(json);
        result.toArray(function(error,data){
            
            
            client.close();
            callback(error,data); // get the data, conduct the callback function
        })
     })
}

exports.find_sortdate = function(collectionname,json,callback){
    
    _connectDb(function(err,db,client){

       if (err){
           log(err);
       }
       
       
       var result = db.collection(collectionname).find(json).sort({"date":1});
       result.toArray(function(error,data){
           
           
           client.close();
           callback(error,data); // get the data, conduct the callback function
       })
    })
}


exports.insert = function(collectionname,json,callback){
    
     _connectDb(function(err,db,client){

        if (err){
            log(err);
        }
       
        db.collection(collectionname).insertOne(json,function(error,data){

            callback(error,data);
        })



     })
}


exports.insertMany = function(collectionname,json,callback){
    
    _connectDb(function(err,db,client){

       if (err){
           log(err);
       }
      
       db.collection(collectionname).insertMany(json,function(error,data){

           callback(error,data);
       })



    })
}



exports.update = function(collectionname,json1,json2,callback){
    
    _connectDb(function(err,db,client){

       if (err){
           log(err);
       }
      
       db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){

           client.close();
           callback(error,data);
       })



    })
}

exports.deleteOne = function(collectionname,json,callback){
    
    _connectDb(function(err,db,client){

       if (err){
           log(err);
       }
      
       db.collection(collectionname).deleteOne(json,function(error,data){
  
           client.close();
           callback(error,data);
       })



    })
}

