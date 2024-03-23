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

const freeEventId = "7983f2af-3c7f-4bbb-b4b4-420d0e239f92";
const freeDropId = "1710855051884-General Admission Ticket-3"

const stripeEventId = "a92b09a4-f414-49bc-bd98-ca4855eb2bda";
const stripeDropId = "1711141577391-Exclusive Ticket-2";



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
          eventName: "Cloudflare Rally",
          ticketType: "winter warmers",
          eventDate: 'February 31 2024',
          ticketOwner: 'min-ticket-test.testnet',
          eventId: freeEventId,
          dropId: freeDropId,
          funderId: "minqi.testnet"
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

  const handleTestClick = async () => {
    await fetch ('http://localhost:8787/test-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'abc'
      },
    })
  }

  const handleEmailClick = async () => {
    const workerPayload = {
      name: "Min",
      ticketAmount: 1,
      buyerAnswers: generateRandomString(512),
      ticket_info: {
        location: 'Freeterloo',
        eventName: "Anti-Cloudflare Event",
        ticketType: "cloudflare idiots",
        eventDate: 'February 31 2024',
        ticketOwner: 'min-ticket-test.testnet',
        eventId: freeEventId,
        dropId: freeDropId,
        funderId: "minqi.testnet"
      },
      purchaseEmail: "mq2lu@uwaterloo.ca",
      stripeAccountId: "acct_1OpbrxPhXWiaemzu",
      baseUrl: "http://localhost:3000"
    };
    
    const response = await fetch('http://localhost:8787/test-email-binding', {
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

        console.log(stripeEventId, stripeDropId)
        const workerPayload = {
          name: "Min",
          ticketAmount: 4,
          buyerAnswers: generateRandomString(512),
          ticket_info: {
            location: 'Poopoo',
            eventName: "Small Party",
            ticketType: "VIP",
            eventDate: 'February 31 2024',
            eventId: stripeEventId,
            dropId: stripeDropId,
            funderId: "minqi.testnet"
          },
          purchaseEmail: "mq2lu@uwaterloo.ca",
          stripeAccountId: "acct_1OpbrxPhXWiaemzu",
          baseUrl: "http://localhost:3000"
        };

        //1711141577391-Exclusive%20Ticket-2#BPUeU26uNYmVpDnW1pPnJhVvMwMe9QMdsczBMJ7XTFX8QqzauvgYBo4R7FLEVfsF75neXDnwmvLAGg3jf3zAdjQ

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
            <Button mt="4" type="submit" onClick={handleTestClick}>
                Test
            </Button>
            <Button mt="4" type="submit" onClick={handleFreeClick}>
                Free Ticket Test
            </Button>
            <Button mt="4" type="submit" onClick={handleEmailClick}>
                Email Test
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
