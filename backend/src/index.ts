import express from 'express'
import cors from 'cors'
import stripe from 'stripe'
import uuid from 'uuid'
const Stripe = new stripe("pk_test_51HNSflGgw2VXXk4wvRPCtp5J6fbxfolGQiTXIKrURL6nxEW3D2zraZIuVFAiOC2DcCVj7UU6jipyuONHqKWkUJMo00LX7ARr1D", {
    apiVersion: '2020-08-27'
})
const app = express()

app.use(express.json())
app.use(cors())

app.post("/payment", (req, res) => {
    const { product, token } = req.body
    console.log("PRODUCT", product)
    console.log("PRICE", product.price)
    const idempotencyKey = uuid.v4()

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
        res.status(401).json(err)
    })
})

app.listen(3333)