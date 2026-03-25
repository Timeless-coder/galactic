import { useState } from 'react'
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import CartDropdown from './CartDropdown/CartDropdown'
import CartIcon from './CartIcon/CartIcon'

import styles from './Header.module.scss'
import anonymousImage from '../../assets/Anonymous.jpg'
const defaultUserImageURL = anonymousImage

export const Header = () => {
  const { currentUser, logout } = useAuth()
  const { cartDropdownCollapsed } = useCart()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userImage, setUserImage] = useState(currentUser?.photoURL || defaultUserImageURL)

  console.table(currentUser)

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen)
  
  const signOut = () => {
    try {
      logout()
    }
    catch (err) {
      console.log('Logout error:', err)
    }    
  }

  return (
    <div className={styles.headerContainer}>

        <Link to='/' className={styles.logoLinkContainer}>
          <VscRocket className={styles.rocketIcon} />
          <p className={styles.logoLink}>GalacticTours</p>
        </Link>

        <Link className={styles.toursLinkContainer} to='/tours'>
          <IoPlanetOutline className={styles.planetIcon} />
          <p className={styles.toursLink}>Browse All Tours</p>
        </Link>

         <div className={styles.headerMenuContainer}>          
          {currentUser
            ? (
                <>
                  <div className={styles.userIcons}>

                    <CartIcon />
                    {!cartDropdownCollapsed && <CartDropdown />}     

                    <div className={styles.userImageContainer} onClick={toggleUserMenu}>
                      <img src={userImage} alt='View/Update your account' />
                      <BsCaretDown className={styles.caret} />
                    </div>
                  </div>

                  {userMenuOpen && (
                    <div className={styles.userDropdown}>

                      <Link onClick={() => setUserMenuOpen(false)}
                        to={`/account/${currentUser.id}/checkout`}>
                        Checkout
                      </Link>

                      <Link to={`/account/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}>
                        {currentUser.role === 'admin' ? 'Admin' : 'Account'}
                      </Link>

                      <div onClick={signOut}><p>Sign Out</p></div>
                                        
                    </div>
                  )}
                </>
              )
            : <Link to='/auth'>SIGN IN/UP</Link>
          }
        </div>

      </div>
  )
}

export default Header