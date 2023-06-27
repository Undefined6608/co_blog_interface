const {resultType, SUCCESS, FAIL} = require("../model");
exports.addImg = async (req, res, next) => {
    try {
        const userInfo = req.session.user;
        if (!userInfo) return res.send(resultType(FAIL, "权限错误", null));
        res.send(resultType(SUCCESS, "保存成功", [{
            url: "http://39.101.72.168:81/image/icon.jpg"
        }]))
    } catch (err) {
        next(err);
    }
}