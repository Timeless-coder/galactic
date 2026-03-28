import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import HeaderCartDropdown from './HeaderCartDropdown/HeaderCartDropdown'
import CartIcon from './HeaderCartIcon/HeaderCartIcon'

import styles from './Header.module.scss'
import anonymousImage from '../../assets/Anonymous.jpg'
import HeaderUserDropdown from './HeaderUserDropdown/HeaderUserDropdown'

const defaultUserImageURL = anonymousImage

export const Header = () => {
  const { currentUser } = useAuth()
  const { cartDropdownCollapsed, setCartDropdownCollapsed } = useCart()
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

  useEffect(() => {
    setCartDropdownCollapsed(true)
    setUserMenuOpen(false)
  }, [])

  return (
    <div className={styles.headerContainer}>

        <Link to='/' className={styles.logoLinkContainer}>
          <VscRocket className={styles.rocketIcon} />
          <p className={styles.logoLink}>GalacticTours&#8482;</p>
        </Link>

        <Link className={styles.toursLinkContainer} to='/tours'>
          <IoPlanetOutline className={styles.planetIcon} />
          <p className={styles.toursLink}>Browse All Tours</p>
        </Link>

         <div className={styles.headerMenuContainer}>     
          {currentUser &&
            (
              <>
                <div className={styles.userIcons}>

                  <CartIcon />
                  {!cartDropdownCollapsed && <HeaderCartDropdown />}     

                  <div className={styles.userImageContainer} onClick={toggleUserMenu}>
                    <img src={userImage} alt='View/Update your account' />
                    <BsCaretDown className={styles.caret} />
                  </div>
                </div>

                {userMenuOpen && <HeaderUserDropdown setUserMenuOpen={setUserMenuOpen} />}
              </>
            )
          }
          {!currentUser && <Link to='/auth'>SIGN IN/UP</Link>}
          
        </div>

      </div>
  )
}

export default Header