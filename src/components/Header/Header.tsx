import { useEffect, useState } from 'react'
import toast from "react-hot-toast"
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import HeaderCartDropdown from './HeaderCartDropdown/HeaderCartDropdown'
import CartIcon from './HeaderCartIcon/HeaderCartIcon'
import Spinner from '../../elements/Spinner/Spinner'

import styles from './Header.module.scss'
import anonymousImage from '../../assets/Anonymous.jpg'

const defaultUserImageURL = anonymousImage

export const Header = () => {
  const { currentUser, logout } = useAuth()
  const { cartDropdownCollapsed, setCartDropdownCollapsed } = useCart()
  const [loading, setLoading] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userImage, setUserImage] = useState(currentUser?.photoURL || defaultUserImageURL)

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
  }, [])
  
  const signOut = () => {
    setLoading(true)
    
    try {
      logout()
    }
    catch (err) {
      console.error('Logout error:', err)
      toast.error('Logout failed. Please try again')  
    }
    finally {
      setLoading(false)
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
          {loading && <Spinner />}       
          {currentUser && !loading &&
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
          }
          {!loading && !currentUser && <Link to='/auth'>SIGN IN/UP</Link>}
          
        </div>

      </div>
  )
}

export default Header