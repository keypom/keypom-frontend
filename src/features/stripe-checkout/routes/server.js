// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const stripe_object = stripe('sk_test_51OiK2DBuXHcYytHqo1SoogX5L607gYvi8sJ9Tm2uPL3FgT2FU4SZWnXoWBrNWlsecyR9rHTOnKw5Cn2uk34OnFAh001IOVNnom');

const YOUR_DOMAIN = 'http://127.0.0.1:5173/fydp-frontend';

console.log(`your domain: ${YOUR_DOMAIN}`)

app.post('/create-checkout-session', async (req, res) => {
  //console.log(stripe);

  const session = await stripe_object.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OiK7gBuXHcYytHqLcpvDEzP',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe_object.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Server running on port 4242'));