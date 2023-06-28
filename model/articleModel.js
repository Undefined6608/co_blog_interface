/**********************************导入依赖*******************************************/
// 导入mysql驱动
const mysql = require('mysql2/promise');
const {db} = require("../config/connfig.default");
/************************************搭建连接池***************************************************/
// 创建数据库连接池
const pool = mysql.createPool(db());
/***************************************sql方法***************************************************/
/**
 * 查询文章类型
 * @returns {Promise<boolean>}
 */
const articleTypeSQL = async () => {
    const [result, _] = await pool.execute('SELECT * FROM article_type ORDER BY `order`');
    return result;
}

/**
 * 获取文章列表
 * @param typeID
 * @returns {Promise<*>}
 */
const articleListSQL = async (typeID) => {
    const [result, _] = await pool.execute('SELECT sys_user.user_name, article.* FROM article JOIN sys_user ON sys_user.uid=article.user_id WHERE article.type_id=?', [typeID]);
    return result;
}

/**
 * 获取文章详细信息
 * @param articleID
 * @returns {Promise<*>}
 */
const articleMsgSQL = async (articleID) => {
    const [result, _] = await pool.execute('SELECT sys_user.user_name, article.* FROM article JOIN sys_user ON sys_user.uid=article.user_id WHERE article.id=?', [articleID]);
    return result;
}

/**
 * 获取类型是否存在
 * @param articleTypeID
 * @returns {Promise<*>}
 */
const isArticleTypeSQL = async (articleTypeID) => {
    const [result, _] = await pool.execute('SELECT * FROM article_type WHERE id=?', [articleTypeID]);
    return result;
}

const addArticleSQL = async (articleInfo) => {
    console.log(articleInfo);
    const [result, _] = await pool.execute('INSERT INTO article (type_id, user_id, title, context, date, icon) VALUES (?, ?, ?, ?, ?, ?)', [articleInfo.articleType, articleInfo.userID, articleInfo.articleTitle, articleInfo.articleContext, articleInfo.date, articleInfo.icon]);
    return result;
}

const addReadSQL = async (articleID) => {
    const [result, _] = await pool.execute(`UPDATE article SET readed = readed + 1 WHERE id= ?`, [articleID]);
    return result;
}

const getCommitsSQL = async (articleID) => {
    const [result, _] = await pool.execute(`SELECT sys_user.user_name,sys_user.integral,sys_user.member,sys_user.head_sculpture, comments.id, comments.context FROM comments JOIN sys_user ON sys_user.uid=comments.user_id WHERE comments.article_id=? ORDER BY comments.id DESC`, [articleID]);
    return result;
}

const addCommitsSQL = async (commitBody) => {
    const [result, _] = await pool.execute(`INSERT INTO comments (user_id, article_id, context) VALUES (?, ?, ?)`, [commitBody.userId, commitBody.articleId, commitBody.context]);
    return result;
}

module.exports = {
    articleTypeSQL,
    articleListSQL,
    articleMsgSQL,
    isArticleTypeSQL,
    addArticleSQL,
    addReadSQL,
    getCommitsSQL,
    addCommitsSQL
}