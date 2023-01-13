const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  }
})

module.exports = mongoose.model('Client', ClientSchema)