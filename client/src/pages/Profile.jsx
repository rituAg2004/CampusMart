import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import styles from './Profile.module.css'
import toast from 'react-hot-toast'

function Profile() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    collegeEmail: '',
    course: '',
    branch: '',
    rollNumber: '',
    contactNumber: ''
  })

  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile')
      setFormData({
        name: data.name || '',
        college: data.college || '',
        collegeEmail: data.collegeEmail || '',
        course: data.course || '',
        branch: data.branch || '',
        rollNumber: data.rollNumber || '',
        contactNumber: data.contactNumber || ''
      })
      if (data.avatar) {
        setAvatarPreview(data.avatar)
      }
    } catch (error) {
      setError('Could not fetch profile')
    }
    setFetching(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('college', formData.college)
      form.append('collegeEmail', formData.collegeEmail)
      form.append('course', formData.course)
      form.append('branch', formData.branch)
      form.append('rollNumber', formData.rollNumber)
      form.append('contactNumber', formData.contactNumber)
      if (avatar) {
        form.append('avatar', avatar)
      }

      const { data } = await API.put('/users/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const updatedUser = { ...user, name: data.name, avatar: data.avatar }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success('Profile updated successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (err) {
      toast.error('Could not update profile')
      setError('Could not update profile')
    }

    setLoading(false)
  }

  if (fetching) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>

          <div
            className={styles.avatarWrapper}
            onClick={() => document.getElementById('avatarInput').click()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt='avatar'
                className={styles.avatarImg}
              />
            ) : (
              <div className={styles.avatar}>
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className={styles.avatarOverlay}>📷</div>
          </div>

          <input
            type='file'
            id='avatarInput'
            accept='image/*'
            onChange={handleAvatar}
            style={{ display: 'none' }}
          />

          <div>
            <h2 className={styles.title}>My Profile</h2>
            <p className={styles.subtitle}>Click photo to change</p>
          </div>
        </div>

        {success && <div className={styles.success}>Profile updated successfully!</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Rahul Singh'
              />
            </div>

            <div className={styles.field}>
              <label>College</label>
              <input
                type='text'
                name='college'
                value={formData.college}
                onChange={handleChange}
                placeholder='IET Lucknow'
              />
            </div>

            <div className={styles.field}>
              <label>College Email <span className={styles.optional}>(optional)</span></label>
              <input
                type='email'
                name='collegeEmail'
                value={formData.collegeEmail}
                onChange={handleChange}
                placeholder='rahul@ietlucknow.ac.in'
              />
            </div>

            <div className={styles.field}>
              <label>Course <span className={styles.optional}>(optional)</span></label>
              <input
                type='text'
                name='course'
                value={formData.course}
                onChange={handleChange}
                placeholder='B.Tech'
              />
            </div>

            <div className={styles.field}>
              <label>Branch <span className={styles.optional}>(optional)</span></label>
              <input
                type='text'
                name='branch'
                value={formData.branch}
                onChange={handleChange}
                placeholder='Computer Science'
              />
            </div>

            <div className={styles.field}>
              <label>Roll Number <span className={styles.optional}>(optional)</span></label>
              <input
                type='text'
                name='rollNumber'
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder='2021CS001'
              />
            </div>

            <div className={styles.field}>
              <label>Contact Number <span className={styles.optional}>(optional)</span></label>
              <input
                type='text'
                name='contactNumber'
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder='9876543210'
              />
            </div>
          </div>

          <button
            type='submit'
            className={styles.btn}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile