//导入express
const express = require('express');
// 创建router对象
const router = express.Router();
// 用户相关路由
router.use('/user', require('./userRouter'));
// 文章相关路由
router.use('/article',require('./articleRouter'));
// 上传相关路由
router.use('/upload',require('./uploadRouter'));

module.exports = router