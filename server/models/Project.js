const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
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
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  }
})

module.exports = mongoose.model('Project', ProjectSchema)