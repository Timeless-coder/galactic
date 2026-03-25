import { Link } from 'react-router'
import { AiFillCloseCircle } from 'react-icons/ai'
import { IoArrowForwardCircleOutline } from 'react-icons/io5'
import { IoArrowDownCircleOutline } from 'react-icons/io5'

import { useAuth } from '../../../hooks/useAuth'
import { useCart } from '../../../hooks/useCart'

import CartDropdownTour from '../CartDropdownTour/CartDropdownTour'
import CustomButton from '../../../elements/CustomButton/CustomButton'

import styles from './CartDropdown.module.scss'

export const CartDropdown = () => {
  const { user } = useAuth()
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
        <CustomButton rect between around>
          <AiFillCloseCircle />
          Close
        </CustomButton>
      </div>
      <div className={styles.cartTours}>
        {cartItems.length > 0
          ? cartItems.map(item => <CartDropdownTour key={item.booking.id} booking={item.booking} tour={item.tour} />          )
          : <div className={styles.cartMessage}>Your cart is empty</div>
        }
      </div>
      <Link to={`/cart`}>
        <CustomButton rect between around>
          View Full Cart
          <IoArrowForwardCircleOutline />
        </CustomButton>
      </Link>
    </div>
  )
}

export default CartDropdown
