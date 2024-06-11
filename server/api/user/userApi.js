const models = require("../../model/db");

const express = require("express");
const router = express.Router();

const resData = {};

// 注册用户
router.post("/user/create", async (req, res) => {
  //let {username, pass} = ...req.body
  // console.log('req: ', req.body)
  try {
    const { username, password } = req.body;
    let user = await models.userModel.findOne({ username });
    console.log("user: ", user);

    if (!user) {
      const newUser = new models.userModel({
        username,
        password,
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
      res.json(resData);
    } else {
      resData.status = 200;
      resData.message = "恭喜你，登录成功。";
      resData.username = username;
      res.json(resData);
    }
  } catch (error) {
    console.log(error);
    resData.message = error;
    res.json(resData);
  }
});

// 用户列表
router.get('/user/userlist', async(req, res) => {
  try {
    let userInfo = await models.userModel.find({}, { username: 1, nickname: 1, email: 1, age: 1, sex: 1})
    if(userInfo) {
      resData.data = userInfo
      resData.code = 200
      res.json(resData)
    }
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

module.exports = router;
