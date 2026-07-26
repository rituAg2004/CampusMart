const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const pendingUsers = {}
const resetOTPs = {}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// -------------------------------------------------------------
// REGISTER FLOW
// -------------------------------------------------------------
router.post('/send-register-otp', async (req, res) => {
  try {
    const { name, email, password, college } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    pendingUsers[email] = {
      otp,
      userData: { name, email, password, college },
      expiresAt: Date.now() + 10 * 60 * 1000 
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CampusMart - Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to CampusMart! 🎓</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'OTP sent to your email for verification!' })

  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP: ' + error.message })
  }
})

router.post('/verify-register-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    const pending = pendingUsers[email]

    if (!pending) {
      return res.status(400).json({ message: 'No registration request found or OTP expired.' })
    }

    if (Date.now() > pending.expiresAt) {
      delete pendingUsers[email]
      return res.status(400).json({ message: 'OTP has expired. Please try again.' })
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    const { name, password, college } = pending.userData

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      college
    })

    delete pendingUsers[email]

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      avatar: user.avatar,
      token,
      message: 'Email verified and registration successful!'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// -------------------------------------------------------------
// LOGIN FLOW
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      avatar: user.avatar,
      token
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// -------------------------------------------------------------
// FORGOT PASSWORD FLOW
// -------------------------------------------------------------

// 1. Send OTP for Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CampusMart - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request 🔐</h2>
          <p>Your OTP to reset your CampusMart password is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Password reset OTP sent to your email!' })

  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP: ' + error.message })
  }
})

// 2. Verify OTP and Update Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const record = resetOTPs[email]

    if (!record) {
      return res.status(400).json({ message: 'No password reset request found' })
    }

    if (Date.now() > record.expiresAt) {
      delete resetOTPs[email]
      return res.status(400).json({ message: 'OTP has expired. Please try again.' })
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await User.findOneAndUpdate({ email }, { password: hashedPassword })

    delete resetOTPs[email]

    res.status(200).json({ message: 'Password updated successfully! You can now login.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router