//导入express
const express = require('express');
const {logger} = require("../config/connfig.default");
// 创建router对象
const router = express.Router();
// 获取文章
router.get('/getArticle', async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello")
    } catch (err) {
        logger.error('/userNameOccupy',err)
        next(err);
    }
});

module.exports = router