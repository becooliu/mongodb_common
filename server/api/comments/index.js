const express = require('express')
const router = express()

const Comments = require('../../model/Comments.js')
const Blog = require('../../model/Blog.js')
const MESSAGE = require('../messageType.json')

/**
 * 发表评论
 */
router.post('/comments/add_comment', async (req, res) => {
  const { blogId, comment, userId } = req.body
  let resData = {}
  try {
    const newComment = new Comments({
      blogId,
      content: comment,
      author: userId,
      createdAt: new Date().getTime(),
      replies: []
    })
    await newComment.save()

    //根据Id 查询此blog下的所有评论
    // const commentsObj = await Blog.findById({ _id }).select('comments')
    const populateObj = {
      path: 'author',
      select: {
        username: 1
      }
    }
    const commentsObj = await getComment(blogId, populateObj)

    console.log('commentsObj', commentsObj)
    resData.data = commentsObj
    resData.message = '评论发表成功'
    resData.status = 200

    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
  resData = null
})

// 获取某个blog 下的所有评论
router.get('/comments/get_comment', async (req, res) => {
  const resData = {}
  const blogId = req.query.blogId
  const populateObj = {
    path: 'author',
    select: {
      username: 1
    }
  }
  try {
    const commentsObj = await getComment(blogId, populateObj)
    resData.data = commentsObj
    resData.status = 200
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

// 获取评论函数
const getComment = async (blogId, populateObj) => {
  if (blogId) {
    return await Comments.find({ blogId }).populate(populateObj).sort({ createdAt: 1 })
  }
  return await Comments.find({}).populate(populateObj).sort({ createdAt: 1 })
}

/**
 * 回复评论
 */
router.post('/comments/add_reply', async (req, res) => {
  const { _id, blogId, comment, userId, username } = req.body
  let resData = {}
  try {
    const replyData = { comment, userId, username, createdAt: new Date().getTime() }
    await Comments.findByIdAndUpdate(_id, { $push: { replies: replyData } })

    const populateObj = {
      path: 'author',
      select: {
        username: 1
      }
    }
    const commentsObj = await getComment(blogId, populateObj)

    console.log('commentsObj', commentsObj)
    resData.data = commentsObj
    resData.message = '回复评论成功'
    resData.status = 200

    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
})

/* router.get('/comments/blog_list', async (req, res) => {
  const resData = {}
  const populateObj = {
    path: 'blogId',
    select: {
      blogId: 1
    }
  }
  try {
    const commentData = await Comments.find({}).populate(populateObj).select('content replies')
    const result = rowComments(commentData)

    resData.commentData = result
    resData.status = 200
    res.json(resData)
  } catch (error) {
    resData.message = error
    res.json(resData)
  }
}) */

module.exports = router
