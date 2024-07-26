const Roles = require("../../model/Roles");

const express = require("express");
const router = express.Router();

let resData = {}
router.use((req, res, next) => {
  // console.log('req.userInfo', Boolean(req?.userInfo))
  if(req?.userInfo && !req.userInfo?.isAdmin) {
      res.json({message: '对不起，只有管理员才可以进入该页面。', status: 203})
      return
    }
    resData.status = ''
    resData.message = ''
  next()
})

router.post('/roles/create', async(req, res) => {
    try {
        const {role, permissions} = req.body
        let roleData = await Roles.findOne({role})
        // 如果不存在此角色，则直接新增
        if(!roleData) {
            const newRole = new Roles({
                role,
                permissions: [permissions]
            })

            newRole.save().then(result => {
                resData.status = 200
                resData.message = '新增角色成功'
                resData.role = role
                res.json(resData)
            })

        }else {
            //如果角色和权限是否同时存在
            const roleAndPermissionExist = (role == roleData.role && roleData.permissions.includes(permissions))
            if(!roleAndPermissionExist) {
                const updateRoleAndPermission = await Roles.findOneAndUpdate({role}, {$push: {permissions}}, {new: true})
                if(!updateRoleAndPermission) {
                    // 数据更新失败
                    resData.status = 300
                    resData.message = '角色更新失败，请稍后再试'
                }else {
                    resData.status = 200
                    resData.message = '角色更新成功'
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

module.exports = router;