//导入express
const express = require('express');
// 创建router对象
const router = express.Router();
// 用户相关路由
router.use('/user', require('./userRouter'));
// 文章相关路由
router.use('/article',require('./articleRouter'));
// 评论相关路由

// 反馈相关路由

// 设置相关路由

module.exports = router