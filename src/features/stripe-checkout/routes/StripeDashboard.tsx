/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { StripeUserInfoForm } from '../components/StripeInformationForm';
import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';


export const gas = '100000000000000';


// To stop concurrent scan result handling

const StripeDashboard = () => {
    // Some of these should be enums
    const [pendingBalance, setPendingBalance] = useState('4000');
    const [availableBalance, setAvailableBalance] = useState('4000');
    const [loginLink, setLoginLink] = useState('');

    const { isLoggedIn } = useAuthWalletContext();
    
    const stripeAccountId = get('STRIPE_ACCOUNT_ID');

    const getUserInfo = async () => {
        console.log("logged in")
        // Wallet is connected, check if account already exists, if not then create account for them

        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch(`http://localhost:8787/stripe/get-account?stripeAccountId=${stripeAccountId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          // Account created successfully
          const responseBody = await response.json();
          //setLoginLink(responseBody.loginLink);
          setPendingBalance(responseBody.pending_balance);
          setAvailableBalance(responseBody.available_balance);

          //window.location.href = loginLink;
        } else {
          // Error getting dashboard
          console.log(response.json());
        }

    };

    getUserInfo();

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <IconBox
                icon={<TicketIcon height={{ base: '6', md: '8' }} width={{ base: '6', md: '8' }} />}
                maxW={{ base: '21.5rem', md: '36rem' }}
                mx="auto"
            >
                <Heading as="h1" textAlign="center" mb="4">Your Stripe Balance</Heading>
                <Box>
                    <p>Pending Balance: ${pendingBalance} USD</p>
                    <p>Available Balance: ${availableBalance} USD</p>
                    <p><a href={loginLink}>View Stripe Dashboard</a></p>
                </Box>
            </IconBox>
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

export default StripeDashboard;
