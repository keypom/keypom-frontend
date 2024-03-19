/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { StripeUserInfoForm } from '../components/StripeInformationForm';
import { async } from 'rxjs';
import DeviceInfoSDK from '../deviceInfoSDK';

export const gas = '100000000000000';


// To stop concurrent scan result handling

const StripeConnectPage = () => {
    // Some of these should be enums
    const [firstName, setFirstName] = useState('Min');
    const [lastName, setLastName] = useState('Lu');
    const [email, setEmail] = useState('minqianlu00@gmail.com');
    const [country, setCountry] = useState('US');
    const [companyType, setCompanyType] = useState('individual');

    const [encodedData, setEncodedData] = useState('');
    const [isLikelyBot, setIsLikelyBot] = useState(null);
    
    const { isLoggedIn } = useAuthWalletContext();

    const handleSubmitClick = async () => {
        console.log("logged in")
        // Wallet is connected, check if account already exists, if not then create account for them

        // make a fetch request to localhost:8787 to create a new account
        const response = await fetch('http://localhost:8787/stripe/create-account', {
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
          set('STRIPE_ACCOUNT_ID', responseBody.accountId);
          set('STRIPE_ACCOUNT_LINK_URL', accountLinkUrl);
          window.location.href = accountLinkUrl;
        } else {
          // Error creating account
          console.log(response.json());
        }

    };

    const handleSubmitClick2 = async () => {
      console.log("logged in")
      // Wallet is connected, check if account already exists, if not then create account for them

      // make a fetch request to localhost:8787 to create a new account
      const response = await fetch('http://localhost:8787/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num: 5
        })
      });
      if (response.ok) {
        // Account created successfully
        const responseBody = await response.json();
        const num_events = responseBody.num_events;
        console.log("num_events: " + num_events);
      } else {
        // Error creating account
        const responseBody = await response.json();
        console.log(responseBody.error)
      }

  };

  const shardDogClick = async () => {
    //API key to use: 8d3N9kjvn8BeUIs
    DeviceInfoSDK.fetchIPDetails('8d3N9kjvn8BeUIs').then((base64Info) => {
      setEncodedData(base64Info);

      console.log("base64Info: " + base64Info)

      console.log(atob(base64Info)) 

      const botURL = "https://api.shard.dog/check-bot"

      const xhr = new XMLHttpRequest();
      xhr.open("POST", botURL, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("x-device-fingerprint", base64Info);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            console.log('Data successfully sent to the server');
            // Process response here, e.g., updating state based on the response
            console.log(xhr.responseText)
            const responseContent = JSON.parse(xhr.responseText); // Adjust depending on actual response format
            console.log(responseContent)
            console.log(responseContent.isLikelyBot)
            setIsLikelyBot(responseContent.isLikelyBot); // Adjust based on your actual response structure
          } else {
            console.error('Error sending data to the server');
          }
        }
      };
      //pass in accountId, seriesId, and the contract these are tied to
      const payload = JSON.stringify({});
      xhr.send(payload);
    });
  }

    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            <StripeUserInfoForm handleSubmitClick={handleSubmitClick} setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} />
            <Button mt="4" type="submit" onClick={handleSubmitClick2}>
                Test
            </Button>
            <Button mt="4" type="submit" onClick={shardDogClick}>
                ShardDog
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

export default StripeConnectPage;
