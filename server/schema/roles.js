const mongoose = require('mongoose')

module.exports = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  {
    versionKey: false
  }
)
