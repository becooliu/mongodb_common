const mongoose = require('mongoose')
const rolesSchema = require('../schema/roles')

module.exports = mongoose.model('Roles', rolesSchema, 'roles')