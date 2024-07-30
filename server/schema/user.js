const mongoose = require('mongoose')
// const Roles = require('../model/Roles')

module.exports = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    nickname: {
      type: String
    },
    email: {
      type: String,
      require: true
    },
    birthday: {
      type: Date,
      default: '2000-01-01'
    },
    sex: {
      type: String,
      default: '未知'
    },
    isAdmin: {
      type: Number,
      default: 0
    },
    role: {
      type: mongoose.Schema.Types.ObjectId, // role 保存 roles collection 的 _id 字段
      ref: 'Roles'
    }
  },
  {
    versionKey: false
  }
)
