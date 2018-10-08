var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'localhost',
 user:'root',
 password:'admin123',
 database:'moovfy'
 
});
 module.exports=connection;