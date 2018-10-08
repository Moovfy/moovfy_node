var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'10.4.41.143',
 user:'root',
 password:'admin123',
 database:'moovfy'
 
});
 module.exports=connection;