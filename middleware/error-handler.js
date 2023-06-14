const {logger} = require("../config/connfig.default");
module.exports = () => {
    return (err, req, res, next) => {
        logger.error(err);
        res.status(500).json({
            error:"信息错误！"
        })
    }
}