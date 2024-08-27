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
    const { category, title, desc, keywords, cover, content, user } = req.body
    // 检查发表的博客是否为空
    const emptyData = areAllEmpty(category, title, desc, content, user)
    if (!emptyData) {
      const blog = new Blog({
        category,
        title,
        desc,
        keywords,
        cover,
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
const blogField = {
  category: 1,
  title: 1,
  desc: 1,
  keywords: 1,
  views: 1,
  comments: 1,
  cover: 1,
  user: 1,
  createdAt: 1,
  updatedAt: 1
}

// 获取博客列表数据
const getBlogData = async (skip, pageSize, populateObj) => {
  let resData = {}
  let totalCount = 0
  let pageData = []

  try {
    totalCount = await Blog.countDocuments()

    pageData = await Blog.find({}, blogField).populate(populateObj).skip(skip).limit(pageSize)

    resData.totalCount = totalCount
    resData.pageData = pageData
    return resData
  } catch (error) {
    resData.message = error
    return resData
  }
}

/**
 * blog 列表
*/
// 列表需显示字段
const blogListPopulateObj = {
  path: 'user category', // populate 字段
  select: {
    // populate 需要返回的字段
    username: 1,
    nickname: 1,
    name: 1 // 博客分类名
  }
}

router.get('/blog/list', async (req, res) => {
  currentPage = req.query?.currentPage || 1
  pageSize = req?.query?.pageSize || 10
  skip = (currentPage && currentPage - 1) * pageSize

  resData = await getBlogData(skip, pageSize, blogListPopulateObj)
  res.json(resData)
})

/***
 * 博客详情
*/
router.get('/blog/details/', async (req, res) => {
  const blogId = req.query?._id
  //console.log('blogId', blogId)
  if (!blogId) return
  try {
    const populateObj = {
      path: 'user category', // populate 字段
      select: {
        // populate 需要返回的字段
        username: 1,
        nickname: 1,
        name: 1 // 博客分类名
      },
      options: {
        limit: 3
      }
    }
    const blogData = await Blog.findOne({ _id: blogId }).populate(populateObj)
    resData = blogData
    resData.status = 200
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

// 猜你喜欢模块接口
router.get('/blog/likes', async (req, res) => {
  const { category, blogId } = req.query
  if (!category) return
  try {
    const fieldShow = { _id: 1, title: 1 }
    console.log('category', category)
    // $ne：查询 _id 不等于blogId 的数据
    const blogData = await Blog.find({ category, _id: { $ne: blogId } }, fieldShow).limit(2)
    console.log('likes:', blogData)
    resData = blogData
    resData.status = 200
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

/**
 * 更新博客
 */
router.post('/blog/update_bloginfo', async (req, res) => {
  try {
    const { _id, title, cover, desc } = req.body
    const updateResult = await Blog.findOneAndUpdate(
      { _id },
      { $set: { title, cover, desc } },
      { upsert: true }
    )

    if (!updateResult) {
      // 数据更新失败
      resData.status = 300
      resData.message = '博客信息更新失败，请稍后再试'
    } else {
      resData.userData = updateResult
      resData.message = '更新博客成功'
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
 * 删除博客
 *
 */
router.post('/blog/delete_blog', async (req, res) => {
  try {
    const { _id, currentPage, pageSize } = req.body

    await Blog.findByIdAndDelete({ _id })
    skip = (currentPage && currentPage - 1) * pageSize

    const pageData = await getBlogData(skip, pageSize, blogListPopulateObj)

    resData = pageData
    resData.message = `删除博客成功`
    resData.status = 200
    res.json(resData)
  } catch (error) {
    resData.message == error
    res.json(resData)
  }
})

/**
 * 博客分类与数量统计
 * 方法返回的数据格式为数组对象
 */

router.get('/blog/count', async(req, res) => {
  try {
    const populateObj = {
      path: 'category', // populate 字段
      select: {
        name: 1 // 博客分类名
      }
    }

    const countData = await Blog.aggregate([
      {
        $lookup: {
          from: 'blogCategory',
          localField: 'category',
          foreignField: '_id',
          as: 'name'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ])

    resData = countData
    resData.status = 200
    res.json(resData)

  } catch (error) {
    res.json(error)
  }
  

  
})

module.exports = router
