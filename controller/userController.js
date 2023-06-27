const {illegalRegExp, logger} = require("../config/connfig.default");
const {illegalCharacter, phoneCharacter, emailCharacter} = require("../util");
const {resultType, FAIL, SUCCESS} = require("../model");
const {occupySQL, registerSQL, phoneLogin, ban, selectBan, emailLogin} = require("../model/userModel");

// 用户名查重
exports.userNameOccupy = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        // logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 判断是否为空
        if (!body.username) return res.send(resultType(FAIL, "用户名为空"));
        // 判断是否含有非法字符
        if (illegalCharacter(body.username)) return res.send(resultType(FAIL, "用户名中含有非法字符"));
        // 3.验证通过，通过查找数据库判断是否重复
        if (await occupySQL('user_name', body.username)) return res.send(resultType(FAIL, "用户名重复!"));
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "可以使用"));
    } catch (err) {
        next(err);
    }
};

// 手机号查重
exports.phoneOccupy = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        // logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 判断是否为空
        if (!body.phone) return res.send(resultType(FAIL, "电话号码为空"));
        // 判断是否含有非法字符
        if (illegalCharacter(body.phone)) return res.send(resultType(FAIL, "信息中含有非法字符"));
        // 判断电话号码格式是否正确
        if (phoneCharacter(body.phone)) return res.send(resultType(FAIL, "电话号码格式错误！"));
        // 3.验证通过，通过查找数据库判断是否重复
        if (await occupySQL('phone', body.phone)) return res.send(resultType(FAIL, "电话号码重复!"));
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "可以使用"));
    } catch (err) {
        next(err);
    }
};

// 邮箱查重
exports.emailOccupy = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        // logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 判断是否为空
        if (!body.email) return res.send(resultType(FAIL, "邮箱为空"));
        // 判断是否含有非法字符
        if (illegalCharacter(body.email)) return res.send(resultType(FAIL, "信息中含有非法字符"));
        // 判断邮箱格式是否正确
        if (emailCharacter(body.email)) return res.send(resultType(FAIL, "邮箱格式错误！"));
        // 3.验证通过，通过查找数据库判断是否重复
        if (await occupySQL('email', body.email)) return res.send(resultType(FAIL, "邮箱重复!"));
        // 4.发送成功响应
        res.send(resultType(SUCCESS, "可以使用"));
    } catch (err) {
        next(err);
    }
};

// 发送验证码
exports.emailCode = async (req, res, next) => {
    try {

    }catch (err){

    }
}

// 用户注册
exports.register = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 判断是否为空
        if (!body.username || !body.password || !body.phone || !body.email) return res.send(resultType(FAIL, "信息为空，请补全后再注册！！！"));
        // 判断是否含有非法字符
        if (illegalCharacter([body.username, body.password, body.phone, body.email])) return res.send(resultType(FAIL, "信息中含有非法字符"));
        // 验证电话号码格式
        if (phoneCharacter(body.phone)) return res.send(resultType(FAIL, "电话号码格式错误!"));
        // 验证邮箱格式
        if (emailCharacter(body.email)) return res.send(resultType(FAIL, "邮箱格式错误!"));
        // 判断用户名重复
        if (await occupySQL('user_name', body.username)) return res.send(resultType(FAIL, "用户名重复!"));
        // 判断手机号重复
        if (await occupySQL('phone', body.phone)) return res.send(resultType(FAIL, "手机号已被注册！"));
        // 判断邮箱重复
        if (await occupySQL('email', body.email)) return res.send(resultType(FAIL, "邮箱已被注册！"));
        // 3.验证通过，向数据库里添加用户
        const insertCount = await registerSQL(body);
        // 4.发送成功响应
        // logger.warn(insertCount);
        if (insertCount.serverStatus !== 2) return res.send(resultType(FAIL, "注册失败！"));
        res.send(resultType(SUCCESS, "注册成功"));
    } catch (err) {
        next(err);
    }
};

// 电话号码登录
exports.phoneLogin = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        // logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 返回账号/密码为空提示
        if (!body.phone || !body.password) return res.send(resultType(FAIL, "电话号码/密码为空！"));
        // 判断用户协议是否同意
        if (!body.remember === 0) return res.send(FAIL, "请同意用户协议！");
        // 返回格式错误信息
        if (phoneCharacter(body.phone)) return res.send(resultType(FAIL, "电话号码格式错误！"));
        // 判断是否含有非法字符，如果有，则进行封禁操作
        if (illegalCharacter(body.phone) || illegalCharacter(body.password)) {
            // 判断手机号是否存在
            if (!await occupySQL('phone', body.phone.replace(illegalRegExp, ''))) return res.send(resultType(FAIL, "电话号码不存在！"));
            // 执行封禁的SQL
            const banStatus = await ban('phone', body.phone.replace(illegalRegExp, ''));
            if (banStatus.serverStatus !== 2) return res.send(resultType(FAIL, "封禁失败！"));
            const banCount = await selectBan('phone', body.phone.replace(illegalRegExp, ''));
            // 返回信息
            return res.send(resultType(FAIL, banCount < 3 ? "您的操作是违法行为，请停止您的操作，否则您的账号将在：" + (3 - banCount) + "次后被封禁" : "您的账号已被封禁"));
        }
        // 验证账号是否已被封禁
        const banCount = await selectBan('phone', body.phone.replace(illegalRegExp, ''));
        if (banCount >= 3) return res.send(resultType(FAIL, "您的账号已被封禁！请联系管理员解封！"));
        // 3.验证通过，向数据库里添加用户
        const userInfo = await phoneLogin(body.phone, body.password);
        // 4.验证用户是否存在
        if (userInfo.length === 0) return res.send(resultType(FAIL, "电话号码/密码错误！"));
        // logger.warn(userInfo);
        // 存储登录状态
        req.session.user = userInfo[0];
        // 发送成功响应
        res.send(resultType(SUCCESS, "登录成功"));
    } catch (err) {
        next(err);
    }
};

// 邮箱登录
exports.emailLogin = async (req, res, next) => {
    try {
        // 1.获取请求体数据
        // logger.info(req.body);
        const body = req.body;
        // 2.数据验证
        // 返回账号/密码为空提示
        if (!body.email || !body.password) return res.send(resultType(FAIL, "邮箱/密码为空！"));
        // 判断用户协议是否同意
        if (!body.remember === 0) return res.send(FAIL, "请同意用户协议！");
        // 返回格式错误信息
        if (emailCharacter(body.email)) return res.send(resultType(FAIL, "邮箱格式错误！"));
        // 判断是否含有非法字符，如果有，则进行封禁操作
        if (illegalCharacter(body.email) || illegalCharacter(body.password)) {
            // 判断手机号是否存在
            if (!await occupySQL('email', body.email.replace(illegalRegExp, ''))) return res.send(resultType(FAIL, "邮箱不存在！"));
            // 执行封禁的SQL
            const banStatus = await ban('email', body.email.replace(illegalRegExp, ''));
            if (banStatus.serverStatus !== 2) return res.send(resultType(FAIL, "封禁失败！"));
            const banCount = await selectBan('email', body.email.replace(illegalRegExp, ''));
            // 返回信息
            return res.send(resultType(FAIL, banCount < 3 ? "您的操作是违法行为，请停止您的操作，否则您的账号将在：" + (3 - banCount) + "次后被封禁" : "您的账号已被封禁"));
        }
        // 验证账号是否已被封禁
        const banCount = await selectBan('email', body.email.replace(illegalRegExp, ''));
        if (banCount >= 3) return res.send(resultType(FAIL, "您的账号已被封禁！请联系管理员解封！"));
        // 3.验证通过，向数据库里添加用户
        const userInfo = await emailLogin(body.email, body.password);
        // 4.验证用户是否存在
        if (userInfo.length === 0) return res.send(resultType(FAIL, "邮箱/密码错误！"));
        // logger.warn(userInfo);
        // 存储登录状态
        req.session.user = userInfo[0];
        // 发送成功响应
        res.send(resultType(SUCCESS, "登录成功"));
    } catch (err) {
        next(err);
    }
};

// 查询用户信息
exports.userInfo = async (req, res, next) => {
    try {
        // 获取session里的用户数据
        const user = req.session.user;
        // 权限验证
        if (!user) return res.send(resultType(FAIL, "权限错误，无法获取系统信息！"));
        // 获得权限，返回数据
        // logger.info(user);
        res.send(resultType(SUCCESS, "查询成功", {
            username: user.user_name, // 用户名
            head_sculpture: user.head_sculpture,// 用户头像
            email: user.email, // 邮箱
            phone: user.phone, // 电话号码
            limits: user.limits, // 用户权限
            integral: user.integral, // 积分
            member: user.member // 会员
        }));
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
        req.session.destroy((err) => {
            if (err) return res.send(resultType(FAIL, err));
            res.send(resultType(SUCCESS, "退出成功"));
        })
    } catch (err) {
        next(err);
    }
}