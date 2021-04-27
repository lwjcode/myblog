var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

//将路由文件引入
var route = require('./routes/index');

//设置端口
var port = process.env.PORT || 3000;

var app = express();

//设置试图的根目录
app.set('views', './views/pages');

//设置试图的模板引擎
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//设置静态资源路径
app.use(express.static('./static'));

// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json
app.use(bodyParser.json());

//设置session和cookie
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'testapp',
  resave: false,
  saveUninitialized: true,
}));

//监听端口
app.listen(port);

console.log('Server is runnng on ' + port);

//连接mongodb数据库
mongoose.Promise = global.Promise;  //不加这句会报错
mongoose.connect('mongodb://127.0.0.1/myblog', { useNewUrlParser: true })
  .then(() => {
    console.log('Mongoose connection to Mongodb successfully!');
  }).catch((err) => {
    console.log(`Mongoose connection error: ${err}`);
  });

route(app);  //初始化所有路由


