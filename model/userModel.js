/**********************************导入依赖*******************************************/
// 导入mysql驱动
const mysql = require('mysql2/promise');
const {db} = require("../config/connfig.default");
const {encryption} = require("../util");
/************************************搭建连接池***************************************************/
// 创建数据库连接池
const pool = mysql.createPool(db());
/***************************************sql方法***************************************************/

/**
 * 判断查重方法
 * @param tag
 * @param value
 * @returns {Promise<boolean>}
 */
const occupySQL = async (tag, value) => {
    console.log(tag,value);
    const [result, _] = await pool.execute(`SELECT uid FROM sys_user where ${tag}=?`, [value]);
    return result.length !== 0;
}

/**
 * 注册账号方法
 * @param userInfo 用户信息
 * @returns {Promise<*>}
 */
const registerSQL = async (userInfo) => {
    // 将password进行加密
    userInfo.password = encryption(userInfo.password);
    // 调用sql语句进行向表内添加条目
    const [insert, _] = await pool.execute('INSERT INTO sys_user (user_name, password, phone, email) VALUES (?, ?, ?, ?)', [userInfo.username, userInfo.password, userInfo.phone, userInfo.email]);
    // 返回SQL执行后的返回值
    return insert
}

/**
 * 账号封禁方法
 * @param tag
 * @param val
 * @returns {Promise<*>}
 */
const ban = async (tag, val) => {
    // 向修改is_load字段
    const [banRes, _1] = await pool.execute(`UPDATE sys_user SET is_load = is_load+1 WHERE ${tag}=?`, [val]);
    return banRes;
}

/**
 * 查询封禁状态
 * @param tag
 * @param val
 * @returns {Promise<*>}
 */
const selectBan = async (tag, val) => {
    // 查询is_load字段值
    const [banStatus, _2] = await pool.execute(`SELECT is_load FROM sys_user WHERE ${tag}=?`, [val]);
    // 返回查询对象
    if (!banStatus[0]) return 0;
    return banStatus[0].is_load;
}

/**
 * 电话号码登录
 * @param phone
 * @param password
 * @returns {Promise<{msg: *, code: *, data: null}>}
 */
const phoneLogin = async (phone, password) => {
    password = encryption(password);
    const [result, _] = await pool.execute(`SELECT * FROM sys_user WHERE phone=? AND password=?`, [phone, password]);
    return result
}

/**
 * 邮箱登录
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
const emailLogin = async (email, password) => {
    password = encryption(password);
    const [result, _] = await pool.execute(`SELECT * FROM sys_user WHERE email=? AND password=?`, [email, password]);
    return result
}


module.exports = {
    occupySQL,
    registerSQL,
    ban,
    selectBan,
    phoneLogin,
    emailLogin
}