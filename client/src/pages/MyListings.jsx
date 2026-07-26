import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './MyListings.module.css'

function MyListings() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyListings()
  }, [])

  const fetchMyListings = async () => {
    try {
      const { data } = await API.get('/products/my/listings')
      setProducts(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

const handleMarkSold = async (id) => {
  if (!window.confirm('Mark this product as sold?')) return
  try {
    await API.put(`/products/${id}/sold`)
    setProducts(products.map(p =>
      p._id === id ? { ...p, isSold: true } : p
    ))
  } catch (error) {
    console.log(error)
  }
}

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Listings</h2>
        <button
          className={styles.sellBtn}
          onClick={() => navigate('/sell')}
        >
          + Add New
        </button>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No listings yet</p>
          <p className={styles.emptySub}>Start selling your stuff!</p>
          <button
            className={styles.sellBtn}
            onClick={() => navigate('/sell')}
          >
            Sell Something
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {products.map(product => (
            <div key={product._id} className={styles.item}>
              <img
                src={product.image}
                alt={product.title}
                className={styles.image}
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <div className={styles.info}>
                <div className={styles.itemTitle}>{product.title}</div>
                <div className={styles.itemCategory}>{product.category}</div>
                <div className={styles.itemPrice}>₹{product.price}</div>
                {product.isSold && (
                  <span className={styles.soldBadge}>Sold</span>
                )}
              </div>
              <div className={styles.actions}>
                {!product.isSold && (
                  <button
                    className={styles.soldBtn}
                    onClick={() => handleMarkSold(product._id)}
                  >
                    Mark Sold
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyListings