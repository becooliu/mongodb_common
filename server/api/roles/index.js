const Roles = require("../../model/Roles");

const express = require("express");
const router = express.Router();

router.post('/roles/create', async(req, res) => {
    let resData = {}
    try {
        const {role, permission} = req.body
        let roleData = Roles.findOne({role})
        if(!roleData) {
            const newRole = new Roles({
                role,
                permission
            })

            newRole.save().then(result => {
                resData.status = 200
                resData.message = '新增角色成功'
                resData.role = role
            })

            res.json(resData)
        }else {
            resData.status = 210
            resData.message = `角色 ${role} 已存在，新增失败`
            res.json(resData)
        }
    } catch (error) {
        console.log(error)
        resData.message = error
        res.json(resData)
    }
})

module.exports = router;