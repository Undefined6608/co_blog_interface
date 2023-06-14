const crypto = require('crypto');
const {illegalRegExp, phoneRegExp, emailRegExp, privateKey} = require("../config/connfig.default");

// 验证非法字符
const illegalCharacter = (...str) => {
    let bool = true;
    str.forEach((value) => {
        bool = illegalRegExp.test(value)
    })
    return bool;
}
// 验证电话号码格式
const phoneCharacter = (str) => {
    return !phoneRegExp.test(str)
}
// 验证邮箱格式
const emailCharacter = (str) => {
    return !emailRegExp.test(str)
}

// 密码加密
function md5Hash(password) {
    const hash = crypto.createHash('md5');
    hash.update(password);
    return hash.digest('hex');
}

const encryption = (pwd) => md5Hash(md5Hash(pwd) + privateKey);

module.exports = {
    illegalCharacter,
    phoneCharacter,
    emailCharacter,
    encryption
}