const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Books & Notes', 'Gadgets & Electronics', 'Stationery', 'Lab Equipment', 'Hostel Essentials', 'Sports & Fitness']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Good','Fair', 'Poor']
  },
  image: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  college: {
    type: String,
    required: true
  },
  isSold: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', productSchema)