# 🎓 CampusMart — College Marketplace

A full-stack AI-powered marketplace for college students to buy and sell books, notes, gadgets, and more within their campus. Built with MERN stack, Google Gemini AI, and email-verified OTP security.

## 🚀 Features

- 🔐 **User Authentication & Verification** — Register, Login, Email OTP Verification & Forgot Password OTP via Nodemailer
- 📦 **Product Listings** — Buy & Sell college items easily
- 🤖 **AI Description Generator** — Google Gemini 2.5 Flash powered
- 💰 **AI Price Suggester** — Fair price recommendations based on item condition & market baseline
- 💬 **In-App Messaging** — Direct buyer-seller chat
- 📬 **Inbox** — All active conversations in one place
- 👤 **User Profile** — Details including College, Branch, and Roll No.
- 🖼️ **Image Upload** — Cloudinary & Multer powered
- 🔍 **Search & Filter** — By name, category, and college
- ✅ **Mark as Sold** — Flexible listing management

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- React Router DOM
- Axios
- React Hot Toast
- CSS Modules

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email & OTP Services)
- Cloudinary (Image Upload)
- Multer

### AI Layer
- Google Gemini API (`@google/genai`) — Powers both Description & Price Suggestion

## 📁 Project Structure

```text
campusmart/
├── client/          # React Frontend
│   ├── src/
│   │   ├── pages/       # Login, Register, Home, Product Details, Profile, Chat
│   │   ├── components/  # Reusable UI components
│   │   └── api.js       # Axios configuration
└── server/          # Node.js Backend
    ├── models/      # MongoDB Models (User, Product, Message, OTP)
    ├── routes/      # API Routes (Auth, Products, Users, AI, Messages)
    ├── middleware/  # Auth & Upload Middleware
    └── config/      # DB & Cloudinary Config
