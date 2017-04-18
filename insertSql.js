var fs = require('fs')
const md5File = require('md5-file');
var query = require('./mysql.js');
//获取文件信息 文件名： 路径： MD5值：
function geFileList(path)
{
   var filesList = [];
   readFile(path,filesList);
   return filesList;
}

//遍历读取文件 path：要遍历的路径 filesList：数组，存储文件信息
function readFile(path,filesList)
{
   files = fs.readdirSync(path);//需要用到同步读取
   files.forEach(walk);

   function walk(file)
   { 
      states = fs.statSync(path+'/'+file);   //获取文件类型
      if(states.isDirectory())//文件夹
        {
            readFile(path+'/'+file,filesList);
        }
      else
       { 
          //创建一个对象保存信息
           var obj = new Object();
           obj.name = file;//文件名
           obj.path = path+'/'+file; //文件绝对路径
           obj.md5 = md5File.sync(obj.path) //文件MD5值
           filesList.push(obj);
       }  
  }
}

//写入文件utf-8格式
function writeFile(fileName,data)
{ 
   fs.writeFile(fileName,data,'utf-8',complete);
   function complete()
     {
      console.log("文件生成成功");
    } 
}

var filesList = geFileList("E:/work/安全项目/jarCheck");

var str='';
for(var i=0;i<filesList.length;i++)
{
   var item = filesList[i];
   // console.log(item)
   // var desc ="文件名:"+item.name + "   "
   //  +"路径:"+item.path+"   "
   //  +"md5值:"+item.md5;
   //  str+=desc +"\n"
    var  addSql = 'INSERT INTO checkproject(fileName,md5,path) VALUES(?,?,?)';
    var  addSql_Params = [item.name, item.md5, item.path];
    query(addSql,addSql_Params,function(err,vals,fields){    
        //其他信息  
        console.log(fields)
    });  

}

//writeFile("test.txt",str);
