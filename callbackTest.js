var fs=require('fs');  
var mysql = require('./mysql');

function handlerError(err) {
  console.log('error: ' + err)
}

function readJson(path, callback) {
  fs.readFile(path, function(err, data) {
    if (err) {
      callback(err)
    } else {
      try {
        data = JSON.parse(data)
        callback(null, data)
      } catch (error) {
        callback(error)
      }
    }
  })
}

function getQic(data,callback){
	for(var key in data){
		callback(key,data[key])
	}
}

function query(value,callback){
	var oT = mysql.getConn({
	      host     : '***',
	      user     : '***',
	      password : '***',
	      database : '***'
	    }).query("select qic002,qic003 from qi01 where qic013 != '05' and not qic010 is null and qic001 = " + value , function(e,r,f)
	    {
	    	
	      r.forEach(function(val,index,arr){
	        var qic002 = val.qic002;
	        var qic003 = val.qic003;
	        var data = qic002 + '  ' + qic003;

	 		callback(data)
	        })
	    })
}

function getQicCallback(err,data){
	if(err){
		handlerError(err)
	}else{
		var JsonObj=JSON.stringify(data,undefined, 2);
		writeFile("test_json_after.json",JsonObj);
	}
}

function writeFile(fileName,data)
{ 
   fs.appendFile(fileName,data,'utf-8',complete);
   function complete()
     {
     	fs.appendFile(fileName,',','utf-8');
    } 
}

function readJsonCallback(err,data){
	if(err){
		handlerError(err)
	}else{
		getQic(data,function(key,value){
			query(key,function(file){
			value['file'] = file
			// console.log(value)
			var js = {};
			var t = js[key] || (js[key] = value);
			// console.log(js)
			getQicCallback(err,js)
			// writeFile('result.json',value)
		})
		})
	}
}


// readJson('test_json.txt',readJsonCallback);



function handleJs(g_js,callback){

	var g_q = {};

	for(var i in g_js)
	{	

		var path = gs[i].file;
		var projectID = path.split('/')[0];
	  	var details = {};
		details['file'] = [];

		
		var t = g_q[projectID] || (g_q[projectID] = details);

		var strs = path.split('/');
		var jarName = strs[strs.length-1];
		var component = gs[i].results[0].component;
		var version = gs[i].results[0].version;

		var jarDetails = 'jarName:' + jarName + ' version：' + version + ' component：' + component;

		t.jarName || (t.jarName = []);
		t.jarName.push(jarDetails);
				
	}
	callback(g_q)
}

    var gs = [{"file":"100000000000783/webapp/js/jquery.js","results":[{"version":"1.2.6","component":"jquery","detection":"filecontent","vulnerabilities":[{"info":["http://web.nvd.nist.gov/view/vuln/detail?vulnId=CVE-2011-4969",
	"http://research.insecurelabs.org/jquery/test/"],"severity":"medium","identifiers":{"CVE":["CVE-2011-4969"]}},{"info":["http://bugs.jquery.com/ticket/11290","http://research.insecurelabs.org/jquery/test/"],"severity":"medium","identifiers":{"bug":"11290","summary":"Selector interpreted as HTML"}}]}]}];

	handleJs(gs,function(data){
		// console.log(data);
		readJsonCallback(null,data)
	});

