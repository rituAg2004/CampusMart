import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoSpan}>Campus</span>Mart
          </div>
          <p className={styles.tagline}>Buy & Sell within your campus</p>
        </div>

        <div className={styles.links}>
            <Link to='/' className={styles.link}>Browse</Link>
            {user && <Link to='/sell' className={styles.link}>Sell</Link>}
            {user && <Link to='/my-listings' className={styles.link}>My Listings</Link>}
            {user && <Link to='/conversations' className={styles.link}>Inbox</Link>}
            {!user && <Link to='/login' className={styles.link}>Login</Link>}
            {!user && <Link to='/register' className={styles.link}>Register</Link>}
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} CampusMart — Made with ❤️ for college students</p>
      </div>
    </footer>
  )
}

export default Footer