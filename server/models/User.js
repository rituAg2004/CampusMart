const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  collegeEmail: {
    type: String,
    default: ''
  },
  course: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  rollNumber: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)