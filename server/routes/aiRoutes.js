const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

router.post('/describe', protect, async (req, res) => {
  try {
    const { productName, category, condition } = req.body

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful assistant for a college student marketplace in India. Write a short, honest and compelling product description in 2-3 sentences (max 60 words) for selling this product. Product: ${productName}, Category: ${category}, Condition: ${condition}. Only return the description, nothing else.`,
    })

    res.status(200).json({ description: response.text })

  } catch (error) {
    console.error("Gemini AI Description Error:", error)
    res.status(500).json({ message: "Failed to generate description: " + error.message })
  }
})

router.post('/price', protect, async (req, res) => {
  try {
    const { productName, category, condition } = req.body

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a pricing expert for a college second-hand marketplace in India. Suggest a fair resale price range in INR for this product. Product: ${productName}, Category: ${category}, Condition: ${condition}. Return ONLY a valid JSON object like this: {"min": 100, "max": 300, "reason": "one line reason"}. Nothing else, no markdown formatting, no extra text.`,
    })

    const text = response.text.trim()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI")
    }

    const parsed = JSON.parse(jsonMatch[0])
    res.status(200).json(parsed)

  } catch (error) {
    console.error("Gemini AI Price Error:", error)
    res.status(500).json({ message: "Failed to suggest price: " + error.message })
  }
})

module.exports = router