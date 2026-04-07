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

  const tourLabel = `${cartPageItem.tour.planet} tour`

  return (
    <article className={styles.checkoutTourContainer}>

      {/**Cover Image */}
      <figure className={styles.imageContainer}>
        <img src={cartPageItem.tour.imageCover} alt="" />
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
            aria-label={
              cartPageItem.booking.people === 1
                ? `Remove ${tourLabel} from cart`
                : `Remove one traveler from ${tourLabel}`
            }
            onClick={() => removePersonOrBooking(cartPageItem)}
            width='44px'
            fontSize="clamp(18px, 1.2vw, 22px)"
            layout='center'
          >
          <span font-size="clamp(18px, 1.2vw, 22px)" aria-hidden='true'>&#10094;</span>
          </CustomButton>

          <span aria-live='polite' aria-atomic='true'>
            {cartPageItem.booking.people}
          </span>

          <CustomButton
            aria-label={`Add one traveler to ${tourLabel}`}
            onClick={() => addPersonToBooking(cartPageItem)}
            width='44px'
            fontSize="clamp(18px, 1.2vw, 22px)"
            layout='center'
          >
            <span font-size="clamp(18px, 1.2vw, 22px)" aria-hidden='true'>&#10095;</span>
          </CustomButton>
        </div>

        <p>{cartPageItem.booking.people === 1 ? 'Person' : 'People'}</p>
      </section>

      {/**Remove Tour Button */}
      <CustomButton
        onClick={() => removeItemFromCart(cartPageItem)}
        aria-label={`Remove ${tourLabel} from cart`}
        width='clamp(96px, 18vw, 128px)'
        fontSize="clamp(14px, 0.95vw, 16px)"
      >
        <span aria-hidden='true'>&#10005;</span>
        <span>Remove</span>
      </CustomButton>
    </article>
  )
}

export default CartTour
