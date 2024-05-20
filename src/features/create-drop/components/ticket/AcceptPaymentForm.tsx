import {
  HStack,
  Image,
  Heading,
  VStack,
  Divider,
  Button,
  useToast,
  Box,
  Text,
  Flex,
  Hide,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { EVENTS_WORKER_BASE } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import { useAppContext } from '@/contexts/AppContext';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';

import { type EventStepFormProps } from '../../routes/CreateTicketDropPage';

const purchaseWithStripe = new URL(
  '../../../../../public/assets/purchase_with_stripe.webp',
  import.meta.url,
);

const STRIPE_PURCHASE_IMAGE = purchaseWithStripe.href.replace(purchaseWithStripe.search, '');

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );
}

const AcceptPaymentForm = (props: EventStepFormProps) => {
  const { accountId, formData, setFormData } = props;
  const toast = useToast();
  const { fetchAttempts, nearPrice, setTriggerPriceFetch } = useAppContext();
  const handleToggle = (isStripe) => {
    let curVal = isStripe ? formData.acceptStripePayments : formData.acceptNearPayments;
    curVal = !curVal;

    if (isStripe) {
      setFormData({ ...formData, acceptStripePayments: curVal });
    } else {
      setFormData({ ...formData, acceptNearPayments: curVal });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const checkForPriorStripeConnected = (accountId: string | undefined | null) => {
    if (!accountId) {
      return null;
    }
    const stripeAccountData = localStorage.getItem('STRIPE_ACCOUNT_ID');
    const stripeAccountObject = stripeAccountData ? JSON.parse(stripeAccountData) : {};
    if (Object.keys(stripeAccountObject).length === 0) {
      return null;
    } else {
      const loggedInStripeAccountId = stripeAccountObject[`${accountId}`];
      setFormData({
        ...formData,
        stripeAccountId: loggedInStripeAccountId,
        acceptStripePayments: true,
      });
      return stripeAccountObject[`${accountId}`] || null;
    }
  };

  useEffect(() => {
    const body = localStorage.getItem('STRIPE_ACCOUNT_INFO');
    if (body) {
      const { stripeAccountId, uuid } = JSON.parse(body);
      if (window.location.href.includes(`successMessage=${uuid as string}`)) {
        localStorage.removeItem('STRIPE_ACCOUNT_INFO');
        setFormData({ ...formData, stripeAccountId, acceptStripePayments: true });
      }
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      const existingStripeAccountInfo = localStorage.getItem('STRIPE_ACCOUNT_ID');
      const existingStripeAccountInfoObj = existingStripeAccountInfo
        ? JSON.parse(existingStripeAccountInfo)
        : {};

      if (existingStripeAccountInfoObj[`${accountId}`] === undefined) {
        // Update existing object with new stripeAccountId
        existingStripeAccountInfoObj[`${accountId}`] = formData.stripeAccountId;

        // Store the updated object back to local storage
        localStorage.setItem('STRIPE_ACCOUNT_ID', JSON.stringify(existingStripeAccountInfoObj));
      }
    }
  }, [accountId, formData.stripeAccountId]);


  useEffect(() => {
    checkForPriorStripeConnected(accountId);
  }, [accountId]);

  useEffect(() => {
    if (!nearPrice) {
      setTriggerPriceFetch(true);
    } else {
      setFormData({ ...formData, nearPrice });
    }
  }, [nearPrice, fetchAttempts]);

  const handleConnectStripe = async () => {
    if (!formData.nearPrice) {
      toast({
        title: 'Unable to fetch NEAR price',
        description: `Please try again later or contact support.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    if (checkForPriorStripeConnected(accountId)) {
      return;
    }

    setIsLoading(true);
    const stripeAccountId = await keypomInstance.getStripeAccountId(accountId || '');
    if (stripeAccountId) {
      setFormData({ ...formData, stripeAccountId, acceptStripePayments: true });
      setIsLoading(false);

      // Update local storage
      let existingStripeAccoountInfo = localStorage.getItem('STRIPE_ACCOUNT_ID');
      if (!existingStripeAccoountInfo) {
        existingStripeAccoountInfo = '{}';
      }
      const existingStripeAccountInfoObj = JSON.parse(existingStripeAccoountInfo);
      existingStripeAccountInfoObj[`${accountId}`] = stripeAccountId;

      localStorage.setItem('STRIPE_ACCOUNT_ID', JSON.stringify(existingStripeAccountInfoObj));
      return;
    }

    let response: Response | undefined;
    const uuid = uuidv4();
    try {
      const body = {
        accountId,
        redirectUrl: `${window.location.origin}/drop/ticket/new?successMessage=${uuid}`,
      };

      const url = `${EVENTS_WORKER_BASE}/stripe/create-account`;
      response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error connecting to stripe: ', error);
    }

    if (response?.ok) {
      const resBody = await response.json();
      const { accountLinkUrl, stripeAccountId } = resBody;

      localStorage.setItem('STRIPE_ACCOUNT_INFO', JSON.stringify({ stripeAccountId, uuid }));
      window.location.href = accountLinkUrl;
    } else {
      toast({
        title: 'Unable to Create Stripe Account',
        description: `Please try again later or contact support.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      align="center"
      bg="white"
      borderRadius="lg"
      direction={{ base: 'column', lg: 'row' }}
      gap={4}
      justify="center"
      m={8}
      p={8}
      shadow="xl"
    >
      <VStack align="start" flex="1.6" spacing={5}>
        <Heading color="gray.700" fontSize="2xl" fontWeight="600">
          Payment Options
        </Heading>
        <Text color="gray.500" fontSize="lg">
          Select your preferred methods for payment processing.
        </Text>

        <Box bg="gray.50" borderRadius="md" p={4} w="full">
          <Heading color="gray.600" fontSize="xl" fontWeight="500">
            $NEAR Checkout
          </Heading>
          <Text color="gray.500" my={2}>
            Allow ticket purchases with $NEAR.
          </Text>
          <Divider my={2} />
          <HStack justify="space-between">
            <Text color="gray.600" fontWeight="500">
              NEAR Payments
            </Text>
            <ToggleSwitch
              disabled={true}
              handleToggle={() => {
                handleToggle(false);
              }}
              size="lg"
              toggle={formData.acceptNearPayments}
            />
          </HStack>
        </Box>
        <Box bg="gray.50" borderRadius="md" p={4} w="full">
          <Heading color="gray.600" fontSize="xl" fontWeight="500">
            Stripe Checkout
          </Heading>
          <Text color="gray.500" my={2}>
            Allow ticket purchases with credit cards.
          </Text>
          <Divider my={2} />
          <HStack justify="space-between">
            <Text color="gray.600" fontWeight="500">
              Stripe Payments
            </Text>
            <ToggleSwitch
              disabled={!formData.stripeAccountId}
              handleToggle={() => {
                handleToggle(true);
              }}
              size="lg"
              toggle={formData.acceptStripePayments}
            />
          </HStack>
        </Box>

        <Button
          colorScheme="blue"
          // isDisabled={formData.stripeAccountId !== undefined || !accountId}
          isDisabled={true}
          isLoading={isLoading}
          size="lg"
          w="full"
          onClick={!formData.stripeAccountId ? handleConnectStripe : undefined}
        >
          {!formData.stripeAccountId ? 'Connect Stripe Account' : 'Stripe Account Connected'}
        </Button>
        <Text width="100%" color="gray.400" my={-4} textAlign="center">
          Coming soon to an event near you...
          </Text>
      </VStack>

      <Hide below="lg">
        <Box flex="1">
          <Image alt="Stripe Purchase Illustration" borderRadius="md" src={STRIPE_PURCHASE_IMAGE} />
        </Box>
      </Hide>
    </Flex>
  );
};

export { AcceptPaymentForm };
