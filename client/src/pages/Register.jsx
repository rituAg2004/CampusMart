import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import styles from './Register.module.css'
import toast from 'react-hot-toast'

function Register() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: ''
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/send-register-otp', formData)
      toast.success(data.message || 'OTP sent to your email!')
      setOtpSent(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP'
      toast.error(msg)
      setError(msg)
    }

    setLoading(false)
  }

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/verify-register-otp', {
        email: formData.email,
        otp
      })

      localStorage.setItem('user', JSON.stringify(data))
      toast.success('Email verified & Account created successfully!')
      
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP'
      toast.error(msg)
      setError(msg)
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Join <span className={styles.span}>CampusMart</span>
        </h2>
        <p className={styles.subtitle}>
          {otpSent ? 'Verify your email to continue' : 'Buy and sell within your college'}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input
                type='text'
                name='name'
                placeholder='Rahul Singh'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type='email'
                name='email'
                placeholder='rahul@college.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type='password'
                name='password'
                placeholder='Min 6 characters'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>College Name</label>
              <input
                type='text'
                name='college'
                placeholder='MMMUT Gorakhpur'
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
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#555' }}>
              We have sent a 6-digit OTP to <b>{formData.email}</b>
            </p>

            <div className={styles.field}>
              <label>Enter 6-Digit OTP</label>
              <input
                type='text'
                maxLength='6'
                placeholder='123456'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
                required
              />
            </div>

            <button
              type='submit'
              className={styles.btn}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP & Register'}
            </button>

            <button
              type='button'
              onClick={() => setOtpSent(false)}
              className={styles.btn}
              style={{ marginTop: '10px', background: '#e0e0e0', color: '#333' }}
            >
              Change Email / Back
            </button>
          </form>
        )}

        <p className={styles.loginText}>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register