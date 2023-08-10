// 导入log4js
const log4js = require("log4js");
const nodemailer = require("nodemailer");
// 配置log4js
log4js.configure({ // 复写配置信息
    appenders: { // 配置存储日志格式
        file: { // 配置存储类型
            type: 'file',// 配置存储类型为文件类型
            filename: 'logs/app.log', // 配置日志存储位置
            maxLogSize: 10 * 1024 * 1024, // 配置日志最大为10 MB
            backups: 3, // 超出最大大小，将保存备份，备份最大3个
            compress: true, // 启用Gzip压缩备份文件
            pattern: '-yyyy-MM-dd.log' // 保存日志写入时间戳
        },
        console: { // 配置控制台输出
            type: 'console', // 输出类型
        },
    },
    categories: { // 定义不同日志分类
        default: {appenders: ['file', 'console'], level: 'info'},// 配置默认分类
    }
});
// 实例化log4js对象
const logger = log4js.getLogger();

// 数据库连接配置
const db = () => {
    // 本地
    return {
        host: 'localhost', // 连接地址
        user: 'root', // 数据库用户名
        password: '555555', // 数据库密码
        database: 'co_blog' // 数据库名称
    }

    // 服务器
    /*return {
        host: '127.0.0.1', // 连接地址
        user: 'coblog', // 数据库用户名
        password: 'GiPpiJRCKemHHsFj', // 数据库密码
        database: 'coblog' // 数据库名称
    }*/
}

// 定义私钥
const privateKey = 'c38c77fc-a634-4eb5-9cc9-6c6eea76836c';
// session私钥
const sessionSecret = '8b9384dc-e348-4d00-a954-da1dbec8b296';
// 定义非法字符正则
const illegalRegExp=/(.*\=.*\-\-.*)|(.*(\+|-).*)|(.*\w+(%|\$|#|&)\w+.*)|(.*\|\|.*)|(.*\s+(and|or)\s+.*)|(.*\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|info|drop|execute)\b.*)/i;
// 定义手机号正则
const phoneRegExp = /^1[3456789]\d{9}$/;
// 定义邮箱正则
const emailRegExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

// 配置邮箱模块
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true, // use SSL
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: "169500081@qq.com",   //其他的不要动，更改邮箱
        pass: "XXXXXX",    // QQ邮箱需要使用的授权码
    },
});

// 抛出对象
module.exports = {
    logger,
    db,
    privateKey,
    sessionSecret,
    illegalRegExp,
    phoneRegExp,
    emailRegExp
}
