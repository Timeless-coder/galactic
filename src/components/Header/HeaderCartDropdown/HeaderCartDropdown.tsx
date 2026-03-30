import { Link } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'
import { IoArrowDownCircleOutline } from 'react-icons/io5'

import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../hooks/useAuth'

import CartDropdownTour from '../HeaderCartDropdownTour/HeaderCartDropdownTour'
import CustomButton from '../../../elements/CustomButton/CustomButton'

import styles from './HeaderCartDropdown.module.scss'

export const HeaderCartDropdown = () => {
  const { currentUser } = useAuth()
  const { cartItems, setCartDropdownCollapsed, cartDropdownCollapsed } = useCart()

  return (
    <aside className={styles.cartContainer} aria-label="Cart dropdown">
      <div className={styles.closeDropdown}>
        <div className={styles.scroll}>
          {cartItems.length > 3
            ? <><p>Scroll</p> <IoArrowDownCircleOutline /></>
            : <p />
          }
        </div>
        <button
          type="button"
          onClick={() => setCartDropdownCollapsed(!cartDropdownCollapsed)}
          aria-label="Close cart dropdown"
        >
          <CustomButton>
            <AiFillCloseCircle />
            Close
          </CustomButton>
        </button>
      </div>
      <nav className={styles.cartTours} aria-label="Cart items">
        {cartItems.length > 0
          ? cartItems.map(item => <CartDropdownTour key={item.booking.id} booking={item.booking} tour={item.tour} />)
          : (
              <div className={styles.cartMessage}>
                Your cart is empty
              </div>
            )
        }
      </nav>
      {currentUser && (
        <Link to={`/account/${currentUser?.id}/cart`}>
          <CustomButton>
            View Full Cart
            <IoArrowForwardCircleOutline />
          </CustomButton>
        </Link>
      )}
    </aside>
  )
}

export default HeaderCartDropdown
