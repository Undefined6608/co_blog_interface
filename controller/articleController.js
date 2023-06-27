const iconv = require('iconv-lite');
// 用户名查重
const {resultType, FAIL, SUCCESS} = require("../model");
const {
    articleTypeSQL,
    articleListSQL,
    articleMsgSQL,
    isArticleTypeSQL,
    addArticleSQL
} = require("../model/articleModel");
const {logger} = require("../config/connfig.default");
const {illegalCharacter} = require("../util");
const e = require("express");

/**
 * 获取文章类型
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.getArticleType = async (req, res, next) => {
    try {
        // 1.查询类型数据
        const articleType = await articleTypeSQL();
        // logger.warn(articleType);
        if (articleType.length <= 0) return res.send(resultType(FAIL, "数据获取失败，请联系管理员！"));
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "成功", {articleTypeList: articleType}));
    } catch (err) {
        next(err);
    }
};

/**
 * 获取文章列表
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.getArticleList = async (req, res, next) => {
    try {

        if (!req.query.typeId) return res.send(resultType(FAIL, "参数错误，请检查"));
        if (illegalCharacter(req.query.typeId)) return res.send(resultType(FAIL, "参数中含有非法字符"));
        // 1.查询类型数据
        const articleList = await articleListSQL(req.query.typeId);
        // logger.warn(articleType);
        if (articleList.length <= 0) return res.send(resultType(FAIL, "数据不存在，请联系管理员！"));
        // logger.warn(articleList);
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "成功", {
            articleList: articleList.map((value, index, array) => {
                if (value.article_visible === 0) return null;
                return {
                    id: value.id,
                    userName: value.user_name,
                    read: value.readed,
                    title: value.title,
                    context: value.context.length < 40 ? value.context : value.context.substring(0, 40).replace(/[#\[\]<>`]|(TOC)/g, ''),
                    date: value.date,
                    icon: value.icon
                }
            })
        }));
    } catch (err) {
        next(err);
    }
};

/**
 * 获取文章详细信息
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.getArticleMsg = async (req, res, next) => {
    try {
        if (!req.query.articleId) return res.send(resultType(FAIL, "参数错误，请检查"));
        if (illegalCharacter(req.query.articleId)) return res.send(resultType(FAIL, "参数中含有非法字符"));
        // 1.查询类型数据
        const articleMsg = await articleMsgSQL(req.query.articleId);
        // logger.warn(articleMsg)
        if (articleMsg.length <= 0) return res.send(resultType(FAIL, "数据不存在，请联系管理员！"));
        if (articleMsg[0].article_visible === 0) return res.send(resultType(FAIL, "文章禁止访问！"));
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "成功", {
            id: articleMsg[0].id,
            userName: articleMsg[0].user_name,
            read: articleMsg[0].readed,
            title: articleMsg[0].title,
            context: articleMsg[0].context,
            date: articleMsg[0].date,
            icon: articleMsg[0].icon
        }));
    } catch (err) {
        next(err);
    }
}

/**
 * 添加文章
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.addArticle = async (req, res, next) => {
    try {
        const body = req.body;
        if (!body.articleContext || !body.articleType || !body.articleTitle || !body.icon) return res.send(resultType(FAIL, "数据为空，请检查！"));
        // 获取session里的用户信息
        const userInfo = req.session.user;
        if (!userInfo) return res.send(resultType(FAIL,"请先登录"));
        // console.log(userInfo);
        if (userInfo.limits !== 0 && userInfo.limits !== 1) return res.send(resultType(FAIL, "您没有权限添加文章！", null));
        if (illegalCharacter(body.articleType) || illegalCharacter(body.articleTitle) || illegalCharacter(body.userId) || illegalCharacter(body.icon)) return res.send(resultType(FAIL, "数据中含有非法字符！"));
        const temp = await isArticleTypeSQL(body.articleType * 1);
        if (!temp) return res.send(resultType(FAIL, "您选择的类型错误，请重新选择！"));
        const date = new Date();
        const articleContext = iconv.encode(body.articleContext,'utf-8').toString();
        const articleInfo = {
            userID: userInfo.uid,
            articleType: body.articleType,
            articleTitle: body.articleTitle,
            articleContext: articleContext,
            date: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay(),
            icon: body.icon
        }
        const addCode = await addArticleSQL(articleInfo);
        // logger.warn(addCode);
        if (!addCode||addCode.affectedRows===0) return res.send(resultType(FAIL,"保存失败，请检查后重试！"));
        res.send(resultType(SUCCESS,"保存成功！"));
    } catch (err) {
        next(err);
    }
}