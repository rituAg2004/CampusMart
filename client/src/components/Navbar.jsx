import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to='/' className={styles.logo}>
        <span className={styles.logoSpan}>Campus</span>Mart
      </Link>

      <div className={styles.links}>
        <Link to='/' className={styles.link}>Browse</Link>

        {user ? (
          <>
            <Link to='/my-listings' className={styles.link}>My Listings</Link>
            <Link to='/conversations' className={styles.link}>Inbox</Link>
            <Link to='/sell' className={styles.link}>Sell</Link>
            <Link to='/profile' className={styles.navAvatar}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt='avatar'
                  className={styles.navAvatarImg}
                />
              ) : (
                <div className={styles.navAvatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login' className={styles.link}>Login</Link>
            <Link to='/register' className={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar