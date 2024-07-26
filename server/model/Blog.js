const mongoose = require('mongoose')
const BlogSchema = require('../schema/blog')

module.exports = mongoose.model('Blog', BlogSchema, 'blog')