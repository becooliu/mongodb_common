const User = require('../../model/User')

const express = require('express')
const router = express.Router()

const MESSAGE = require('../messageType.json')

const { areAllEmpty } = require('../../../utils/index')

let resData = {}

/**
 *
 * 注册用户
 *
 */
router.post('/user/create', async (req, res) => {
  try {
    const { username, password, nickname, email, sex, birthday } = req.body
    let user = await User.findOne({ username })

    if (!user) {
      const newUser = new User({
        username,
        password,
        nickname,
        email,
        sex,
        birthday: new Date(birthday)
      })
      newUser
        .save()
        .then(result => {
          resData.status = 200
          resData.message = `账号：${username} 注册成功!`
          res.json(resData)
        })
        .catch(err => {
          resData.message = err
          res.json(resData)
        })
    } else {
      resData.status = 220
      resData.message = `账号已存在：${username}，请修改后重新注册。`
      res.json(resData)
    }
  } catch (error) {
    console.log(error)
    resData.message = error
    res.json(resData)
  }
})

/**
 *
 * 用户登录
 *
 */
router.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body
    let userData = await User.findOne({ username, password }).populate('role')
    if (!userData) {
      resData = MESSAGE.LOGIN_FAILD
    } else {
      resData = MESSAGE.LOGIN_SUCCESS
      resData.user = userData
      /* resData._id = userData._id
      resData.username = username;
      resData.isAdmin = userData.isAdmin */
    }
    res.json(resData)
  } catch (error) {
    console.log(error)
    resData.message = error
    res.json(resData)
  }
})

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
const fieldShow = { username: 1, nickname: 1, email: 1, birthday: 1, sex: 1 }

// 获取用户列表数据
const getUserData = async (skip, pageSize) => {
  let resData = {}
  let totalCount = 0
  let pageData = []

  try {
    totalCount = await User.countDocuments()

    pageData = await User.find({}, fieldShow).skip(skip).limit(pageSize)

    resData.totalCount = totalCount
    resData.pageData = pageData
    return resData
  } catch (error) {
    resData.message = error
    return resData
  }
}

router.get('/user/userlist', async (req, res) => {
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
router.post('/user/update_userinfo', async (req, res) => {
  try {
    const { username, nickname, sex, birthday } = req.body
    const updateResult = await User.findOneAndUpdate(
      { username },
      { $set: { nickname, sex, birthday } },
      { upsert: true }
    )

    if (!updateResult) {
      // 数据更新失败
      resData = MESSAGE.UPDATE_USER_INFO_FAILD
    } else {
      resData = MESSAGE.UPDATE_USER_INFO_SUCCESS
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
  try {
    const { username, _id, currentPage, pagesize } = req.body

    const user = await User.findByIdAndDelete({ _id })
    if (Object.keys(user)?.includes('_id')) {
      resData.message = `删除用户${username}失败`
      resData.status = 240
    } else {
      skip = (currentPage && currentPage - 1) * pagesize

      const pageData = await getUserData(skip, pagesize)

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

/**
 * 修改密码
 */
router.post('/user/change_password', async (req, res) => {
  const resData = {}
  try {
    const { password, newpass, repass, userId, username } = req.body
    const dataEmpty = areAllEmpty(password, newpass, repass)
    if (Boolean(dataEmpty) == false) {
      // 数据都不为空
      if (newpass != repass) {
        resData.message = '两次密码不一致！'
        resData.status = 210
      } else {
        const userData = await User.findById({ _id: userId }).select('username password')

        if (password !== userData.password || username !== userData.username) {
          // 如果查询到的用户名、密码和用户传参中的用户名、密码不一致
          resData.message = '用户名或密码错误，修改密码操作失败！'
          resData.status = 205
        } else {
          await User.findByIdAndUpdate({ _id: userId }, { $set: { password: newpass } }, { upsert: false })
          resData.message = '恭喜，修改密码成功'
          resData.status = 200
        }
      }
      res.json(resData)
    } else {
      resData = MESSAGE.DATA_CAN_NOT_BE_EMPTY
      res.json(resData)
    }
  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

module.exports = router
