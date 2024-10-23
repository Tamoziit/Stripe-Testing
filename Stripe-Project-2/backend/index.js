require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require("uuid");

const app = express();
const PORT = process.env.PORT2 || 8282;

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
    res.send("Stripe Test 2");
});

app.post("/payment", async (req, res) => {
    const { product, token } = req.body;
    console.log("Product", product);
    console.log("Price", product.price);

    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempotencyKey });
    })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});