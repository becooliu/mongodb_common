const mongoose = require('mongoose')

const commentsSchema = require('../schema/comments')
module.exports = mongoose.model('Comments', commentsSchema, 'comments')
