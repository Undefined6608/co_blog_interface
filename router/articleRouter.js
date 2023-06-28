//导入express
const express = require('express');
const {getArticleType, getArticleList, getArticleMsg, addArticle, addRead, getCommits, addCommits} = require("../controller/articleController");
// 创建router对象
const router = express.Router();
// 获取文章类型
router.get('/getArticleType', getArticleType);

// 获取文章列表
router.get('/getArticleList',getArticleList);

// 获取文章具体信息
router.get('/getArticleMsg',getArticleMsg);

// 添加文章
router.post('/addArticle',addArticle);

// 更新阅读量
router.post('/addRead',addRead);

// 查询评论
router.get('/getCommits',getCommits);

// 编写评论
router.post('/addCommits',addCommits);

module.exports = router