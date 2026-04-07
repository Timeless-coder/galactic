import { useState } from 'react'
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import HeaderCartDropdown from './HeaderCartDropdown/HeaderCartDropdown'
import HeaderUserDropdown from './HeaderUserDropdown/HeaderUserDropdown'
import HeaderCartIcon from './HeaderCartIcon/HeaderCartIcon'

import styles from './Header.module.scss'
import anonymousImage from '../../assets/Anonymous.jpg'

const defaultUserImageURL = anonymousImage

export const Header = () => {
  const { currentUser } = useAuth()
  const { cartDropdownOpen, setCartDropdownOpen } = useCart()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userImage = currentUser?.photoURL ?? defaultUserImageURL
  // console.table(currentUser)

  const toggleUserMenu = () => {
    setCartDropdownOpen(false)
    setUserMenuOpen(prev => !prev)
  }

  return (
    <header className={styles.headerContainer}>
       <Link to='/' className={styles.logoLinkContainer} aria-label='Home'>
          <VscRocket className={styles.rocketIcon} aria-hidden='true' />
          <span className={styles.logoLink}>GalacticTours&#8482;</span>
        </Link>

      <Link className={styles.toursLinkContainer} to='/tours' aria-label='Browse all tours'>
        <IoPlanetOutline className={styles.planetIcon} aria-hidden='true' />
        <span className={styles.toursLink}>Browse All Tours</span>
      </Link>

      <div className={styles.headerMenuContainer}>     
        {currentUser && (
          <>
            <div className={styles.headerRightIcons}>

              <HeaderCartIcon onToggle={() => setUserMenuOpen(false)} />
              
              {cartDropdownOpen && <HeaderCartDropdown />}     
              <button
                className={styles.userImageContainer}
                onClick={toggleUserMenu}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-controls="header-user-dropdown"
                type="button"
              >
                <img src={userImage} alt='' />
                <BsCaretDown className={styles.caret} />
              </button>
            </div>
            {userMenuOpen && <HeaderUserDropdown setUserMenuOpen={setUserMenuOpen} />}
          </>
        )}
        {!currentUser && <Link to='/auth'>SIGN IN/UP</Link>}
      </div>
    </header>
  )
}

export default Header