//博客
const mongoose = require('mongoose')

module.exports = new mongoose.Schema(
  {
    //关联字段，通过ref 指定关联的模型；此字段在mongoose 中实际存储为ObjectId类型
    //timestamps 时间戳，默认保存记录的创建时间和最后更新时间，默认值为createAt和updateAt.
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog' // 此字段对应模型名
    },
    //评论
    content: String,
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: new Date().getTime()
    },
    content: String, //评论内容
    author: {
      //发表评论的用户 _id
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }, //发表评论的用户_id

    replies: {
      //回复
      type: Array,
      default: [],
      // 以下为数组中存放的数据
      content: String, //回复的内容
      createdAt: {
        type: mongoose.Schema.Types.Date,
        default: new Date().getTime()
      },
      author: {
        //发表回复的用户 _id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)
