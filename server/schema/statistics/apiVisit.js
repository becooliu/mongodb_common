const mongoose = require('mongoose')
// const Roles = require('../model/Roles')

module.exports = new mongoose.Schema({
    path: {
      type: String,
      required: true,
    },
    visitTime: {
      type: Date,
      default: new Date(),
      required: true,
    },
    ip: {
      type: String
    }
  },
  {
    versionKey: false,
  })