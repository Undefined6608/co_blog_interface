const crypto = require('crypto');
const {illegalRegExp, phoneRegExp, emailRegExp, privateKey} = require("../config/connfig.default");
// 导入multer用于处理图片
const multer  = require('multer');
const path = require("path");

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
// 上传图片
// 设置存储位置和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // 指定存储目录 本地
        // cb(null, '/home/images/'); // 指定存储目录 服务器
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // 使用时间戳作为文件名
    }
});

const uploadImgUtil = multer({storage});

const encryption = (pwd) => md5Hash(md5Hash(pwd) + privateKey);

module.exports = {
    illegalCharacter,
    phoneCharacter,
    emailCharacter,
    encryption,
    uploadImgUtil
}