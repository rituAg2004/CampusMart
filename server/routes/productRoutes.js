const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const cloudinary = require('../config/cloudinary')

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, condition, college } = req.body

    let imageUrl = ''

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const dataURI = `data:${req.file.mimetype};base64,${b64}`

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'campusmart'
      })

      imageUrl = result.secure_url
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      image: imageUrl,
      college,
      seller: req.user._id
    })

    res.status(201).json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isSold: false })
      .populate('seller', 'name email college')
      .sort({ createdAt: -1 })

    res.status(200).json(products)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email college avatar branch rollNumber course contactNumber collegeEmail')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await product.deleteOne()

    res.status(200).json({ message: 'Product deleted' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/my/listings', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })

    res.status(200).json(products)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id/sold', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    product.isSold = true
    await product.save()

    res.status(200).json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router