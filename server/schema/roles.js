const mongoose = require('mongoose')

module.exports = new mongoose.Schema({
    role: {
      type: String,
      required: true,
    },
    permission: {
      type: Array,
      required: true,
    }
  },
  {
    versionKey: false,
  })