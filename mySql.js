//导入所需模块  
var mysql=require("mysql");    
//导入配置文件  
//var cfg  =require("./config/db");  
var connection = mysql.createConnection({    
    host : 'localhost',  
    port : 3306,  
    database : 'XXX',  
    user : 'XXX',  
    password : 'XXX'  
}); 

connection.connect();

var insert=function(addSql,addSql_Params,callback){ 
	connection.query(addSql,addSql_Params,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        

       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');  
	});
//	connection.end();
};

module.exports=insert;   
