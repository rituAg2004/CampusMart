import { useState, useEffect } from 'react'
import API from '../api'
import ProductCard from '../components/ProductCard'
import styles from './Home.module.css'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [college, setCollege] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products')
      setProducts(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category ? p.category === category : true
    const matchCollege = college ? p.college.toLowerCase().includes(college.toLowerCase()) : true
    return matchSearch && matchCategory && matchCollege
  })

  if (loading) return <div className={styles.loading}>Loading products...</div>

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Buy & Sell within your <span className={styles.span}>College</span>
        </h1>
        <p className={styles.heroSub}>Books, gadgets, notes and more — all from your campus</p>
      </div>

      <div className={styles.filters}>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <input
          type='text'
          placeholder='Filter by college...'
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className={styles.search}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value=''>All Categories</option>
          <option>Books & Notes</option>
          <option>Gadgets & Electronics</option>
          <option>Stationery</option>
          <option>Lab Equipment</option>
          <option>Hostel Essentials</option>
          <option>Sports & Fitness</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>No products found</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home