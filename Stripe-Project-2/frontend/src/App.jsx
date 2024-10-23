import { useState } from 'react'
import './App.css'
import StripeCheckout from "react-stripe-checkout";

function App() {
  const [product, setProduct] = useState({
    name: "FulJhuri",
    price: 100,
    productBy: "FB"
  });

  const makePayment = (token) => {
    const body = {
      token,
      product
    }

    const headers = {
      "Content-Type": "application/json"
    }

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(response => {
      console.log("Response", response);
      const { status } = response;
      console.log("Status", status);
    })
      .catch(err => console.log(err))
  }

  return (
    <>
      <StripeCheckout
        stripeKey={import.meta.env.VITE_APP_STRIPE_KEY}
        token={makePayment}
        name="Buy"
        amount={product.price * 100}
      >
        <button className="btn-large cyan">Buy Now!</button>
      </StripeCheckout>
    </>
  )
}

export default App
