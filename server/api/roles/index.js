const Roles = require('../../model/Roles')

const express = require('express')
const router = express.Router()

const MESSAGE = require('../messageType.json')

let resData = {}
router.use((req, res, next) => {
  // console.log('req.userInfo', Boolean(req?.userInfo))
  if (req?.userInfo && !req.userInfo?.isAdmin) {
    res.json(MESSAGE.PAGE_NOT_ALLOWED)
    return
  }
  resData.status = ''
  resData.message = ''
  next()
})

// 获取角色列表
// 分页数据
let currentPage = 1
let pageSize = 10
let skip = (currentPage && currentPage - 1) * pageSize

const getRoleData = async (skip, pageSize) => {
  let resData = {}
  let totalCount = 0
  let pageData = []

  try {
    totalCount = await Roles.countDocuments()
    pageData = await Roles.find({}).skip(skip).limit(pageSize)
    if (!pageData) {
      resData = MESSAGE.NO_ROLES_DATA
    } else {
      resData.pageData = pageData
      resData.totalCount = totalCount
      resData.status = 200
    }
    return resData
  } catch (error) {
    resData.message = error
    return resData
  }
}
/**
 * 获取初始role 数据
 * 用于填充初始表单
 */
router.get('/roles/getAll', async (req, res) => {
  currentPage = req.query?.currentPage || 1
  pageSize = req?.query?.pageSize || 10
  skip = (currentPage && currentPage - 1) * pageSize

  resData = await getRoleData(skip, pageSize)
  res.json(resData)
})

/***
 * 创建角色
 */
router.post('/roles/create', async (req, res) => {
  try {
    const { role, permissions } = req.body
    let roleData = await Roles.findOne({ role })
    // 如果不存在此角色，则直接新增
    if (!roleData) {
      const newRole = new Roles({
        role,
        permissions: [permissions]
      })

      newRole.save().then(result => {
        resData = MESSAGE.ROLE_ADDED_SUCCESS
        resData.role = role
        res.json(resData)
      })
    } else {
      //如果角色和权限是否同时存在
      const roleAndPermissionExist = role == roleData.role && roleData.permissions.includes(permissions)
      if (!roleAndPermissionExist) {
        const updateRoleAndPermission = await Roles.findOneAndUpdate(
          { role },
          { $push: { permissions } },
          { new: true }
        )
        if (!updateRoleAndPermission) {
          // 数据更新失败
          resData = MESSAGE.ROLE_UPDATE_FAILD
        } else {
          resData = MESSAGE.ROLE_UPDATE_SUCCESS
        }
        res.json(resData)
      } else {
        //  如果角色和权限都存在
        resData.status = 210
        resData.message = `角色 ${role} 已存在，新增失败`
        res.json(resData)
      }
    }
  } catch (error) {
    console.log(error)
    resData.message = error
    res.json(resData)
  }
})

module.exports = router
