var fs = require('fs')
const md5File = require('md5-file');

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
           // obj.size = states.size;//文件大小，以字节为单位
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

var filesList = geFileList("E:/work");


/*filesList.sort(sortHandler);
function sortHandler(a,b)
  {
   if(a.size > b.size)
     return -1;
   else if(a.size < b.size) return 1
     return 0;
  }
*/

var str='';
for(var i=0;i<filesList.length;i++)
{
   var item = filesList[i];
   var desc ="文件名:"+item.name + "   "
    // +"大小:"+(item.size/1024).toFixed(2) +"/kb"+" "
    +"路径:"+item.path+"   "
    +"md5值:"+item.md5;
    str+=desc +"\n"
}

writeFile("test.txt",str);
