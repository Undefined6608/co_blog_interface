const {resultType, SUCCESS, FAIL} = require("../model");
const {logger} = require("../config/connfig.default");
exports.addImg = async (req, res, next) => {
    try {
        // 文件名可以通过 req.file.filename 获取
        const filename = req.file.filename;
        logger.warn(filename);
        res.send(resultType(SUCCESS, "保存成功", [{
            url: "http://39.101.72.168:83/" + filename
        }]))
    } catch (err) {
        next(err);
    }
}