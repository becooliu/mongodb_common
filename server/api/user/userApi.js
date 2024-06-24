const models = require("../../model/db");

const express = require("express");
const router = express.Router();

const resData = {};

// 注册用户
router.post("/user/create", async (req, res) => {
  //let {username, pass} = ...req.body
  // console.log('req: ', req.body)
  try {
    const { username, password, nickname, email, sex, birthday } = req.body;
    let user = await models.userModel.findOne({ username });
    console.log('email', email)
    console.log("user: ", user);

    if (!user) {
      const newUser = new models.userModel({
        username,
        password,
        nickname,
        email,
        sex,
        birthday: new Date(birthday)
      });
      newUser
        .save()
        .then((result) => {
          resData.status = 200;
          resData.message = `账号：${username} 注册成功!`;
          res.json(resData);
        })
        .catch((err) => {
          resData.message = err;
          res.json(resData);
        });
    } else {
      resData.status = 220;
      resData.message = `账号已存在：${username}，请修改后重新注册。`;
      res.json(resData);
    }
  } catch (error) {
    console.log(error);
    resData.message = error;
    res.json(resData);
  }
});

// 用户登录
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let userInfo = await models.userModel.findOne({ username, password });
    console.log("user: ", userInfo);
    if (!userInfo) {
      resData.status = 230;
      resData.message = "用户不存在或密码错误，请确认。";
    } else {
      resData.status = 200;
      resData.message = "恭喜你，登录成功。";
      resData.username = username;
    }
    res.json(resData);
  } catch (error) {
    console.log(error);
    resData.message = error;
    res.json(resData);
  }
});

// 用户列表
router.get('/user/userlist', async(req, res) => {
  const currentPage = req?.query?.currentPage || 1
  const pageSize = req?.query?.pageSize || 10
  const skip = (currentPage && currentPage - 1) * pageSize

  let totalCount = 0
  let pageData = []

  try {
    totalCount = await models.userModel.countDocuments()
    console.log('totalCount', totalCount)


    pageData = await models.userModel.find({}, { username: 1, nickname: 1, email: 1, birthday: 1, sex: 1}).skip(skip).limit(pageSize)
    console.log('pageData', pageData)

    resData.totalCount = totalCount
    resData.pageData = pageData
    res.json(resData)

  } catch (error) {
    resData.message = error
    res.json(resData)
  }
  /* try {
    let userInfo = await models.userModel.find({}, { username: 1, nickname: 1, email: 1, age: 1, sex: 1}, {skip, limit})
    console.log('userInfo: ', userInfo)
    // Promise.all([])
    if(userInfo) {
      resData.data = userInfo
      resData.code = 200
      res.json(resData)
    }
  } catch (error) {
    resData.message = error
    res.json(resData)
  } */
})

// 修改用户信息
router.post('/user/update_userinfo', async(req, res) => {
  try {
    const {username, nickname, sex, birthday} = req.body
    const updateResult = await models.userModel.findOneAndUpdate({username}, {$set: {nickname, sex, birthday}}, {upsert: true})
    console.log('updateResult', updateResult)

    if(!updateResult) {
      // 数据更新失败
      resData.status = 300
      resData.message = '用户信息更新失败，请稍后再试'
      
    } else {
      resData.userData = updateResult
      resData.message = '更新用户成功'
      resData.status = 200
    }
    res.json(resData)
  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

module.exports = router;
