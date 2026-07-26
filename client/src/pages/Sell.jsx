import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './Sell.module.css'
import toast from 'react-hot-toast'

function Sell() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    college: user?.college || ''
  })

  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceSuggestion, setPriceSuggestion] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAIDescription = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      setError('Please fill title, category and condition first')
      return
    }
    setAiLoading(true)
    setError('')
    try {
      const { data } = await API.post('/ai/describe', {
        productName: formData.title,
        category: formData.category,
        condition: formData.condition
      })
      setFormData({ ...formData, description: data.description })
    } catch (error) {
      setError('AI description failed — try again')
    }
    setAiLoading(false)
  }

  const handleAIPrice = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      setError('Please fill title, category and condition first')
      return
    }
    setPriceLoading(true)
    setError('')
    try {
      const { data } = await API.post('/ai/price', {
        productName: formData.title,
        category: formData.category,
        condition: formData.condition
      })
      setPriceSuggestion(data)
    } catch (error) {
      setError('AI price suggestion failed — try again')
    }
    setPriceLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      setError('Please upload a product image')
      return
    }
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('price', formData.price)
      form.append('category', formData.category)
      form.append('condition', formData.condition)
      form.append('college', formData.college)
      form.append('image', image)

      await API.post('/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Product posted successfully!')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      toast.error('Could not post listing — try again')
      setError('Could not post listing — try again')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>List a Product</h2>
        <p className={styles.subtitle}>Sell your stuff to fellow students</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Product Image</label>
            <div
              className={styles.uploadZone}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt='preview' className={styles.preview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span className={styles.uploadIcon}>📷</span>
                  <span>Click to upload image</span>
                </div>
              )}
            </div>
            <input
              type='file'
              id='imageInput'
              accept='image/*'
              onChange={handleImage}
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.field}>
            <label>Product Title</label>
            <input
              type='text'
              name='title'
              placeholder='e.g. Engineering Mathematics Sem 4'
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Category</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value=''>Select...</option>
                <option>Books & Notes</option>
                <option>Gadgets & Electronics</option>
                <option>Stationery</option>
                <option>Lab Equipment</option>
                <option>Hostel Essentials</option>
                <option>Sports & Fitness</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Condition</label>
              <select
                name='condition'
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value=''>Select...</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label>Description</label>
              <button
                type='button'
                className={styles.aiBtn}
                onClick={handleAIDescription}
                disabled={aiLoading}
              >
                {aiLoading ? '✦ Generating...' : '✦ AI Generate'}
              </button>
            </div>
            <textarea
              name='description'
              placeholder='Describe your product...'
              value={formData.description}
              onChange={handleChange}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label>Price (₹)</label>
              <button
                type='button'
                className={styles.aiBtn}
                onClick={handleAIPrice}
                disabled={priceLoading}
              >
                {priceLoading ? '✦ Analyzing...' : '✦ AI Suggest Price'}
              </button>
            </div>
            <input
              type='number'
              name='price'
              placeholder='0'
              value={formData.price}
              onChange={handleChange}
              required
              min='0'
            />
            {priceSuggestion && (
              <div className={styles.priceSuggestion}>
                <span className={styles.priceRange}>
                  ₹{priceSuggestion.min} — ₹{priceSuggestion.max}
                </span>
                <span className={styles.priceReason}>{priceSuggestion.reason}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>College</label>
            <input
              type='text'
              name='college'
              placeholder='IET Lucknow'
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type='submit'
            className={styles.btn}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Sell