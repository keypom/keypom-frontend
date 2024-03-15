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


export const gas = '100000000000000';


// To stop concurrent scan result handling

const StripeUtilityTest = () => {
    // Some of these should be enums
    const [eventName, setEventName] = useState('Tired Tired Farty Party');
    const [stripeAccountId, setStripeAccountId] = useState('acct_1OpbrxPhXWiaemzu');
    const [ticketTiers, setTicketTiers] = useState([
      ["1710464229453-Platinum Ticket-4", 1000], 
    ]);
    const [eventId, setEventId] = useState('7b366e75-35fc-46c7-9deb-6024b36b31d7')
    
    const { isLoggedIn } = useAuthWalletContext();

    const handleSubmitClick = async () => {
        console.log("logged in")
        // Wallet is connected, check if account already exists, if not then create account for them

        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch('http://localhost:8787/stripe/create-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeAccountId,
            eventName,
            eventId,
            dropIDsAndPrices: ticketTiers
          }),
        });
        if (response.ok) {
          // Account created successfully
          const responseBody = await response.json();
          const product_id = responseBody.product_id;
          console.log(product_id)

        } else {
          // Error creating account
          console.log(response.json());
        }

    };

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <StripeEventCreateForm handleSubmitClick={handleSubmitClick} setEventName={setEventName} setStripeId={setStripeAccountId} />
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

export default StripeUtilityTest;
