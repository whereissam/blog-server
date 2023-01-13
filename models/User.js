const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  // id: {
  //   type: objectid
  // },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  posts: [POST]
})

module.exports = mongoose.model('User', UserSchema)