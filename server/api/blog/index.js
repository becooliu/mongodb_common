const express = require('express')
const router = express()

const Blog = require('../../model/Blog.js')
const { areAllEmpty } = require('../../../utils/index.js')

let resData = {}
router.use((req, res, next) => {
  resData.status = ''
  resData.message = ''
  next()
})

// 发表博客
router.post('/blog/add', async (req, res) => {
  try {
    const { category, title, desc, keywords, content, user } = req.body
    // 检查发表的博客是否为空
    const emptyData = areAllEmpty(category, title, desc, content, user)
    if (!emptyData) {
      const blog = new Blog({
        category,
        title,
        desc,
        keywords,
        content,
        user
      })

      blog
        .save()
        .then(result => {
          resData.status = 200
          resData.message = `博客保存成功!`
          res.json(resData)
        })
        .catch(err => {
          resData.message = err
          res.json(resData)
        })
    } else {
      resData.status = 220
      resData.message = `博客数据不能为空，请检查后重新保存。`
      res.json(resData)
    }
  } catch (error) {
    console.log(error)
    resData.message = error
    res.json(resData)
  }
})

// 获取博客列表
// 分页数据
let currentPage = 1
let pageSize = 10
let skip = (currentPage && currentPage - 1) * pageSize
// 博客列表需显示的字段
const blogField = { category: 1, title: 1, desc: 1, keywords: 1, views: 1, comments: 1, user: 1, createdAt: 1 }

// 获取用户列表数据
const getBlogData = async (skip, pageSize) => {
  let resData = {}
  let totalCount = 0
  let pageData = []

  try {
    totalCount = await Blog.countDocuments()

    pageData = await Blog.find({}, blogField).populate('user').skip(skip).limit(pageSize)

    resData.totalCount = totalCount
    resData.pageData = pageData
    return resData
  } catch (error) {
    resData.message = error
    return resData
  }
}
router.get('/blog/list', async (req, res) => {
  currentPage = req?.query?.currentPage || 1
  pageSize = req?.query?.pageSize || 10
  skip = (currentPage && currentPage - 1) * pageSize

  resData = await getBlogData(skip, pageSize)
  res.json(resData)
})

module.exports = router
