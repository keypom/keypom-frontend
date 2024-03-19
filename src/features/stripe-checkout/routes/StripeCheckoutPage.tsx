// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
// import { useEffect, useLayoutEffect, useState } from 'react';
// import { QrReader } from 'react-qr-reader';

// import { ViewFinder } from '@/components/ViewFinder';
// import keypomInstance from '@/lib/keypom';
// import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
// import { get, set } from '@/utils/localStorage';

// export const gas = '100000000000000';

// import {loadStripe} from '@stripe/stripe-js';
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout
// } from '@stripe/react-stripe-js';
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate
// } from "react-router-dom";
// //import {CheckoutSuccess} from "./checkout-success";

// //import "./App.css";

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// // This is a public sample test API key.
// // Don’t submit any personally identifiable information in requests made with this key.
// // Sign in to see your own test API key embedded in code samples.
// const stripePromise = loadStripe("pk_test_51OiK2DBuXHcYytHqXLHMDXOwcLOovDVD6XvZ0DGGqrOm0mTZzErygmvEFuCfO7L0CzKojUpI6EvJMBp13bOmW5WH003ui52YSz");

// export const Return = () => {
//   const [status, setStatus] = useState(null);
//   const [customerEmail, setCustomerEmail] = useState('');
//   const [txnAttempted, setTxnAttempted] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const queryString = window.location.search;
//         const urlParams = new URLSearchParams(queryString);
//         const sessionId = urlParams.get('session_id');
//         const response = await fetch(`http://localhost:4242/session-status?session_id=${sessionId}`);
//         const data = await response.json();
//         setStatus(data.status);
//         setCustomerEmail(data.customer_email);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array ensures effect runs only once

//   if (status === null) {
//     return null; // Render nothing until status is known
//   }

//   if (status === 'open') {
//     return <Navigate to="/checkout" />;
//   }

//   if (status === 'complete') {
//       return (<p>success!</p>);
//   }

//   return null; // Handle other status values or return null if none match
// };

// const StripeCheckoutPage = () => {
//   const [clientSecret, setClientSecret] = useState('');
//   console.log("hello from checkout form")
//   useEffect(() => {
//     // Create a Checkout Session as soon as the page loads
//     fetch("http://localhost:4242/create-checkout-session", {
//       method: "POST",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("hello from fetch")
//         console.log(data)
//         setClientSecret(data.clientSecret)
//       });
//   }, []);

//   return (
//     <div id="checkout">
//       {clientSecret && (
//         <EmbeddedCheckoutProvider
//           stripe={stripePromise}
//           options={{clientSecret, onComplete: () => {console.log("complete")}}}
//         >
//           <EmbeddedCheckout />
//         </EmbeddedCheckoutProvider>
//       )}
//     </div>
//   )
// };

// export default StripeCheckoutPage;
