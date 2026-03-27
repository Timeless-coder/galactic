import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { IoArrowBackCircleOutline } from 'react-icons/io5'

import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import type { CartItem } from '../../contexts/CartContext'
import { createNewBooking } from '../../services/firebase/bookingsService'

import CustomButton from '../../elements/CustomButton/CustomButton'

import formStyles from '../../elements/Form.module.scss'

const StripePaymentForm = () => {
	const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { cartItems, total } = useCart()
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    if (elements == null)  return

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit()
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message!)
      return
    }

    const {error} = await stripe!.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/sale-complete-success',
      },
    })

    if (error) {
      setErrorMessage(error.message!)
    } else {
			console.log('good')
    }
  }

 
	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button type="submit" disabled={!stripe || !elements}>
				Pay
			</button>
			{/* Show error message to your customers */}
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	)
}

export default StripePaymentForm