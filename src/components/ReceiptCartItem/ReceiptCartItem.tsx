import styles from './ReceiptCartItem.module.scss'

import type { CartItem } from '../../contexts/CartContext'

type ReceiptTourProps = {
  cartItem: CartItem
}

const ReceiptTour = ({ cartItem }: ReceiptTourProps) => {
  return (
    <div className={styles.receiptContainer}>
      <h3>{cartItem.tour.name}</h3>
      <div className={styles.tourDetailsText}>
        <h4>{cartItem.booking.departureDate}</h4>
      </div>
        <div className={styles.tourDetailsText}>
          <h4>People:</h4> <h5>{cartItem.booking.people}</h5>
        </div>
    </div>
  );
}
 
export default ReceiptTour;