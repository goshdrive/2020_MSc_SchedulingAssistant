
const mongoose = require('mongoose');



//2, establish link
mongoose.connect('mongodb://127.0.0.1:27017/clinicianschedule',{ 
    useNewUrlParser: true,useUnifiedTopology: true  },function(err){


      if (err){
          console.log(err);
      }

      console.log('connect successfully');

})


module.exports = mongoose;