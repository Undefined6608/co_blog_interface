//导入express
const express = require('express');
const {uploadImgUtil} = require("../util");
const {addImg} = require("../controller/uploadController");
// 创建router对象
const router = express.Router();

router.post('/img',uploadImgUtil.single('image'),addImg);

module.exports = router