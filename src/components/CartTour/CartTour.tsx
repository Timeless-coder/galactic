import { useCart } from '../../hooks/useCart'

import type { CartItem } from '../../contexts/CartContext'

import styles from './CartTour.module.scss'

type CheckoutTourProps = {
  cartPageItem: CartItem
}


export const CartTour = ({ cartPageItem }: CheckoutTourProps) => {
  const { removePersonOrBooking, addPersonToBooking, removeItemFromCart } = useCart()

  return (
    <article className={styles.checkoutTourContainer}>
      <figure className={styles.imageContainer}>
        <img src={cartPageItem.tour.imageCover} alt={cartPageItem.tour.planet} />
      </figure>

      <section className={styles.textContainer} aria-label="Tour details">
        <h3>{cartPageItem.tour.planet}</h3>
        <p className={styles.departureDate}>
          {cartPageItem.booking.departureDate}
        </p>
      </section>

      <section className={styles.peopleContainer} aria-label="People selector">
        <div className={styles.carets}>
          <button
            type="button"
            aria-label="Remove person or booking"
            onClick={() => removePersonOrBooking(cartPageItem)}
          >
            &#10094;
          </button>
          <span>{cartPageItem.booking.people}</span>
          <button
            type="button"
            aria-label="Add person to booking"
            onClick={() => addPersonToBooking(cartPageItem)}
          >
            &#10095;
          </button>
        </div>
        <p>{cartPageItem.booking.people === 1 ? 'Person' : 'People'}</p>
      </section>

      <section className={styles.textContainer} aria-label="People count">
        {cartPageItem.booking.people}
      </section>

      <button
        className={styles.removeButtonContainer}
        onClick={() => removeItemFromCart(cartPageItem)}
        aria-label="Remove item from cart"
        type="button"
      >
        &#10005;
        <span>Remove</span>
      </button>
    </article>
  )
}

export default CartTour
