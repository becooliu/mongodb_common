const mongoose = require('mongoose')

module.exports = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
)
