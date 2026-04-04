import { useEffect } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'

import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { addBookingsFromCart } from '../../services/firebase/bookingsService'
import { useFirestoreMutateService } from '../../hooks/useFirestoreMutateService'

import CustomButton from '../../elements/CustomButton/CustomButton'
import StripeReceipt from '../../components/Stripe/StripeReceipt'

import styles from './StripeSuccess.module.scss'

const StripeSuccessPage = () => {
  const { clearCart, cartItems } = useCart()
  const { currentUser } = useAuth()
  const { mutate: addAllCartItemsToBookings, error } = useFirestoreMutateService((items: any[]) => addBookingsFromCart(items))

  useEffect(() => {
    if (!currentUser) {
      toast.error("We're sorry. No one is currently logged in. Please contact customer service.")
      return
    }
    else if (cartItems.length === 0) {
      toast.error(`We're sorry, ${currentUser.displayName}. We could not locate your receipt. Please contact customer service.`)
      return
    }

   const addAllToFirestore = async() => {
     try {
      const bookingsToAdd = cartItems.map(item => ({
        tourId: item.tour.id,
        bookingUserId: currentUser.id,
        departureDate: item.booking.departureDate,
        people: item.booking.people
      }));
      await addAllCartItemsToBookings(bookingsToAdd)
        
      toast.success(`Thank you for your purchase, ${currentUser.displayName}! Your receipt is ready to print.`) 
      clearCart()
    }
    catch(err: any) {
      console.error(err.message)
      toast.error(`An error occurred while processing your order: ${error?.message || err.message}. Please contact customer service for assistance.`)
    }
   }
   
    addAllToFirestore()

  }, [clearCart, addAllCartItemsToBookings])

  useEffect(() => {
      return () => {
        localStorage.removeItem('galacticCartReceiptItems')
        localStorage.removeItem('galacticCartReceiptTotal')
      }
    }, [])

  return (
    <section className={styles.paymentSuccessContainer} aria-labelledby="stripe-success-title">
      <header>
        <h1 id="stripe-success-title">Payment Successful!</h1>
      </header>

      <StripeReceipt />

      <div className={styles.continue}>
        <Link to='/tours' aria-label="Continue Shopping">
          <CustomButton>Continue Shopping</CustomButton>
        </Link>
      </div>
    </section>
  )
}

export default StripeSuccessPage
