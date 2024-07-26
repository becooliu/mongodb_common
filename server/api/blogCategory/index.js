const express = require('express')
const router = express()

const messageType = require('../messageType.json')

const blogCatetory = require('../../model/BlogCatetory.js')

let resData = {}
router.use((req, res, next) => {
  resData.status = ''
  resData.message = ''
  next()
})

router.post('/blog_category/add', async(req, res) => {
    let categoryName = req.body?.categoryName
    if(!categoryName) {
        resData.status = messageType.DATA_CAN_NOT_BE_EMPTY.status
        resData.message = messageType.DATA_CAN_NOT_BE_EMPTY.message
        res.json(resData)
    }
    try {
        const category = await blogCatetory.findOne({name: categoryName})
        if(!category) {
            const newCategory = new blogCatetory({
                name: categoryName
            })
            newCategory.save().then(result => {
                resData.status = 200
                resData.message = `新增分类成功：${categoryName}`
                res.json(resData)
            })
        }else {
            resData.status = 204
            resData.message = `分类已存在：${categoryName}。请修改后再提交。`
            res.json(resData)
        }

    } catch (error) {
        resData.message = error
        res.json(resData)
    }
})

// 获取分类数据
router.get('/blog_category/get', async(req, res) => {
    const fieldShow = {_id: 1, name: 1}
    try{
        const categories = await blogCatetory.find({}, fieldShow)
        if(!categories) {
            resData.message = '目前没有分类信息'
            resData.status = 201
            res.json(resData)
        }else {
            console.log('分类', categories)
            resData.categories = categories
            resData.status = 200
            res.json(resData)
        }
    }catch(error) {
        resData.message = error
        res.json(resData)
    }
})

module.exports = router