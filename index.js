require('dotenv').config();
const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
const baserUrl = process.env.BASE_URL;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/checkout', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Tubri"
                    },
                    unit_amount: 50 * 100
                },
                quantity: 1
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Tara baji"
                    },
                    unit_amount: 20 * 100
                },
                quantity: 2
            }
        ],
        mode: 'payment',
        shipping_address_collection: {
            allowed_countries: ['IN']
        },
        success_url: `${baserUrl}/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baserUrl}/cancel`
    });

    res.redirect(session.url);
});

app.get('/complete', async (req, res) => {
    const data = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, {
            expand: ['payment_intent.payment_method']
        }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ]);
    const response = JSON.stringify(await data);

    console.log(response);
    res.send('Your payment was successful');
});

app.get('/cancel', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});