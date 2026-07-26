# 🎓 CampusMart — College Marketplace

A full-stack AI-powered marketplace for college students to buy and sell books, notes, gadgets, and more within their campus. Built with MERN stack, LLaMA 3.2 AI, and email-verified OTP security.

## 🚀 Features

- 🔐 User Authentication & Verification — Register, Login, Email OTP Verification & Forgot Password OTP via Nodemailer
- 📦 Product Listings — Buy & Sell college items easily
- 🤖 AI Description Generator — LLaMA 3.2 powered via Ollama
- 💰 AI Price Suggester — Fair price recommendations based on item condition & market baseline
- 💬 In-App Messaging — Direct buyer-seller chat
- 📬 Inbox — All active conversations in one place
- 👤 User Profile — Details including College, Branch, and Roll No.
- 🖼️ Image Upload — Cloudinary & Multer powered
- 🔍 Search & Filter — By name, category, and college
- ✅ Mark as Sold — Flexible listing management

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
- LLaMA 3.2 via Ollama (Local, Free!) — Powers both Description & Price Suggestion

## 📁 Project Structure

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

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail App Password (for Nodemailer OTP sending)
- Ollama installed with LLaMA 3.2

### Backend Setup

cd server
npm install

Create `.env` file in `server` folder:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail_id@gmail.com
EMAIL_PASS=your_16_digit_app_password

Run server:

npm run dev

### Frontend Setup

cd client
npm install
npm run dev

### AI Setup

ollama pull llama3.2
ollama run llama3.2

## 🌐 API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| Auth | POST | /api/auth/send-register-otp | Send registration OTP via email |
| Auth | POST | /api/auth/verify-register-otp | Verify OTP & complete registration |
| Auth | POST | /api/auth/login | Authenticate user & issue JWT token |
| Auth | POST | /api/auth/forgot-password | Send password reset OTP |
| Auth | POST | /api/auth/reset-password | Verify reset OTP & update password |
| Products | GET | /api/products | Get all active product listings |
| Products | GET | /api/products/:id | Get single product details |
| Products | POST | /api/products | Add new product (with Cloudinary image upload) |
| Products | PUT | /api/products/:id | Update product details |
| Products | PATCH | /api/products/:id/sold | Mark product status as sold |
| Products | DELETE | /api/products/:id | Delete product listing |
| Users | GET | /api/users/profile | Get current logged-in user profile |
| Users | PUT | /api/users/profile | Update user profile details |
| Users | GET | /api/users/my-listings | Get products listed by current user |
| Messages | POST | /api/messages | Send in-app message to seller/buyer |
| Messages | GET | /api/messages/conversations | Get all active chat threads |
| Messages | GET | /api/messages/:conversationId | Get message history of a chat thread |
| AI | POST | /api/ai/describe | Generate product description using LLaMA 3.2 |
| AI | POST | /api/ai/price | Get fair price recommendations using LLaMA 3.2 |

## 👨‍💻 Developed By

**Ritu Agarwal**  
**College:** Madan Mohan Malaviya University of Technology, Gorakhpur  
**Branch:** Computer Science and Engineering
