const express = require('express')
const router = express()

const MESSAGE = require('../messageType.json')

const blogCatetory = require('../../model/BlogCatetory.js')

let resData = {}
router.use((req, res, next) => {
  resData.status = ''
  resData.message = ''
  next()
})

router.post('/blog_category/add', async (req, res) => {
  let categoryName = req.body?.categoryName
  if (!categoryName) {
    resData = MESSAGE.DATA_CAN_NOT_BE_EMPTY
    res.json(resData)
  }
  try {
    const category = await blogCatetory.findOne({ name: categoryName })
    if (!category) {
      const newCategory = new blogCatetory({
        name: categoryName
      })
      newCategory.save().then(result => {
        resData.status = 200
        resData.message = `新增分类成功：${categoryName}`
        res.json(resData)
      })
    } else {
      resData.status = 204
      resData.message = `分类已存在：${categoryName}。请修改后再提交。`
      res.json(resData)
    }
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

/**
 * 分类列表
*/
// 分页数据
let currentPage = 1
let pageSize = 10
let skip = (currentPage && currentPage - 1) * pageSize

// 控制分类列表需显示的字段
const fieldShow = { _id: 1, name: 1 }

const getCategoryData = async (skip, pageSize) => {
  let resData = {},
    totalCount = 0,
    categories = []

  try {
    totalCount = await blogCatetory.countDocuments()

    categories = await blogCatetory.find({}, fieldShow).skip(skip).limit(pageSize)

    if (!totalCount) {
      resData = MESSAGE.NO_CATEGORY_DATA
    } else {
      resData.totalCount = totalCount
      resData.categories = categories
      resData.status = 200
    }
    return resData
  } catch (error) {
    resData.message = error
    return resData
  }
}
// 获取分类数据
router.get('/blog_category/get', async (req, res) => {
  currentPage = req?.query?.currentPage || 1
  pageSize = req?.query?.pageSize || 10
  skip = (currentPage && currentPage - 1) * pageSize

  resData = await getCategoryData(skip, pageSize)
  res.json(resData)
})

/**
 * 修改分类名
 */
router.post('/blog_category/update', async (req, res) => {
  let { _id, name } = req.body
  try {
    await blogCatetory.findByIdAndUpdate({ _id }, { $set: { name } }, { upsert: false })
    resData = MESSAGE.CATEGORY_UPDATE_SUCCESS
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

/**
 * 删除分类
 */
router.post('/blog_category/delete', async (req, res) => {
  try {
    const { _id, name, currentPage, pageSize } = req.body

    const category = await blogCatetory.findByIdAndDelete({ _id })
    if (Object.keys(category)?.includes('_id')) {
      resData.message = `删除分类${name}失败`
      resData.status = 240
    } else {
      skip = (currentPage && currentPage - 1) * pageSize

      const categories = await getCategoryData(skip, pageSize)

      resData = categories
      resData.message = `删除分类${name}成功`
      resData.status = 200
    }
    res.json(resData)
  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

module.exports = router
