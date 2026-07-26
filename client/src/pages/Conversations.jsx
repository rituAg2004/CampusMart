import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './Conversations.module.css'

function Conversations() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations')
      setConversations(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>My Conversations</h2>

        {conversations.length === 0 ? (
          <div className={styles.empty}>
            <p>No conversations yet</p>
            <p className={styles.emptySub}>Browse products and message a seller!</p>
          </div>
        ) : (
          <div className={styles.list}>
            {conversations.map((conv, index) => (
              <div
                key={index}
                className={styles.convItem}
                onClick={() => navigate(`/chat/${conv.product._id}/${conv.otherUser._id}`)}
              >
                <div className={styles.avatar}>
                  {conv.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{conv.otherUser.name}</div>
                  <div className={styles.productTitle}>Re: {conv.product.title}</div>
                  <div className={styles.lastMsg}>{conv.lastMessage.text}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className={styles.badge}>{conv.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Conversations