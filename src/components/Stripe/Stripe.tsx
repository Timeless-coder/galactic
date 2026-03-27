import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from './StripePaymentForm'

type StripeProps = {
  promise: ReturnType<typeof loadStripe>
  options: { clientSecret: string }
}

export default function Stripe({ promise, options }: StripeProps) {
  return (  
    <div className="App">  
      <Elements stripe={promise} options={options}>  
        <StripePaymentForm />  
      </Elements>  
    </div>  
  );  
}
  