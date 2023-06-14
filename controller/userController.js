// 用户名查重
exports.userNameOccupy = async (req, res, next) => {
    try {
        // 处理请求
        // 1.获取请求体数据
        console.log(req.body);
        // 2.数据验证
        // 3.验证通过，将数据保存到数据库
        // 4.发送成功响应
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 手机号查重
exports.phoneOccupy = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 邮箱查重
exports.emailOccupy = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 用户注册
exports.register = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 电话号码登录
exports.phoneLogin = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 邮箱登录
exports.emailLogin = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 查询用户信息
exports.userInfo = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
};

// 修改用户信息
exports.modifyUserMessage = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
}

// 修改用户密码
exports.modifyPassword = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
}

// 忘记密码
exports.forgetPassword = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
}

// 退出登录
exports.logout = async (req, res, next) => {
    try {
        // 处理请求
        res.send("hello");
    } catch (err) {
        next(err);
    }
}