import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { loadStripe } from '@stripe/stripe-js'
import { getFunctions, httpsCallable } from 'firebase/functions'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import Stripe from '../../components/Stripe/Stripe'

import styles from './CheckoutPage.module.scss'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

type OptionsConfig = {
  clientSecret: string
}

const CheckoutPage = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { cartItems, total } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const options: OptionsConfig = {
    clientSecret: clientSecret!,
  }

  useEffect(() => {
    if (!currentUser) navigate('/auth')
  }, [currentUser])

  useEffect(() => {
    if (total <= 0) return

    localStorage.setItem('galacticCartReceiptItems', JSON.stringify(cartItems)) // only for receipt
    localStorage.setItem('galacticCartReceiptTotal', JSON.stringify(total))

    const functions = getFunctions()
    const createPaymentIntent = httpsCallable<
      { amount: number; userId: string; cartItems: { tourId: string; departureDate: string; people: number }[] },
      { clientSecret: string }
    >(functions, 'createPaymentIntent')
    createPaymentIntent({
      amount: Math.round(total * 100),
      userId: currentUser!.id,
      cartItems: cartItems.map(item => ({
        tourId: item.booking.tourId,
        departureDate: item.booking.departureDate,
        people: item.booking.people,
      })),
    }).then(result => setClientSecret(result.data.clientSecret))
  }, [total])

  return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutContents}>
          <h2>Thank you so much for choosing GalacticTours!</h2>
          {total > 0
            ? <h3>Review your payment amount of:<span>${total}</span></h3>
            : <h3>Please add at least one tour before checking out.</h3> }

          {clientSecret && <Stripe promise={stripePromise} options={options} />}   
      
          <div className={styles.warningContainer}>
            *Please use the following test credit card for payments*
            <br />
            4242 4242 4242 4242 - Exp: 05/28 - CVV: 586
          </div>
        </div>
      
      </div>
  )
}

export default CheckoutPage