import type { Tour} from '../../types/tour'

import type { CartItem } from '../../contexts/CartContext'

import { useCart } from '../../hooks/useCart'

import styles from './CartTour.module.scss'

type CheckoutTourProps = {
  cartPageItem: CartItem
}

export const CartTour = ({ cartPageItem }: CheckoutTourProps) => {
  const { subtractPersonFromBooking, addItemToCart, removeItemFromCart } = useCart()

  return (
    <div className={styles.checkoutTourContainer}>
      <div className={styles.imageContainer}>
        <img src={cartPageItem.tour.imageCover} alt={cartPageItem.tour.planet} />
      </div>

      <div className={styles.textContainer}>
        {cartPageItem.tour.planet}
        <p className={styles.departureDate}>
          {cartPageItem.booking.departureDate}
        </p>
      </div>

      <div className={styles.peopleContainer}>
        <div className={styles.carets}>
          <div onClick={() => subtractPersonFromBooking}>
            &#10094;
          </div>
          <span>{cartPageItem.booking.people}</span>
          <div onClick={() => addItemToCart(cartPageItem)}>
            &#10095;
          </div>
        </div>
        <p>{cartPageItem.booking.people === 1 ? 'Person' : 'People'}</p>
      </div>

      <div className={styles.textContainer}>{cartPageItem.booking.people}</div>

      <div
        className={styles.removeButtonContainer}
        onClick={() => removeItemFromCart(cartPageItem)}>
        &#10005;
        <p>Remove</p>
      </div>
      
    </div>
  )
}

export default CartTour
