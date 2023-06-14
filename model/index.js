// 响应值
const SUCCESS = 200;
const FAIL = 404;
// 返回值模型
const resultType = (code, msg, data = null) => {
    return {
        code: code,
        msg: msg,
        data: data
    }
}

module.exports = {
    SUCCESS,
    FAIL,
    resultType
}