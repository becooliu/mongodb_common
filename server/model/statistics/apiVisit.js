const mongoose = require('mongoose')
const apiVisitSchema = require('../../schema/statistics/apiVisit')

module.exports = mongoose.model('apiVisit', apiVisitSchema, 'apiVisit')