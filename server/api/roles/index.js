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

/**
 * 
 * @param {number} skip 
 * @param {number} pageSize 
 * @returns {object}
 */
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
router.post('/roles/add', async (req, res) => {
  try {
    const { role } = req.body
    let roleData = await Roles.findOne({ role })
    if (!roleData) {
      const newRole = new Roles({
        role
      })
      newRole.save().then(result => {
        resData.roleData = result
        resData.message = '新增角色成功'
        resData.status = 200
        res.json(resData)
      })
    } else {
      resData = MESSAGE.ROLE_EXIST
      res.json(resData)
    }
  } catch (error) {
    console.log('error')
    resData.message = error
    res.json(resData)
  }
})

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

/**
 * 修改角色
 * 根据 _id 修改角色名称
 */
router.post('/user/update_role', async (req, res) => {
  try {
    const { role, _id } = req.body
    let roleData = await Roles.findOne({ _id })
    if (!roleData) {
      resData.message = `此角色不存在，请确认。`
      resData.status = 220
      res.json(resData)
    }

    // 更新数据
    await Roles.findOneAndUpdate({ _id }, { $set: { role } }, { upsert: false })

    resData.message = `角色更新成功`
    resData.status = 200
    res.json(resData)
  } catch (error) {
    res.json(error)
  }
})

/**
 *
 * 删除角色
 *
 */
router.post('/user/delete_role', async (req, res) => {
  try {
    const { role, _id, currentPage, pagesize } = req.body

    const roleName = await Roles.findByIdAndDelete({ _id })
    if (roleName && Object.keys(roleName)?.includes('_id')) {
      resData.message = `删除角色 ${role} 失败`
      resData.status = 240
    } else {
      skip = (currentPage && currentPage - 1) * pagesize
      const pageData = await getRoleData(skip, pagesize)

      resData = pageData
      resData.message = `删除角色 ${role} 成功`
      resData.status = 200
    }
    res.json(resData)
  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

/**
 * 权限管理
 */
router.post('/permission/update', async (req, res) => {
  try {
    const {_id, role, permissions} = req.body
    const permissionData = await Roles.findByIdAndUpdate({_id}, { permissions },
      { new: true })
    if(permissionData) {
      resData.message = '权限更新成功。'
      resData.status = 200
    }else {
      resData.message = '权限更新失败。'
      resData.status = 210
    }
    res.json(resData)

  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

module.exports = router
