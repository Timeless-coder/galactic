import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const StripePaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    
    if (elements == null)  return

    const {error: submitError} = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message!)
      return
    }

    const {error} = await stripe!.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/sale-complete-success',
      },
    })

    if (error) setErrorMessage(error.message!)
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