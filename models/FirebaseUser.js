var db=require('../dbconnection'); //reference of dbconnection.js
 
var FirebaseUser={

 registerUser:function(FirebaseUser,callback) {
  return db.query("insert into user values(?,?)",[FirebaseUser.uid,FirebaseUser.email]);
 },

 getAllUsers:function(callback){
  return db.query("Select * from user",callback);
  },
};
 module.exports=FirebaseUser;