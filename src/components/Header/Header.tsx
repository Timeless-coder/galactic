import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import HeaderCartDropdown from './HeaderCartDropdown/HeaderCartDropdown'
import HeaderUserDropdown from './HeaderUserDropdown/HeaderUserDropdown'
import CartIcon from './HeaderCartIcon/HeaderCartIcon'

import styles from './Header.module.scss'
import anonymousImage from '../../assets/Anonymous.jpg'

const defaultUserImageURL = anonymousImage

export const Header = () => {
  const { currentUser } = useAuth()
  const { cartDropdownCollapsed } = useCart()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userImage, setUserImage] = useState(currentUser?.photoURL || defaultUserImageURL)
  // console.table(currentUser)

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen)

  // Probably not necessary, but just in case something goes wrong with photoURL.
  useEffect(() => {
    if (currentUser?.photoURL) {
      setUserImage(currentUser.photoURL)
    }
    else {
      setUserImage(defaultUserImageURL)
    }
  }, [currentUser?.photoURL])

  return (
    <header className={styles.headerContainer}>
      <nav aria-label="Main navigation">
        <Link to='/' className={styles.logoLinkContainer}>
          <VscRocket className={styles.rocketIcon} />
          <span className={styles.logoLink}>GalacticTours&#8482;</span>
        </Link>

        <Link className={styles.toursLinkContainer} to='/tours'>
          <IoPlanetOutline className={styles.planetIcon} />
          <span className={styles.toursLink}>Browse All Tours</span>
        </Link>
      </nav>

      <div className={styles.headerMenuContainer}>     
        {currentUser && (
          <>
            <div className={styles.userIcons}>
              <CartIcon />
              {!cartDropdownCollapsed && <HeaderCartDropdown />}     
              <button
                className={styles.userImageContainer}
                onClick={toggleUserMenu}
                aria-label="Open user menu"
                type="button"
              >
                <img src={userImage} alt='View/Update your account' />
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