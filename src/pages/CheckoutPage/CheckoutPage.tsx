import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { loadStripe } from '@stripe/stripe-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import toast from 'react-hot-toast'

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
  const { cartItems, totalCostForPurchase } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const options = useMemo<OptionsConfig>(() => ({
    clientSecret: clientSecret!,
  }), [clientSecret])

  useEffect(() => {
    if (!currentUser) navigate('/auth')
  }, [currentUser, navigate])

  useEffect(() => {
    if (totalCostForPurchase <= 0) return

    const fetchClientSecret = async () => {
      if (currentUser) {
        try {
            const functions = getFunctions()
            const createPaymentIntent = httpsCallable<{ amount: number; userId: string; cartItems: { tourId: string; tourName: string; departureDate: string; people: number }[] }, { clientSecret: string }>(functions, 'createPaymentIntent')
            const result = await createPaymentIntent({
              amount: Math.round(totalCostForPurchase * 100),
              userId: currentUser.id,
              cartItems: cartItems.map(item => ({
                tourId: item.booking.tourId,
                tourName: item.tour.name,
                departureDate: item.booking.departureDate,
                people: item.booking.people,
              })),
            })
            setClientSecret(result.data.clientSecret)
          }
          catch (err: any) {
            console.error(err.message)
            toast.error(`Unable to initialize payment: ${err.message ?? err}`)
          }
      }
        
      else return toast.error('Please log in to proceed')
   
  }

  fetchClientSecret()
}, [totalCostForPurchase, cartItems, currentUser, navigate])

  return (
    <section className={styles.checkoutContainer} aria-labelledby="checkout-page-title">
      <div className={styles.checkoutContents}>
        <header>
          <h1 id="checkout-page-title">Thank you so much for choosing GalacticTours!</h1>
        </header>
        {totalCostForPurchase > 0
          ? <h3>Review your payment amount of:<span>${totalCostForPurchase}</span></h3>
          : <h3>Please add at least one tour before checking out.</h3>}

        {clientSecret && <Stripe promise={stripePromise} options={options} />}

        <div className={styles.warningContainer} role="alert" aria-live="polite">
          *Please use the following test credit card for payments*
          <br />
          4242 4242 4242 4242 - Exp: 05/28 - CVV: 586
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage