import { useEffect } from 'react'
import { Link } from 'react-router'

import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { addBookingsFromCart } from '../../services/firebase/bookingsService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import StripeReceipt from '../../components/Stripe/StripeReceipt'

import styles from './StripeSuccess.module.scss'

const StripeSuccessPage = () => {
  const { clearCart, cartItems } = useCart()
  const { currentUser } = useAuth()

  useEffect(() => {
    let mounted = true

    const addBookings = async () => {
      if (!currentUser || cartItems.length === 0) return
      
      try {
        const bookings = cartItems.map(item => ({
          tourId: item.tour.id,
          bookingUserId: currentUser.id,
          departureDate: item.booking.departureDate,
          people: item.booking.people
        }))
        if (mounted) {
          await addBookingsFromCart(bookings)
          clearCart()
        }
      } catch (error: any) {
        console.log(error.message)
      }
    }

    addBookings()

    return () => { mounted = false }
  }, [currentUser, cartItems])

  useEffect(() => {
      return () => {
        localStorage.removeItem('galacticCartReceiptItems')
        localStorage.removeItem('galacticCartReceiptTotal')
      }
    }, [])

  return (
    <div className={styles.paymentSuccessContainer}>

      <StripeReceipt />

      <div className={styles.continue}>
        <Link to='/tours'>
          <CustomButton>Continue Shopping</CustomButton>
        </Link>
      </div>
    </div>
  )
}

export default StripeSuccessPage
