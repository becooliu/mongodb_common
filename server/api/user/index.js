const models = require("../../model/db");

const express = require("express");
const router = express.Router();

/**
 * 
 * 注册用户
 * 
 */
router.post("/user/create", async (req, res) => {
  let resData = {};
  //let {username, pass} = ...req.body
  // console.log('req: ', req.body)
  try {
    const { username, password, nickname, email, sex, birthday } = req.body;
    let user = await models.userModel.findOne({ username });

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

/**
 * 
 * 用户登录
 * 
 */
router.post("/user/login", async (req, res) => {
  let resData = {};
  try {
    const { username, password } = req.body;
    let userData = await models.userModel.findOne({ username, password });
    console.log("user: ", userData);
    if (!userData) {
      resData.status = 230;
      resData.message = "用户不存在或密码错误，请确认。";
    } else {
      resData.status = 200;
      resData.message = "恭喜你，登录成功。";
      resData._id = userData._id
      resData.username = username;
      resData.isAdmin = userData.isAdmin

    }
    res.json(resData);
  } catch (error) {
    console.log(error);
    resData.message = error;
    res.json(resData);
  }
});

/**
 * 
 * 用户列表
 * 
 */

// 分页数据
let currentPage = 1
let pageSize = 10
let skip = (currentPage && currentPage - 1) * pageSize

//控制用户列表需显示的字段
const fieldShow = { username: 1, nickname: 1, email: 1, birthday: 1, sex: 1}

// 获取用户列表数据
const getUserData = async (skip, pageSize) => {
  let resData = {};
  let totalCount = 0
  let pageData = []

  try {
    totalCount = await models.userModel.countDocuments()

    pageData = await models.userModel.find({}, fieldShow).skip(skip).limit(pageSize)

    resData.totalCount = totalCount
    resData.pageData = pageData
    return resData

  } catch (error) {
    resData.message = error
    return resData
  }
}

router.get('/user/userlist', async(req, res) => {
  let resData = {};
  currentPage = req?.query?.currentPage || 1
  pageSize = req?.query?.pageSize || 10
  skip = (currentPage && currentPage - 1) * pageSize

  resData = await getUserData(skip, pageSize)
  res.json(resData)
  
})

/**
 * 
 * 修改用户信息
 * 
 */
router.post('/user/update_userinfo', async(req, res) => {
  let resData = {};
  try {
    const {username, nickname, sex, birthday} = req.body
    const updateResult = await models.userModel.findOneAndUpdate({username}, {$set: {nickname, sex, birthday}}, {upsert: true})

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

/**
 * 
 * 删除用户
 * 
 */
router.post('/user/delete_user', async (req, res) => {
  let resData = {};
  try {
    const {username, _id, currentPage, pageSize} = req.body
    
    const user = await models.userModel.findByIdAndDelete({_id})
      if(Object.keys(user)?.includes('_id')) {
        resData.message = `删除用户${username}失败`
        resData.status = 240
      }else {
        skip = (currentPage && currentPage - 1) * pageSize
        
        const pageData = await getUserData(skip, pageSize)

        resData = pageData
        resData.message = `删除用户${username}成功`
        resData.status = 200
      }
      res.json(resData)

  } catch (error) {
    resData.message == error
    res.json(resData)
  }
  

})

module.exports = router;
