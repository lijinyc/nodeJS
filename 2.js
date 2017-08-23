/**
 * Created by lijin on 17/8/12.
 */

var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring=require('querystring');

var num=[
    {con:'内容1',help:0,step:0,id:1},
    {con:'内容2',help:0,step:0,id:2},
    {con:'内容3',help:0,step:0,id:3},
    {con:'内容4',help:0,step:0,id:4},
    {con:'内容5',help:0,step:0,id:5},
    {con:'内容6',help:0,step:0,id:6},
    {con:'内容7',help:0,step:0,id:7},
    {con:'内容8',help:0,step:0,id:8},
    {con:'内容9',help:0,step:0,id:9},
    {con:'内容10',help:0,step:0,id:10},
    {con:'内容11',help:0,step:0,id:11},
    {con:'内容12',help:0,step:0,id:12},
    {con:'内容13',help:0,step:0,id:13},
    {con:'内容14',help:0,step:0,id:14},
    {con:'内容15',help:0,step:0,id:15},
    {con:'内容16',help:0,step:0,id:16},
];
var thisId=17;//添加数据的id从17开始进行递增
var server=http.createServer(function(req,res){
    var parseUrl=url.parse(req.url);
    var data=querystring.parse(parseUrl.query); //get方式取数据
    switch(parseUrl.pathname){
        case '/':
            readFile('indexOne.html',req,res);
            break;
        case '/js/ajax.js': //引入ajax.js文件，方便前端使用
            readFile('js/ajax.js',req,res);
            break;
        case '/indexOne':
             readFile('indexOne.html',req,res);
             break;
             
        case '/api/indexOne': //显示列表
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            });  
            //console.log('显示：'+parseInt(data.val))
            var sliceNum=num.slice(parseInt(data.thisPag)*parseInt(data.val),
            					   parseInt(data.thisPag)*parseInt(data.val)+parseInt(data.val));
            res.end(JSON.stringify(sliceNum));
            break;

       
        case '/help':  //点击赞
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            }); 
            //var data=querystring.parse(parseUrl.query);   获取前端查询的消息
            //num[data.index].help=num[data.index].help+1;   用前端获取到的点赞数量+1 
            //res.end(JSON.stringify(num));将最终的数据转换为字符串返回给前端
            
            num.forEach(function(value,index){
            	if(data.winThisId==value.id){
            		value.help++;	
            	}
            });
            res.end('{}');
            break;

        
        case '/step': //点击踩
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            }); 
            //循环数组
            num.forEach(function(value,index){
            	//将前端传进来的id和当前循环数据的id进行比较，如果相等那么就将当前这条数据的踩+1
            	if(data.winThisId==value.id){
            		value.step++;
            	}
            });
            res.end('{}');//点踩不需要向前端传返回值
            break;

        
        case '/delete': //点击删除
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            });
            //在后端将对应的数据删除,splice(1,1);参数1:从什么地方开始删除,参数2:要删除的条数   
            num.forEach(function(value,index){ 
            	if(data.winThisId==value.id){            		 
            		 num.splice(index,1);
            	}
            })
            res.end(JSON.stringify(num.length));
            break;

        
        case '/add':  //添加
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            });
            num.unshift({con:data.textaCon,help:0,step:0,id:thisId++});
            res.end(JSON.stringify(num));
            break;
        
        
        case '/pagingOne':  //分页 
          	var pages=Math.ceil(num.length/data.val);   
        	res.end(JSON.stringify(pages));//将总页数传给前端页面
        	break;
        	
        default:
            res.writeHead(404,{
                'content-type':'text/html;charset=utf-8'
            });
            readFile('404.html',req,res);
            break;
    }
}).listen(8080,'0.0.0.0');

function readFile(file,req,res){
    var htmlSrc=__dirname+'/'+file;

    fs.readFile(htmlSrc,function(err,data){
        if(err){
            readFile('404.html',req,res);
        }else{
            res.writeHead(200,{
                'content-type':'text/html;charset=utf-8'
            });
            //console.log(data.toString());
            res.end(data);
        }
    });
}


