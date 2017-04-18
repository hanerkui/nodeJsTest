var query = require('./mysql.js');

var  addSql = 'INSERT INTO checkproject(ID,PNode,qic001) VALUES(3,?,?)';
var  addSql_Params = ['123', '123'];
query(addSql,addSql_Params,function(err,vals,fields){    
    console.log(fields)
} 
); 
