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

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/ai', aiRoutes)

const port = process.env.PORT;

app.get('/test', (req, res) => {
    res.send('CampusMart Server is working');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});