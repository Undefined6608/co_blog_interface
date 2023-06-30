/******************导入依赖***********************/
// 导入express
const express = require('express');
// 导入日志输出
const {logger, sessionSecret} = require("./config/connfig.default");
// 导入morgan
const morgan = require('morgan');
// 导入router
const router = require('./router');
// 导入错误处理中间件
const errorHandler = require('./middleware/error-handler');
// 导入cors
const cors = require('cors');
// 导入session
const session = require('express-session');
/*****************创建配置信息**********************/
// 创建express对象
const app = express();
// 定义允许跨域请求的请求源地址列表
const allowedOrigins = [
    'http://192.168.126.1:3000',
    'http://localhost:3000',
    'http://39.101.72.168',
    'http://127.0.0.1',
    'http://localhost'
];

// 挂载cors实现跨域
app.use(cors({
    origin: (origin, callback) => {
        // 检查请求的来源是否在允许的列表中
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('不允许的来源'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的请求方法
    credentials: true // 允许携带凭证（如 Cookie）
}));

// 挂载session
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // session 的过期时间
        // secure: true // https中使用
    }
}))
//挂载morgan进行监听请求并输出
app.use(morgan('dev'));
// 创建PORT变量，判断是否存在运行时指定的端口号，如果存在则使用，否则，则使用默认的3000 端口
const PORT = process.env.PORT || 4001;
// 配置和挂载解析body请求体方法
app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '20mb'}));
// 挂载router,所有的请求都以/api开头
app.use('/api', router);
// 挂载统一处理服务器错误的中间件
app.use(errorHandler());

/***************开启项目端口监听**********************/
app.listen(PORT, () => {
    logger.info(`app is running at port=${PORT}`);
});