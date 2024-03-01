/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { StripeUserInfoForm } from '../components/StripeInformationForm';


export const gas = '100000000000000';


// To stop concurrent scan result handling

const StripeConnectPage = () => {
    // Some of these should be enums
    const [firstName, setFirstName] = useState('Min');
    const [lastName, setLastName] = useState('Lu');
    const [email, setEmail] = useState('minqianlu00@gmail.com');
    const [country, setCountry] = useState('US');
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
          const responseBody = await response.json();
          const accountLinkUrl = responseBody.accountLinkUrl;
          window.location.href = accountLinkUrl;
        } else {
          // Error creating account
          console.log(response.json());
        }

    };

    // TODO: MAKE FORM TO COLLECT SOME USER INFO PRIOR TO CONNECTING STRIPE ACCOUNT
    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <StripeUserInfoForm handleSubmitClick={handleSubmitClick} setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} />
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
