import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

import styles from './HeaderCartDropdownTour.module.scss'

type CartDropdownTourProps = {
  booking: Booking
  tour: Tour
}

const CartDropdownTour = ({ booking, tour }: CartDropdownTourProps  ) => {

  return (
    <article className={styles.cartTourContainer}>
      <figure>
        <img className={styles.cartTourImage} src={`${tour.imageCover}`} alt={tour.planet} />
      </figure>
      <section className={styles.cartTourDetailsContainer}>
        <span>{tour.planet}</span>
        <span>
          {booking.people}{' '}
          {booking.people === 1 ? 'Person' : 'People'} X $1
        </span>
      </section>
    </article>
  )
}

export default CartDropdownTour
