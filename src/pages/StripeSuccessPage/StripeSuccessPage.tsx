import { Link } from 'react-router'

import { useCart } from '../../hooks/useCart'

import CustomButton from '../../elements/CustomButton/CustomButton'
import StripeReceipt from '../../components/Stripe/StripeReceipt'

import styles from './StripeSuccess.module.scss'

const StripeSuccessPage = () => {
  const { clearCart } = useCart()

  return (
    <div className={styles.paymentSuccessContainer}>
      <h1>Thank you so much for choosing GalacticTours!</h1>
      <h2 className={styles.enjoy}>Enjoy your trip!</h2>

      <StripeReceipt />

      <div className={styles.continue} onClick={clearCart}>
        <Link to='/tours'>
          <CustomButton rect around between>Continue Shopping</CustomButton>
        </Link>
      </div>
    </div>
  )
}

export default StripeSuccessPage
