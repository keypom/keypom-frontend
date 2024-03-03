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
    const [eventName, setEventName] = useState('');
    const [stripeAccountId, setStripeAccountId] = useState('');
    const [ticketTiers, setTicketTiers] = useState([["General Admission", 2000], ["VIP", 5000]]);
    
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
            eventName,
            stripeAccountId,
            ticketTiersAndPrices: ticketTiers
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
