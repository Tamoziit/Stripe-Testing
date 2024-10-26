require('dotenv').config();
const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL;

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
                        name: "Tubri",
                        description: "A traditional Indian handicraft",
                        images: ["https://ruralindiaonline.org/media/images/12-tubri_14a-MM-The_Tubri_Competition.width-1400.jpg"]
                    },
                    unit_amount: 50 * 100
                },
                quantity: 1
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Tara baji",
                        description: "Premium quality spices",
                        images: ["https://ruralindiaonline.org/media/images/12-tubri_14a-MM-The_Tubri_Competition.width-1400.jpg"]
                    },
                    unit_amount: 20 * 100
                },
                quantity: 2
            }
        ],
        mode: 'payment',
        billing_address_collection: 'required',
        shipping_address_collection: {
            allowed_countries: ['IN']
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Standard Shipping',
                    type: 'fixed_amount',
                    fixed_amount: { amount: 4600, currency: 'inr' },
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 5 },
                        maximum: { unit: 'business_day', value: 7 }
                    }
                }
            }
        ],
        success_url: `${baseUrl}/complete?session_id={CHECKOUT_SESSION_ID}&order_id=12345`,
        cancel_url: `${baseUrl}/cancel?reason=user_cancelled`,
        metadata: {
            orderId: '12345',
            customerNote: 'Please deliver between 10 AM to 5 PM'
        },
        allow_promotion_codes: true
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