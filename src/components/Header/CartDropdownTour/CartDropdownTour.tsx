import styles from './CartDropdownTour.module.scss'

import type { Booking } from '../../../types/booking'
import type { Tour } from '../../../types/tour'

type CartDropdownTourProps = {
  booking: Booking
  tour: Tour
}

const CartDropdownTour = ({ booking, tour }: CartDropdownTourProps  ) => {

  return (
    <div className={styles.cartTourContainer}>
      <img
        className={styles.cartTourImage}
        src={`${tour.imageCover}`}
        alt={tour.planet}
      />
      <div className={styles.cartTourDetailsContainer}>
        <span>{tour.planet}</span>
        <span>
          {booking.people}{' '}
          {booking.people === 1 ? 'Person' : 'People'} X $1
        </span>
      </div>
    </div>
  )
}

export default CartDropdownTour
