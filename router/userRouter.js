//导入express
const express = require('express');
// 导入控制器
const userCtrl = require('../controller/userController');
// 创建router对象
const router = express.Router();
// 用户名查重
router.post('/userNameOccupy', userCtrl.userNameOccupy);

// 手机号查重
router.post('/phoneOccupy', userCtrl.phoneOccupy);

// 邮箱查重
router.post('/emailOccupy', userCtrl.emailOccupy);

// 用户注册
router.post('/register', userCtrl.register);

// 电话号码登录
router.post('/phoneLogin', userCtrl.phoneLogin);

// 邮箱登录
router.post('/emailLogin', userCtrl.emailLogin);

// 查询用户信息
router.get('/userInfo', userCtrl.userInfo);

// 修改用户信息
router.put('/userMessage', userCtrl.modifyUserMessage);

// 修改用户密码
router.put('/modifyPassword', userCtrl.modifyPassword);

// 忘记密码
router.post('/forgetPassword', userCtrl.forgetPassword);

// 退出登录
router.post('/logout', userCtrl.logout);

module.exports = router