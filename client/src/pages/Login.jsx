import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api'
import styles from './Login.module.css'
import toast from 'react-hot-toast'

function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/login', formData)
      localStorage.setItem('user', JSON.stringify(data))
      toast.success('Welcome back!')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
      setError(err.response?.data?.message || 'Something went wrong')
    }

    setLoading(false)
  }

  const handleSendResetOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/forgot-password', { email: resetEmail })
      toast.success(data.message || 'OTP sent to your email!')
      setOtpSent(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP'
      toast.error(msg)
      setError(msg)
    }

    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/reset-password', {
        email: resetEmail,
        otp,
        newPassword
      })
      toast.success(data.message || 'Password updated successfully!')
      setIsForgotPassword(false)
      setOtpSent(false)
      setOtp('')
      setNewPassword('')
      setResetEmail('')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password'
      toast.error(msg)
      setError(msg)
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isForgotPassword ? (
            'Reset Password'
          ) : (
            <>
              Welcome back to <span className={styles.span}>CampusMart</span>
            </>
          )}
        </h2>
        <p className={styles.subtitle}>
          {isForgotPassword
            ? 'Verify OTP and set a new password'
            : 'Login to buy and sell'}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {!isForgotPassword ? (
          <form onSubmit={handleSubmit}>
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
                placeholder='Your password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <button
                type='button'
                onClick={() => {
                  setIsForgotPassword(true)
                  setError('')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4F46E5',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type='submit'
              className={styles.btn}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSendResetOtp}>
            <div className={styles.field}>
              <label>Registered Email</label>
              <input
                type='email'
                placeholder='rahul@college.com'
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button
              type='submit'
              className={styles.btn}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>

            <button
              type='button'
              onClick={() => {
                setIsForgotPassword(false)
                setError('')
              }}
              className={styles.btn}
              style={{ marginTop: '10px', background: '#e0e0e0', color: '#333' }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#555' }}>
              OTP sent to <b>{resetEmail}</b>
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

            <div className={styles.field}>
              <label>New Password</label>
              <input
                type='password'
                placeholder='Min 6 characters'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type='submit'
              className={styles.btn}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

            <button
              type='button'
              onClick={() => {
                setOtpSent(false)
                setError('')
              }}
              className={styles.btn}
              style={{ marginTop: '10px', background: '#e0e0e0', color: '#333' }}
            >
              Change Email / Back
            </button>
          </form>
        )}

        <p className={styles.loginText}>
          New here? <Link to='/register'>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login