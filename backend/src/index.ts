import express from 'express'
import cors from 'cors'
import stripe from 'stripe'
import dotenv from 'dotenv'
import { v4 as uuid } from 'uuid'

dotenv.config()

const Stripe = new stripe(String(process.env.KEY), {
    apiVersion: '2020-08-27'
})
const app = express()

app.use(express.json())
app.use(cors())

app.post("/payment", (req, res) => {
    const { product, token } = req.body
    console.log("PRODUCT", product)
    console.log("PRICE", product.price)
    const idempotencyKey = uuid()

    return Stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        Stripe.charges.create({
            amount: product.price * 100,
            currency: 'brl',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country,
                    line1: 'react client'
                }
            }
        }, { idempotencyKey })
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        res.json(err)
    })
})

app.listen(3333)