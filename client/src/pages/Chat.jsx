import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './Chat.module.css'
import toast from 'react-hot-toast'

function Chat() {
  const { productId, otherUserId } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState(null)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMessages()
    fetchOtherUser()
    fetchProduct()

    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/messages/${productId}/${otherUserId}`)
      setMessages(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const fetchOtherUser = async () => {
    try {
      const { data } = await API.get(`/users/${otherUserId}`)
      setOtherUser(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${productId}`)
      setProduct(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)

    try {
      const { data } = await API.post('/messages', {
        receiverId: otherUserId,
        productId,
        text
      })
      setMessages([...messages, data])
      setText('')
    } catch (error) {
      toast.error('Could not send message — try again')
    }
    setSending(false)
  }

  if (loading) return <div className={styles.loading}>Loading chat...</div>

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>

        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>
              {otherUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={styles.userName}>{otherUser?.name}</div>
              {product && (
                <div className={styles.productName}>Re: {product.title}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.noMessages}>
              No messages yet — say hello! 👋
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`${styles.message} ${msg.sender._id === user._id
                ? styles.sent
                : styles.received
                }`}
            >
              <div className={styles.bubble}>{msg.text}</div>
              <div className={styles.time}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className={styles.inputArea}>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type a message...'
            className={styles.input}
            disabled={sending}
          />
          <button
            type='submit'
            className={styles.sendBtn}
            disabled={sending || !text.trim()}
          >
            {sending ? '...' : 'Send'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Chat