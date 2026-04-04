import { format, isValid, parseISO } from 'date-fns'

import styles from './ReceiptCartItem.module.scss'

import type { CartItem } from '../../contexts/CartContext'

type ReceiptTourProps = {
  cartItem: CartItem
}

const ReceiptTour = ({ cartItem }: ReceiptTourProps) => {
  const parsedDate = parseISO(cartItem.booking.departureDate)
  const formattedDate = isValid(parsedDate) ? format(parsedDate, 'PPPP') : 'Invalid date'

  return (
    <article className={styles.receiptContainer}>
      <header>
        <h3>{cartItem.tour.name}</h3>
      </header>
      <section className={styles.tourDetailsText}>
        <h4>Departure Date: <strong><em>{formattedDate}</em></strong></h4>
      </section>
      <section className={styles.tourDetailsText}>
        <h4>People:</h4> <h5><strong><em>{cartItem.booking.people}</em></strong></h5>
      </section>
    </article>
  );
}
 
export default ReceiptTour;