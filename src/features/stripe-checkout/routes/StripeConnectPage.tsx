/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51OiK2DBuXHcYytHqo1SoogX5L607gYvi8sJ9Tm2uPL3FgT2FU4SZWnXoWBrNWlsecyR9rHTOnKw5Cn2uk34OnFAh001IOVNnom", {
  apiVersion: '2020-08-27',
  stripeAccount: 'acct_1OiK2DBuXHcYytHq'
});


export const gas = '100000000000000';
const SCANNER_PASSWORD_KEY = 'scanner_password';


// To stop concurrent scan result handling
let scanningResultInProgress = false;
let secretKeyInCurrentTransaction = '';
let isModalOpen = false;

const StripeConnectPage = () => {
    // Some of these should be enums
    const [firstName, setFirstName] = useState('Min');
    const [lastName, setLastName] = useState('Lu');
    const [email, setEmail] = useState('minqianlu00@gmail.com');
    const [country, setCountry] = useState('US');
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('individual');
    
    const { isLoggedIn } = useAuthWalletContext();

    const handleSubmitClick = async () => {
        console.log("logged in")
        // Wallet is connected, check if account already exists, if not then create account for them

        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch('http://localhost:8787/create-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            country,
            companyType,
          }),
        });
        if (response.ok) {
          // Account created successfully
          console.log(response.json());
        } else {
          // Error creating account
          console.log(response.json());
        }

    };

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <Button onClick={handleSubmitClick}>Connect Stripe Account</Button>
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

export default StripeConnectPage;
