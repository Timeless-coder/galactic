import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import { useCart } from '../../../hooks/useCart'

import styles from './HeaderCartDropdownTour.module.scss'

type CartDropdownTourProps = {
  booking: Booking
  tour: Tour
}

const CartDropdownTour = ({ booking, tour }: CartDropdownTourProps  ) => {
  const { currentPricePerTour: currentPrice } = useCart()

  return (
    <article className={styles.cartTourContainer}>
      <figure>
        <img className={styles.cartTourImage} src={tour.imageCover} alt="" />
      </figure>
      <section className={styles.cartTourDetailsContainer}>
        <span>{tour.planet}</span>
        <span>
          {booking.people}{' '}
          {booking.people === 1 ? 'Person' : 'People'} X ${currentPrice}
        </span>
      </section>
    </article>
  )
}

export default CartDropdownTour
