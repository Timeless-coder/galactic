import { useNavigate } from 'react-router'

import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'

import CartDropdownTour from '../HeaderCartDropdownTour/HeaderCartDropdownTour'
import CustomButton from '../../../elements/CustomButton/CustomButton'

import styles from './HeaderCartDropdown.module.scss'

export const HeaderCartDropdown = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { cartItems, setCartDropdownOpen } = useCart()

  const navigateToCartPageAndCloseDropdown = () => {
    if (!currentUser) return
    navigate(`/account/${currentUser.id}/cart`)
    setCartDropdownOpen(false)
  }

  return (
    <aside id="header-cart-dropdown" className={styles.cartContainer} aria-label="Cart dropdown">

      {/**Close Cart Button */}
      <div className={styles.closeDropdown}>
         <CustomButton onClick={() => setCartDropdownOpen(false)} width='100%' layout='center'>
            Close
        </CustomButton>
      </div>

      {/**Cart Items */}
      <section aria-label="Cart items">
        {cartItems.length > 0
          ? (
              <ul className={styles.cartTours}>
                {cartItems.map(item => (
                  <li key={item.booking.id} className={styles.cartTourItem}>
                    <CartDropdownTour booking={item.booking} tour={item.tour} />
                  </li>
                ))}
              </ul>
            )
          : (
              <p className={styles.cartMessage}>
                Your cart is empty
              </p>
            )
        }
      </section>

      {/**Link to Full Cart */}
      {currentUser && (
        <CustomButton width='100%' layout='center' onClick={navigateToCartPageAndCloseDropdown}>
            View Full Cart
        </CustomButton>
      )}
    </aside>
  )
}

export default HeaderCartDropdown
