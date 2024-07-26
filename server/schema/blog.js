//博客
const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //关联字段，通过ref 指定关联的模型；此字段在mongoose 中实际存储为ObjectId类型
    //timestamps 时间戳，默认保存记录的创建时间和最后更新时间，默认值为createAt和updateAt.
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory" // 此字段对应模型名
    },
    views:{
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    desc: String,
    content: String,
    keywords: String,
    //评论
    comments: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})