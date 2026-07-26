require('dotenv').config()
const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db.js')
const authRoutes = require('./routes/authRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const messageRoutes = require('./routes/messageRoutes.js')
const aiRoutes = require('./routes/aiRoutes')

const app = express();

connectDB()

const allowedOrigins = [
  'http://localhost:5173',
  'https://campusmart-snowy.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy Error'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/ai', aiRoutes)

const port = process.env.PORT || 5000;

app.get('/test', (req, res) => {
    res.send('CampusMart Server is working');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});