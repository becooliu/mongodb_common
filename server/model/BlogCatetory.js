const mongoose = require('mongoose')
const blogCategorySchema = require('../schema/blogCategory')

module.exports = mongoose.model('BlogCategory', blogCategorySchema, 'blogCategory')