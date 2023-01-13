const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  id: {
    type: ID
  },
  author: {
    type: [User]
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed']
  },
  likeGibers: {
    type: [User]
  },
  createAt: {
    type: String
  }
})

module.exports = mongoose.model('Post', PostSchema)