// 加载 Express Web 框架
var express = require('express');

// 获取框架应用
var app = express();

// 加载文件操作工具
var fs = require('fs');

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

app.use(express.static('asset'));

app.get('/*', function(request, response){
	response.sendFile(__dirname + '/view/index.html');
});

app.post('/publish', urlencodedParser, function(request, response){
	// 定义写入数据 SQL 语句
	var sql = 'INSERT INTO message(username,content,addtime) VALUES(?,?,?)';

	// 当前时间戳
	var timestamp = new Date().getTime();

	// 定义需要写入的数据
	var parmas = [request.body.username, request.body.content, timestamp];

	// 写入数据
	connection.query(sql,parmas,function (err, result) {
        response.redirect('/');
    });
});

app.post('/load', function(request, response){
	var  sql = 'SELECT * FROM message order by id asc limit 20';

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