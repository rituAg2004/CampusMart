import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Sell from './pages/Sell'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Conversations from './pages/Conversations'
import MyListings from './pages/MyListings'
import Footer from './components/Footer'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/chat/:productId/:otherUserId' element={<Chat />} />
        <Route path='/conversations' element={<Conversations />} />
        <Route path='/my-listings' element={<MyListings />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App