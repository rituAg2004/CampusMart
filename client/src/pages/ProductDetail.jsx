import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './ProductDetail.module.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`)
      setProduct(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleContact = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (product.seller._id === user._id) {
      alert('Yeh tumhara apna product hai!')
      return
    }
    navigate(`/chat/${product._id}/${product.seller._id}`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await API.delete(`/products/${id}`)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (!product) return <div className={styles.loading}>Product not found</div>

  return (
    <div className={styles.container}>

      {zoomed && (
        <div className={styles.zoomOverlay} onClick={() => setZoomed(false)}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.zoomedImage}
          />
          <button className={styles.closeBtn}>✕ Close</button>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.imageSection}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
            onClick={() => setZoomed(true)}
          />
          <p className={styles.zoomHint}>🔍 Click image to zoom</p>
        </div>

        <div className={styles.details}>
          <div className={styles.badges}>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.condition}>{product.condition}</span>
          </div>

          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>₹{product.price}</p>
          <p className={styles.college}>📍 {product.college}</p>

          <div className={styles.divider} />

          <h3 className={styles.descTitle}>Description</h3>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.divider} />

          <h3 className={styles.descTitle}>Seller Details</h3>
          <div className={styles.seller}>
            <div className={styles.sellerTop}>
              {product.seller.avatar ? (
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className={styles.sellerAvatarImg}
                />
              ) : (
                <div className={styles.sellerAvatar}>
                  {product.seller.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className={styles.sellerName}>{product.seller.name}</div>
                <div className={styles.sellerCollege}>{product.seller.college}</div>
              </div>
            </div>

            <div className={styles.sellerDetails}>
              {product.seller.course && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Course</span>
                  <span className={styles.detailValue}>{product.seller.course}</span>
                </div>
              )}
              {product.seller.branch && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Branch</span>
                  <span className={styles.detailValue}>{product.seller.branch}</span>
                </div>
              )}
              {product.seller.rollNumber && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Roll No.</span>
                  <span className={styles.detailValue}>{product.seller.rollNumber}</span>
                </div>
              )}
              {product.seller.collegeEmail && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>College Email</span>
                  <span className={styles.detailValue}>{product.seller.collegeEmail}</span>
                </div>
              )}
              {product.seller.contactNumber && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Contact</span>
                  <span className={styles.detailValue}>{product.seller.contactNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {user && product.seller._id === user._id ? (
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete Listing
            </button>
          ) : (
            <button
              className={styles.contactBtn}
              onClick={handleContact}
            >
              💬 Contact Seller
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail