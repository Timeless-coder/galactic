import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import { useCart } from '../../hooks/useCart'

import ReceiptTour from '../ReceiptCartItem/ReceiptCartItem'

import styles from './StripeReceipt.module.scss'

const StripeReceipt = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({ contentRef })
  const { cartItems, total } = useCart()

    return (
      <>
        <div className={styles.receipt} ref={contentRef}>
          <h2>GalacticTours</h2>
          {cartItems.map(cartItem => (
            <ReceiptTour key={cartItem.booking.id} cartItem={cartItem} />
          ))}
          <h3 className={styles.cost}>Total Cost: ${total}</h3>
        </div>

        <button onClick={reactToPrintFn}>Print Receipt</button>
      </>
    )
  }  

  export default StripeReceipt