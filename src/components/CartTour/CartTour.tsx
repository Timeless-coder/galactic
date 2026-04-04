import { format } from 'date-fns'

import type { CartItem } from '../../contexts/CartContext'

import { useCart } from '../../hooks/useCart'

import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './CartTour.module.scss'

type CheckoutTourProps = {
  cartPageItem: CartItem
}

export const CartTour = ({ cartPageItem }: CheckoutTourProps) => {
  const { removePersonOrBooking, addPersonToBooking, removeItemFromCart } = useCart()

  return (
    <article className={styles.checkoutTourContainer}>

      {/**Cover Image */}
      <figure className={styles.imageContainer}>
        <img src={cartPageItem.tour.imageCover} alt={cartPageItem.tour.planet} />
      </figure>

      {/**Tour Details */}
      <section className={styles.textContainer} aria-label="Tour details">
        <h3>{cartPageItem.tour.planet}</h3>
        <p className={styles.departureDate}>
          {format(cartPageItem.booking.departureDate, 'PPPP')}
        </p>
      </section>

      {/**Add and Remove Buttons */}
      <section className={styles.peopleContainer} aria-label="People selector">
        <div className={styles.carets}>
          <CustomButton
            aria-label="Remove person or booking"
            onClick={() => removePersonOrBooking(cartPageItem)}
            width='30px'
            layout='center'
          >
            &#10094;
          </CustomButton>
          <span>{cartPageItem.booking.people}</span>
          <CustomButton
            aria-label="Add person to booking"
            onClick={() => addPersonToBooking(cartPageItem)}
            width='33%'
            layout='center'
          >
            &#10095;
          </CustomButton>
        </div>

        <p>{cartPageItem.booking.people === 1 ? 'Person' : 'People'}</p>
      </section>

      {/**Remove Tour Button */}
      <CustomButton
        onClick={() => removeItemFromCart(cartPageItem)}
        aria-label="Remove item from cart"
        width='8vw'
      >
        &#10005;
        <span>Remove</span>
      </CustomButton>
    </article>
  )
}

export default CartTour
