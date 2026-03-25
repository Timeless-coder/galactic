import { useEffect } from 'react'
import { Link } from 'react-router'
import { IoArrowForwardCircleOutline, IoTrashOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import CartTour from '../../components/CartTour/CartTour'
// import Spinner from '../../elements/Spinner/Spinner'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './CartPage.module.scss'

export const CheckoutPage = () => {
  const { user } = useAuth()
  const { cartItems, setCartDropdownCollapsed, clearCart } = useCart()
  let total = 0

  useEffect(() => {
    cartItems.forEach(item => {
      total += item.booking.people
    })
  }, [cartItems])

  useEffect(() => {
    setCartDropdownCollapsed(true)
  }, [])

  return (
    <div className={styles.checkoutPageContainer}>
      <div className={styles.checkoutPageContents}>

        <div className={styles.clearCartContainer} onClick={clearCart}>
          <CustomButton rect around between>
            <IoTrashOutline />
            Empty Cart
          </CustomButton>
        </div>

        <div className={styles.checkoutTours}>
          {cartItems?.map(item => <CartTour key={item.booking.id} cartPageItem={item} />)}
        </div>
               
        <div className={styles.bottomRowContainer}>
          <Link className={styles.checkoutButton} to={`/account/${user!.id}/payment`}>
            <CustomButton rect around between>
              Proceed to Checkout
              <IoArrowForwardCircleOutline />
            </CustomButton>
          </Link>
          <div className={styles.totalContainer}>
            <h3>Tours: <span>{cartItems.length}</span></h3>
            <h3>Total: <span>${total}</span></h3>          
          </div>
          
        </div>      
      </div>      
    </div>
  )
}

export default CheckoutPage