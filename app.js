/******************导入依赖***********************/
// 导入express
const express = require('express');
// 导入日志输出
const {logger} = require("./config/connfig.default");
// 导入morgan
const morgan = require('morgan');
// 导入cors
const cors = require('cors');
// 导入router
const router = require('./router');
// 导入错误处理中间件
const errorHandler = require('./middleware/error-handler');
/*****************创建配置信息**********************/
// 创建express对象
const app = express();
//挂载morgan进行监听请求并输出
app.use(morgan('dev'));
// 创建PORT变量，判断是否存在运行时指定的端口号，如果存在则使用，否则，则使用默认的3000 端口
const PORT = process.env.PORT || 3000;
// 配置和挂载解析body请求体方法
app.use(express.json());
app.use(express.urlencoded());
// 挂载cors用于跨域
app.use(cors());
// 挂载router,所有的请求都以/api开头
app.use('/api', router);

// 挂载统一处理服务器错误的中间件
app.use(errorHandler());

/***************开启项目端口监听**********************/
app.listen(PORT, () => {
    logger.info(`app is running at port=${PORT}`);
});