const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const resend = require('../config/nodemailer')

const pendingUsers = new Map()
const resetOTPs = new Map()

router.post('/send-register-otp', async (req, res) => {
  try {
    const { name, email, password, college } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    pendingUsers.set(normalizedEmail, {
      otp,
      userData: { name, email: normalizedEmail, password, college },
      expiresAt: Date.now() + 10 * 60 * 1000
    })

    await resend.emails.send({
      from: 'CampusMart <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'CampusMart - Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">Welcome to CampusMart! 🎓</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    })

    res.status(200).json({ message: 'OTP sent to your email for verification!' })

  } catch (error) {
    console.error("Register OTP Error:", error)
    res.status(500).json({ message: 'Failed to send OTP: ' + error.message })
  }
})

router.post('/verify-register-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const pending = pendingUsers.get(normalizedEmail)

    if (!pending) {
      return res.status(400).json({ message: 'No registration request found or OTP expired.' })
    }

    if (Date.now() > pending.expiresAt) {
      pendingUsers.delete(normalizedEmail)
      return res.status(400).json({ message: 'OTP has expired. Please try again.' })
    }

    if (pending.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    const { name, password, college } = pending.userData

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      college
    })

    pendingUsers.delete(normalizedEmail)

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })
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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    resetOTPs.set(normalizedEmail, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    })

    await resend.emails.send({
      from: 'CampusMart <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'CampusMart - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">Password Reset Request 🔐</h2>
          <p>Your OTP to reset your CampusMart password is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    })

    res.status(200).json({ message: 'Password reset OTP sent to your email!' })

  } catch (error) {
    console.error("Forgot Password Error:", error)
    res.status(500).json({ message: 'Failed to send OTP: ' + error.message })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const record = resetOTPs.get(normalizedEmail)

    if (!record) {
      return res.status(400).json({ message: 'No password reset request found' })
    }

    if (Date.now() > record.expiresAt) {
      resetOTPs.delete(normalizedEmail)
      return res.status(400).json({ message: 'OTP has expired. Please try again.' })
    }

    if (record.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword })

    resetOTPs.delete(normalizedEmail)

    res.status(200).json({ message: 'Password updated successfully! You can now login.' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router