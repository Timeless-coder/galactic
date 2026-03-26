import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { IoArrowBackCircleOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import type { CartItem } from '../../contexts/CartContext'
import { createNewBooking } from '../../services/firebase/bookingsService'

import CustomButton from '../../elements/CustomButton/CustomButton'

import styles from './Payment.module.scss'
import formStyles from '../../../elements/Form.module.scss'

const Stripe = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { cartItems, total } = useCart()
  const [succeeded, setSucceeded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  let receipt: CartItem[] = []
  const stripe = useStripe()
  const elements = useElements()

  const cardStyle = {
    style: {
      base: {
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '20px'
      },
      empty: {
        iconColor: 'white',
        '::placeholder': {
          color: 'rgba(255, 255, 255, .2)'
        }
      },
      complete: {
        color: 'var(--primary-blue-50)'
      },
      invalid: {
        color: '#ff5f5f',
        iconColor: '#ff5f5f'
      }
    }
  }

  const addBookingsToFirestore = async () => {
    await Promise.all(cartItems.map(cartItem => createNewBooking({
      tourId: cartItem.booking.tourId,
      bookingUserId: currentUser!.id,
      departureDate: cartItem.booking.departureDate,
      people: cartItem.booking.people,
    })))
  }

  const handleChange = async(event: any) => {
    setDisabled(event.empty)
  }

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    try {
      setProcessing(true)
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)
        }
      })
      if (payload.error) {
        setProcessing(false)
        navigate(`/account/${currentUser!.id}/checkout`)
      }
      else {
        await addBookingsToFirestore()
        navigate(`/account/${currentUser!.id}/success`, { state: { receipt, total } })
        setProcessing(false)
        setSucceeded(true)
        receipt = cartItems
      }
    }
    catch (err){
        console.log('placeholder')
    }
  }

  useEffect(() => {
    let mounted = true

    fetch('http://localhost:4242/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tours: cartItems })
    })
    .then(res => res.json())
    .then(data => {
      if (mounted) setClientSecret(data.clientSecret)
    })
    .catch((error: any) => {
      console.error(error.message)
    })

    return () => { mounted = false }
  
  }, [cartItems])

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutContents}>
        <h2>Thank you so much for choosing GalacticTours!</h2>
        {total > 0
          ? <h3>Review your payment amount of:<span>${total}</span></h3>
          : <h3>Please add at least one tour before checking out.</h3> }
        <Link to={`/account/${currentUser!.id}/checkout`}>
          <CustomButton rect between around>
            <IoArrowBackCircleOutline />
            Review Selections
          </CustomButton>
        </Link>
        <form className={formStyles.formContainer} style={{ width: 'clamp(360px, 80%, 700px)'}} onSubmit={handleSubmit}>
          <label htmlFor="cardNumber">Card Number</label>
          <CardNumberElement
            id='cardNumber'
            className={styles.element}
            options={cardStyle}
            onChange={handleChange}
          />
          <label htmlFor="expiry">Card Expiration</label>
          <CardExpiryElement
            id='expiry'
            className={styles.element}
            options={cardStyle}
            onChange={handleChange}
          />
          <label htmlFor="cvc">CVC</label>
          <CardCvcElement
            id='cvc'
            className={styles.element}
            options={cardStyle}
            onChange={handleChange}
          />
          <div className={styles.inputContainer}>
            <input type='submit' name='submit' disabled={succeeded || processing || disabled || total === 0}
              value={processing ? 'Processing...' : `Place Your Order:  $${total}`} />
          </div>
        </form>
        <div className={styles.warningContainer}>
          *Please use the following test credit card for payments*
          <br />
          4242 4242 4242 4242 - Exp: 05/23 - CVV: 586
        </div>
      </div>
      
    </div>
  )
}

export default Stripe

//  disabled={succeeded || processing || disabled}
