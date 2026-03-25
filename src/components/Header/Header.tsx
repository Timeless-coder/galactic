import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { VscRocket } from 'react-icons/vsc'
import { BsCaretDown } from 'react-icons/bs'
import { IoPlanetOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import CartDropdown from './CartDropdown/CartDropdown'
import CartIcon from './CartIcon/CartIcon'

import styles from './Header.module.scss'

const defaultUserImageURL = "https://firebasestorage.googleapis.com/v0/b/galactic-tours.appspot.com/o/1639865907685?alt=media&token=56876f9e-3a43-41b2-82b8-2bed4ea1bb5e"

export const Header = () => {
  const { user, logout } = useAuth()
  const { cartDropdownCollapsed } = useCart()
  const [userImage, setUserImage] = useState(defaultUserImageURL)

  useEffect(() => {
    if (user?.photoURL) {
      setUserImage(user.photoURL)
    }
  }, [user])


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
          {user
            ? (
                <>
                  <div className={styles.userIcons}>

                    <CartIcon />
                    {!cartDropdownCollapsed && <CartDropdown />}     

                    <div className={styles.userImageContainer} onClick={() => {}}>
                      <img src={userImage} alt='View/Update your account' />
                      <BsCaretDown className={styles.caret} />
                    </div>
                  </div>

                  {/* {userMenuOpen && (
                    <div className={styles.userDropdown}>

                      <Link onClick={() => setUserMenuOpen(false)}
                        to={`/account/${user.id}/checkout`}>
                        Checkout
                      </Link>

                      <Link to={`/account/${user.id}`} onClick={() => setUserMenuOpen(false)}>
                        {user.data().role === 'admin' ? 'Admin' : 'Account'}
                      </Link>

                      <div onClick={signOut}><p>Sign Out</p></div>
                                        
                    </div>
                  )} */}
                </>
              )
            : <Link to='/signupsignin'>SIGN IN / UP</Link>
          }
        </div>

      </div>
  )
}

export default Header