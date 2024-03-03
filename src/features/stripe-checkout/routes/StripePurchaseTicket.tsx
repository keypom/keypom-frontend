/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { StripeUserInfoForm } from '../components/StripeInformationForm';
import { StripeEventCreateForm } from '../components/StripeCreateEventForm';
import { StripePurchaseTicketForm } from '../components/StripePurchaseTicketForm';



export const gas = '100000000000000';


// To stop concurrent scan result handling

const StripePurchaseTicket = () => {
    // Some of these should be enums
    const [eventName, setEventName] = useState("Moon's 3rd Birthday Party");
    const [stripeAccountId, setStripeAccountId] = useState('acct_1OpbrxPhXWiaemzu');
    const [ticketTier, setTicketTier] = useState('VIP');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    
    
    const { isLoggedIn } = useAuthWalletContext();

    const handleSubmitClick = async () => {
        const metadata = {
          customer_name: customerName,
          customer_email: customerEmail,
        }
        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch('http://localhost:8787/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeAccountId,
            eventName,
            ticketTier,
            metadata
          }),
        });
        if (response.ok) {
          // Account created successfully
          const responseBody = await response.json();
          console.log(responseBody)
          const stripeCheckoutUrl = responseBody.stripe_url;
          window.location.href = stripeCheckoutUrl;

        } else {
          // Error creating account
          console.log(response.json());
        }

    };

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <StripePurchaseTicketForm handleSubmitClick={handleSubmitClick} setEventName={setEventName} setStripeId={setStripeAccountId} setTicketTier={setTicketTier} setCustomerEmail={setCustomerEmail} setCustomerName={setCustomerName} />
          </VStack>
        </Center>
    );
    }else{
        return( 
        <Center height="100vh">
          <VStack spacing={4}>
            <div>Log in to Connect Stripe</div>
          </VStack>
        </Center>
        )
    }
};

export default StripePurchaseTicket;
