import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import StripeCheckout, { Token } from 'react-stripe-checkout'

function App() {

  const [product, setProduct] = useState({
    name: "react by fb",
    productBy: "facebook",
    price: 180
  })

  const makePayment = (token: Token) => {
    const body = {
      token,
      product
    }

    const headers = {
      "Content-Type": "application/json"
    }

    return fetch(`http://localhost:3333/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(res => {
      console.log("RESPONSE", res)
      console.log(res.status)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <StripeCheckout token={makePayment} stripeKey={String(process.env.REACT_APP_KEY)}
        name="Buy react" amount={product.price * 100}>
          <button className="btn btn-large blue">Buy react</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
