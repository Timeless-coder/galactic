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
    <div className={styles.cartContainer}>
      <div className={styles.closeDropdown} onClick={() => setCartDropdownCollapsed(!cartDropdownCollapsed)}>        
        <div className={styles.scroll}>
          {cartItems.length > 3
            ? <><p>Scroll</p> <IoArrowDownCircleOutline /></>
            : <p />
          }                 
        </div>
        <CustomButton>
          <AiFillCloseCircle />
          Close
        </CustomButton>
      </div>
      <div className={styles.cartTours}>
        {cartItems.length > 0
          ? cartItems.map(item => <CartDropdownTour key={item.booking.id} booking={item.booking} tour={item.tour} />)
          : <div className={styles.cartMessage}>Your cart is empty</div>
        }
      </div>
      {currentUser && (
        <Link to={`/account/${currentUser?.id}/cart`}>
          <CustomButton>
            View Full Cart
            <IoArrowForwardCircleOutline />
          </CustomButton>
        </Link>
      )
      }
    </div>
  )
}

export default HeaderCartDropdown
