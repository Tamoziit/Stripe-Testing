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

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});