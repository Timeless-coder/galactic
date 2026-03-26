import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Link } from 'react-router-dom'

import CustomButton from '../../../elements/CustomButton/CustomButton'
import StripeReceipt from './StripeReceipt'

import styles from './StripeSuccess.module.scss'

const StripeSucces = ({ location }) => {
  const { receipt, total } = location.state
  const receiptRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current
  })

  return (
    <div className={styles.paymentSuccessContainer}>
      <h1>Thank you so much for choosing GalacticTours!</h1>
      <h2 className={styles.enjoy}>Enjoy your trip!</h2>

      <StripeReceipt receipt={receipt} total={total} ref={receiptRef} />

      <div className={styles.print} onClick={handlePrint}>
        <CustomButton>Print Receipt</CustomButton>
      </div>

      <div className={styles.continue}>
        <Link to='/tours'>
          <CustomButton>Continue Shopping</CustomButton>
        </Link>
      </div>
    </div>
  )
}

export default StripeSucces
