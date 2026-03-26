import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from '../Payment/Payment'

const promise = loadStripe("pk_test_rmIJuNRa6eXw7MGQPKRoGlsg0002CNZNtQ");

export default function Stripe() {
  return (  
    <div className="App">  
      <Elements stripe={promise}>  
        <Payment />  
      </Elements>  
    </div>  
  );  
}
  