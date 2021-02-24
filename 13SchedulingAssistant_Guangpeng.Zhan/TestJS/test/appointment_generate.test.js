var DB = require('../../modules/db.js');
var expect = require("chai").expect;
var isodate = require('isodate');
var app = require('../../app.js')
var request = require('supertest');
var appointment_generate = require('../lib/appointment_generate')
var supertest = require('supertest');

const  userCredentials = {
    email: '1@google.com', 
    password: '123'
  }
var authenticatedUser = request.agent(app);

api = supertest('http://localhost:8010/login')

describe('User', function() {

  it('should return a response with HTTP code 200', function(done) {
    api.get('').expect(302, done);
  });

});

// before(function(done){
//     authenticatedUser
//       .post('/login')
//       .send(userCredentials)
//       .end(function(err, response){
//         expect(response.statusCode).to.equal(200);
//         expect('Location', '/profile');
//         done();
//       });
//   });


// describe('login and logout functions',function(){

//     it('should return a 200 response if the user is logged in', function(done){
//         authenticatedUser.get('/profile')
//         .expect(200, done);
//       });
    
      
//       it('should return a 302 response and redirect to /login', function(done){
//         request(app).get('/profile')
//         .expect('Location', '/login')
//         .expect(302, done);
//       });


// })



//testing appointment generation functions and webpage load 
// describe("appoinment generate functions",function(){

        


//         //test the remaining working days of random clinician
//         describe('getRemain1()',function(){

//             it ('shoule print uncertain clinician remaining working days',function(){


//                 appointment_generate.getRemain1(new DB.ObjectID("5f4d208eaed033408c0e7787"),12,10,function(err,result){

//                     if (err){
//                         console.log(err);
//                     }
//                     console.log(result);
//                     expect(result).to.be.a('number');
//                 })


//             })

//         });

//         //test whether a list of random clinician could be generated
//         describe('getAvaliableClinicians()',function(){
//             it ('should print several clinicians',function(){

//             appointment_generate.getAvaliableClinicians(isodate("2020-12-02T01:30:00Z"),function(err,result){


//                 if(err){
//                     console.log(err);
//                 }
                

//                 expect(result).to.be.an('Array')

//             })



//             })

//         })

//         //test whethe a list of four recommended appointment time can be generate

//         describe('getAvaliableappoint_time',function(){
//             it('should print a list of four recommend appointment time',function(){


//                 appointment_generate.getAvaliableappoint_time(isodate("2020-12-02T01:30:00Z"),function(err,result){


//                     if (err){
//                         console.log(err);
//                     }

//                      expect(result).to.be.an('Array')
//                      expect(result.length).to.be.equal(4);

//                 })



//             })

//         })
        





// });

//test



//testing appointment generation functions


