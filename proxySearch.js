/*
npm install -g superagent
npm install -g superagent-charset
npm install -g superagent-proxy
npm install -g cheerio
*/

var cheerio = require('cheerio');
var fs = require('fs');

//SA初始化
var SA = require('superagent');
var SAcharset = require('superagent-charset');
var SAproxy = require('superagent-proxy');
SAcharset(SA);
SAproxy(SA);

var proxy_list = [], data = {};
var savePath = './proxy.json'
var get_num = 0;
var check_num_http = 0;
var check_num_https = 0;
var success_num_http = 0;
var success_num_https = 0;

function getRequest(url, callback){
	var charset = 'utf8'
    var osa = SA.get(url);
    
    // 设置动态代理
    if(data && data.http && data.http.length)
    {
        osa = osa.proxy(data.http[data.http.length - 1]);
    }
    osa.timeout(2000)
    .charset(charset)
    .end(function(err,res){
        if (!err){
        	console.log(res.statusCode)
            callback(res);
        }else{
            // console.log('retry get');
            /*
            setTimeout(function(){
                getRequest(url,callback,charset)
            },500);
            */
        }
    });
}

function clearLog(){
    fs.writeFileSync(savePath,'')
}

function loadLog(){
    content = fs.readFileSync(savePath)
    if (typeof(content)!="undefined" && content.length > 5){
        data = JSON.parse(content);
    }else{
        data = {
            http:[],
            https:[]
        };
    }
}

function addToFile(proxy){
	var type='http'
    if(type=='https'){
        data['https'].push(proxy)
    }else{
        data['http'].push(proxy)
    }
    var content = JSON.stringify(data);
    fs.writeFile(savePath, content, function(err){
        if(err){
            throw err;
        }
    });
}

function check_http(proxy){
    url = 'http://1212.ip138.com/ic.asp';
    proxy = 'http://'+proxy;
    console.log("Testing "+proxy+" HTTP ...");
    try{
        SA.get(url)
        .proxy(proxy)
        .timeout(5000)
        .end(function(err,res){
            if (typeof(res)!="undefined" && res.statusCode=="200"){
                console.log('SAVE '+ proxy +' HTTP');
                success_num_http++;
                addToFile(proxy,'http');
            }else{
                //console.log(err)
                console.log("Failed "+proxy+" HTTP");
            }
            check_num_http++;
            console.log("("+check_num_http+"/"+get_num+")")
        }); 
    }catch(e){
        console.log("CATCH ERROR");
        console.log(e);
    }
}

function check_https(proxy){
    url = 'https://www.google.com.hk';
    proxy = 'http://'+proxy;
    console.log("Testing "+proxy+" HTTPS ...");
    try{
        SA.get(url)
        .proxy(proxy)
        .timeout(5000)
        .end(function(err,res){
            if (typeof(res)!="undefined" && res.statusCode=="200"){
                console.log('SAVE '+ proxy +' HTTPS');
                success_num_https++;
                addToFile(proxy,'https');
            }else{
                //console.log(err)
                console.log("Failed "+proxy+" HTTPS");
            }
            check_num_https++;
            console.log("("+check_num_https+"/"+get_num+")")
            if (check_num_https == get_num){
                console.log({
                    'total check num':get_num
                    ,'http proxies num':success_num_http
                    ,'https proxies num':success_num_https
                });
                process.exit();
            }
        }); 
    }catch(e){
        console.log("CATCH ERROR");
        console.log(e);
    }
}

function getProxy(){
    var get_list = {
        "sslproxies": 30
    }

    //crawler http://www.sslproxies.org/
    if (get_list["sslproxies"]>0){
        for(var i=1;i<=get_list["sslproxies"];i++){
            var url = "http://www.sslproxies.org/"  
            getRequest(url,function(res){
                if(res.text){
                    var proxy_list = []
                    var $ = cheerio.load(res.text);

                    var trs = $("#proxylisttable tbody tr");                     
                    // trs = trs.slice(1);
                    for(var i=0;i<trs.length;i++){
                        var tr = $(trs[i]);
                        var proxy = tr.children('td').eq(0).text() +":"+ tr.children('td').eq(1).text();
                        console.log(proxy)
                        if(proxy.length>3){
                            proxy_list.push(proxy);
                        }
                    }
                    get_num += proxy_list.length;
                    proxy_list.forEach(function(proxy){
                        check_http(proxy);
                        check_https(proxy);
                    });
                }
            });
        }
    }
}
clearLog();
loadLog();
console.log("Successfully load log")
getProxy()

