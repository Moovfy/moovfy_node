var express = require('express');
 var router = express.Router();
 var FirebaseUser=require('../models/FirebaseUser');

 router.post('/register',function (req,res,next) {
     FirebaseUser.registerUser(req.body,function(err,count){
         if(err)
         {
             res.json(err);
         }
         else{
             res.json(req.body);//or return count for 1 &amp;amp;amp; 0
         }
     });
 });
 
router.get('/users',function(req,res,next){
 
FirebaseUser.getAllUsers(function (err,rows) {
    if(err)
    {
        res.json(err);
    }
    else {
        res.json(rows);
    }
});
});
 module.exports=router;