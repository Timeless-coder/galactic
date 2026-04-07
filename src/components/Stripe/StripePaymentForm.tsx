import toast from 'react-hot-toast'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const StripePaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()
    
    if (elements == null)  return

    const {error: submitError} = await elements.submit()
    if (submitError) return toast.error(submitError.message!)

    const {error} = await stripe!.confirmPayment({
      elements,
      confirmParams: {
        return_url: import.meta.env.VITE_STRIPE_RETURN_URL,
      },
    })

    if (error) toast.error(error.message!)
  }
 
	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<button type="submit" disabled={!stripe || !elements}>
				Pay
			</button>
			{/* Show error message to your customers */}
		</form>
	)
}

export default StripePaymentForm