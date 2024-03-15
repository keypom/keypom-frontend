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


function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let result = "";
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
  }
  return result;
}

// To stop concurrent scan result handling

const StripePurchaseTicket = () => {
    // Some of these should be enums
    const [eventName, setEventName] = useState("Moon's 3rd Birthday Party");
    const [stripeAccountId, setStripeAccountId] = useState('acct_1OpbrxPhXWiaemzu');
    const [ticketTier, setTicketTier] = useState('VIP');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    
    
    const { isLoggedIn } = useAuthWalletContext();

    const handleFreeClick = async () => {
      const workerPayload = {
        name: "Min",
        ticketAmount: 1,
        buyerAnswers: generateRandomString(512),
        ticket_info: {
          location: 'Freeterloo',
          eventName: "Tired Boss Event",
          ticketType: "FREE BALLERS",
          eventDate: 'February 31 2024',
          ticketOwner: 'min-ticket-test.testnet',
          eventId: 'beca3fed-9661-4408-b988-475e7f822ee0',
          dropId: '1710446192034-All-Day Ticket-4',
        },
        purchaseEmail: "mq2lu@uwaterloo.ca",
        stripeAccountId: "acct_1OpbrxPhXWiaemzu",
        baseUrl: "http://localhost:3000"
      };

      const response = await fetch('http://localhost:8787/purchase-free-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerPayload),
      });
      if (response.ok) {
        // Account created successfully
        const responseBody = await response.json();
        console.log(responseBody)
        const stripeCheckoutUrl = responseBody.stripe_url;
        window.location.href = stripeCheckoutUrl;

      } else {
        // Error creating account
        const responseBody = await response.json();
        console.log(responseBody.error);
      }

  };

    const handleSubmitClick = async () => {
        const workerPayload = {
          name: "Min",
          ticketAmount: 2,
          buyerAnswers: generateRandomString(512),
          ticket_info: {
            location: 'Waterloo',
            eventName: "Big Party",
            ticketType: "VIP",
            eventDate: 'February 31 2024',
            ticketOwner: 'min-ticket-test.testnet',
            eventId: '7b366e75-35fc-46c7-9deb-6024b36b31d7',
            dropId: '1710464229453-Platinum Ticket-4',
          },
          purchaseEmail: "mq2lu@uwaterloo.ca",
          stripeAccountId: "acct_1OpbrxPhXWiaemzu",
          baseUrl: "http://localhost:3000"
        };

        //  EXPECTED PAYLOAD
        // workerPayload: {
        //   name: string | undefined,
        //   ticketAmount,                                                    //(number of tickets being purchase)
        //   buyerAnswers string | undefined,                                 //(encrypted user answers)
        //   ticket_info: {
        //     location: string | undefined,
        //     eventName,
        //     ticketType,
        //     eventDate,
        //     ticketOwner: string | undefined                               //(if signed in, this is signed in account, otherwise its none/empty)
        //     eventId,
        //     dropId,
        //   }
        //   purchaseEmail,
        //   stripeAccountId: string | undefined                            //(only undefined if funder is not stripe registered),
        //   baseUrl
        // }
        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch('http://localhost:8787/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workerPayload),
        });
        if (response.ok) {
          // Account created successfully
          const responseBody = await response.json();
          console.log(responseBody)
          const stripeCheckoutUrl = responseBody.stripe_url;
          window.location.href = stripeCheckoutUrl;

        } else {
          // Error creating account
          const responseBody = await response.json();
          console.log(responseBody.error);
        }

    };

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <StripePurchaseTicketForm handleSubmitClick={handleSubmitClick} setEventName={setEventName} setStripeId={setStripeAccountId} setTicketTier={setTicketTier} setCustomerEmail={setCustomerEmail} setCustomerName={setCustomerName} />
            <Button mt="4" type="submit" onClick={handleFreeClick}>
                Free Ticket
            </Button>
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
