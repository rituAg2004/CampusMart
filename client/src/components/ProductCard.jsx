import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className={styles.imageBox}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
        />
        <span className={styles.category}>{product.category}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.college}>{product.college}</p>
        <div className={styles.bottom}>
          <span className={styles.price}>₹{product.price}</span>
          <span className={styles.condition}>{product.condition}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard