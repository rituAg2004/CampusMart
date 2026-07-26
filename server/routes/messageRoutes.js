const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, productId, text } = req.body

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      product: productId,
      text
    })

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('product', 'title')

    res.status(201).json(populatedMessage)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('product', 'title image')
      .sort({ createdAt: -1 })

    const conversations = {}

    messages.forEach(msg => {
      if (!msg.product || !msg.sender || !msg.receiver) return

      const productId = msg.product._id.toString()
      const otherUser = msg.sender._id.toString() === req.user._id.toString()
        ? msg.receiver
        : msg.sender

      const key = `${productId}_${otherUser._id}`

      if (!conversations[key]) {
        conversations[key] = {
          product: msg.product,
          otherUser,
          lastMessage: msg,
          unreadCount: 0
        }
      }

      if (!msg.isRead && msg.receiver._id.toString() === req.user._id.toString()) {
        conversations[key].unreadCount++
      }
    })

    res.status(200).json(Object.values(conversations))

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:productId/:otherUserId', protect, async (req, res) => {
  try {
    const { productId, otherUserId } = req.params

    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name')
      .sort({ createdAt: 1 })

    await Message.updateMany(
      {
        product: productId,
        sender: otherUserId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    )

    res.status(200).json(messages)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router