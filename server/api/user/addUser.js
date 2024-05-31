const models = require('../../model/db')

const express = require('express')
const router = express.Router()

const resData = {}

router.post('/user/create', async (req, res) => {
    //let {username, pass} = ...req.body
    // console.log('req: ', req.body)
    try {
        const {username, password} = req.body
        let user = await models.userModel.findOne({ username })
        console.log('user: ', user)
        
        if (!user) {
            const newUser = new models.userModel({
                username,
                password
            })
            newUser.save().then(result => {
                resData.status = 200
                resData.message= `账号：${username} 注册成功!`
                res.json(resData)
            }).catch(err => {
                resData.message = err
                res.json(resData)
            })
        }else {
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

module.exports = router

