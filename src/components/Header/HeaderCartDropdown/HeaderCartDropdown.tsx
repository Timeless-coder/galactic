import { Link } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'
import { IoArrowForwardCircleOutline, IoArrowDownCircleOutline } from 'react-icons/io5'

import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'

import CartDropdownTour from '../HeaderCartDropdownTour/HeaderCartDropdownTour'
import CustomButton from '../../../elements/CustomButton/CustomButton'

import styles from './HeaderCartDropdown.module.scss'

export const HeaderCartDropdown = () => {
  const { currentUser } = useAuth()
  const { cartItems, setCartDropdownOpen } = useCart()

  return (
    <aside className={styles.cartContainer} aria-label="Cart dropdown">

      {/**Close Button */}
      <div className={styles.closeDropdown}>
         <CustomButton onClick={() => setCartDropdownOpen(false)} width='100%' layout='center'>
            {/* <AiFillCloseCircle /> */}
            Close
        </CustomButton>
      </div>

      {/**Cart Items */}
      <div className={styles.cartTours} aria-label="Cart items">
        {cartItems.length > 0
          ? cartItems.map(item => <CartDropdownTour key={item.booking.id} booking={item.booking} tour={item.tour} />)
          : (
              <div className={styles.cartMessage}>
                Your cart is empty
              </div>
            )
        }
      </div>

      {/**Link to Full Cart */}
      {currentUser && (
        <Link to={`/account/${currentUser.id}/cart`} style={{ width: '100%' }}>
          <CustomButton width='100%' layout='center'>
            View Full Cart
            {/* <IoArrowForwardCircleOutline /> */}
          </CustomButton>
        </Link>
      )}
    </aside>
  )
}

export default HeaderCartDropdown
