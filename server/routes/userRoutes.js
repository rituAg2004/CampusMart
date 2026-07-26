const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const cloudinary = require('../config/cloudinary')

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/profile', protect, upload.single('avatar'), async (req, res) => {
  try {
    const { name, college, collegeEmail, course, branch, rollNumber, contactNumber } = req.body

    let avatarUrl = req.user.avatar

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const dataURI = `data:${req.file.mimetype};base64,${b64}`

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'campusmart/avatars',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' }
        ]
      })

      avatarUrl = result.secure_url
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        college,
        collegeEmail,
        course,
        branch,
        rollNumber,
        contactNumber,
        avatar: avatarUrl
      },
      { new: true }
    ).select('-password')

    res.status(200).json(updatedUser)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router