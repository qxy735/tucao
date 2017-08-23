// 加载 Express Web 框架
var express = require('express');

// 获取框架应用
var app = express();

// 加载文件操作工具
var fs = require('fs');

// 加载获取 ip 工具
var ip = require('./asset/js/ip');

// 加载解析主体内容工具
var body_parser = require('body-parser');
var urlencodedParser = body_parser.urlencoded({ extended: false });

// 加载 Mysql 工具
var mysql = require('mysql');

// 定义数据库链接
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'tucao'
});

// 链接数据库
connection.connect();

// 绑定静态资源目录
app.use(express.static('asset'));

// 默认请求地址，显示首页页面
app.get('/*', function(request, response){
	response.sendFile(__dirname + '/view/index.html');
});

// 发布吐槽内容地址
app.post('/publish', urlencodedParser, function(request, response){
	// 定义写入数据 SQL 语句
	var sql = 'INSERT INTO message(username,content,ip) VALUES(?,?,?)';

	// 定义需要写入的数据
	var parmas = [request.body.username, request.body.content, ip.get_client_ip(request)];

	// 写入数据
	connection.query(sql,parmas,function (err, result) {
        response.redirect('/');
    });
});

// 加载吐槽内容地址
app.post('/load', function(request, response){
	var  sql = 'SELECT id,username,content FROM message order by id asc limit 20';

	connection.query(sql, function (err, result) {
		if(err){
			response.send('');
		}else{
			response.send(result);
		}
	});
});

// 启用 212 端口
app.listen(212, function(){});