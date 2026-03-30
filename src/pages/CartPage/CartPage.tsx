import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { IoArrowForwardCircleOutline, IoTrashOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import CartTour from '../../components/CartTour/CartTour'
import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './CartPage.module.scss'

export const CartPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { cartItems, setCartDropdownCollapsed, clearCart, total } = useCart()

  useEffect(() => {
    setCartDropdownCollapsed(true)
  }, [])

  useEffect(() => {
    if (!currentUser) navigate('/auth')
  }, [currentUser])
  
  return (
    <section className={styles.cartPageContainer} aria-labelledby="cart-page-title">
      <div className={styles.cartPageContents}>
        <header>
          <h1 id="cart-page-title">Your Cart</h1>
        </header>
        <div className={styles.clearCartContainer} onClick={clearCart}>
          <CustomButton aria-label="Empty Cart">
            <IoTrashOutline />
            Empty Cart
          </CustomButton>
        </div>
        <div className={styles.cartTours}>
          {cartItems?.map(item => <CartTour key={item.booking.id} cartPageItem={item} />)}
        </div>
        <div className={styles.bottomRowContainer}>
          <Link className={styles.checkoutButton} to={`/account/${currentUser!.id}/checkout`} aria-label="Proceed to Checkout">
            <CustomButton>
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
    </section>
  )
}

export default CartPage