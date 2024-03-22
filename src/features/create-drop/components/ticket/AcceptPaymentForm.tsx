import { HStack, Image, Heading, VStack, Divider, Hide, Button, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { EVENTS_WORKER_BASE } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { useAppContext } from '@/contexts/AppContext';

import { type EventStepFormProps } from '../../routes/CreateTicketDropPage';

const purchaseWithStripe = new URL(
  '../../../../../public/assets/purchase_with_stripe.webp',
  import.meta.url,
);

const STRIPE_PURCHASE_IMAGE = purchaseWithStripe.href.replace(purchaseWithStripe.search, '');

const contentItem = (title: string, subtitle: string) => {
  return (
    <VStack align="start" marginTop="1" spacing="0">
      <Heading color="gray.700" fontFamily="body" fontSize="md" fontWeight="700" textAlign="left">
        {title}
      </Heading>
      <Heading color="gray.500" fontFamily="body" fontSize="md" fontWeight="400" textAlign="left">
        {subtitle}
      </Heading>
    </VStack>
  );
};

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

  useEffect(() => {
    const body = localStorage.getItem('STRIPE_ACCOUNT_INFO');
    if (body) {
      const { stripeAccountId, uuid } = JSON.parse(body);
      if (window.location.href.includes(`successMessage=${uuid as string}`)) {
        console.log('Stripe Account Connected: ', stripeAccountId);
        localStorage.removeItem('STRIPE_ACCOUNT_INFO');
        setFormData({ ...formData, stripeAccountId, acceptStripePayments: true });
      }
    }
  }, []);

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

    setIsLoading(true);
    const stripeAccountId = await keypomInstance.getStripeAccountId(accountId!);

    if (stripeAccountId) {
      setFormData({ ...formData, stripeAccountId, acceptStripePayments: true });
      setIsLoading(false);
      return;
    }

    let response: Response | undefined;
    const uuid = uuidv4();
    try {
      const body = {
        accountId: accountId!,
        redirectUrl: `${window.location.origin}/drop/ticket/new?successMessage=${uuid}`,
      };

      const url = `${EVENTS_WORKER_BASE}/stripe/create-account`;
      response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log('error', error);
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
    <HStack align="start" justify="space-between" marginTop="10">
      <VStack align="start" alignItems="start">
        <Heading color="gray.800" fontSize="3xl" fontWeight="700" textAlign="left">
          Enable Stripe Checkout
        </Heading>
        <Heading
          alignSelf="left"
          color="gray.400"
          fontFamily="body"
          fontSize="md"
          fontWeight="400"
          paddingBottom="3"
          textAlign="left"
        >
          Enable easy checkout with Stripe. Attendees will be able to purchase tickets with credit
          cards.
        </Heading>

        {contentItem(
          'Withdraw to Bank Account',
          'Directly withdraw any earnings to your bank account.',
        )}

        {contentItem('Easy checkout', 'No need for attendees to create a wallet.')}

        <VStack alignItems="start" paddingTop="5" spacing="0" textAlign="left" w="full">
          <HStack justify="space-between" spacing="auto" width="100%">
            <Heading
              color="gray.800"
              fontFamily="body"
              fontSize="md"
              fontWeight="700"
              textAlign="left"
            >
              Enable Stripe
            </Heading>
            <ToggleSwitch
              disabled={!formData.stripeAccountId}
              handleToggle={() => {
                handleToggle(true);
              }}
              size="lg"
              toggle={formData.acceptStripePayments}
            />
          </HStack>
          {!formData.stripeAccountId && (
            <Heading
              color="red.500"
              fontFamily="body"
              fontSize="md"
              fontWeight="400"
              textAlign="left"
            >
              Connect Stripe to enable payments
            </Heading>
          )}
        </VStack>

        {!formData.stripeAccountId ? (
          <Button
            autoFocus={false}
            isDisabled={false}
            isLoading={isLoading}
            my="5"
            variant="secondary"
            width="full"
            onClick={() => {
              handleConnectStripe();
            }}
          >
            Connect Stripe Account
          </Button>
        ) : (
          <Button
            autoFocus={false}
            isDisabled={true}
            isLoading={isLoading}
            my="5"
            variant="secondary"
            width="full"
          >
            Stripe Account Connected
          </Button>
        )}

        <Divider bgColor="gray.300" height="3px" my="3" />
        <Heading color="gray.800" fontSize="3xl" fontWeight="700" marginTop="5" textAlign="left">
          Enable $NEAR Checkout
        </Heading>
        <Heading
          alignSelf="left"
          color="gray.400"
          fontFamily="body"
          fontSize="md"
          fontWeight="400"
          textAlign="left"
        >
          Allow attendees to purchase tickets with $NEAR. The funds will go directly into your
          wallet.
        </Heading>

        <HStack justify="space-between" paddingTop="4" spacing="auto" width="100%">
          <Heading
            color="gray.800"
            fontFamily="body"
            fontSize="md"
            fontWeight="700"
            textAlign="left"
          >
            Enable NEAR Payments
          </Heading>
          <ToggleSwitch
            handleToggle={() => {
              handleToggle(false);
            }}
            size="lg"
            toggle={formData.acceptNearPayments}
          />
        </HStack>
      </VStack>
      <Hide below="md">
        <Image
          alt="Stripe Purchase Illustration"
          objectFit="cover"
          src={STRIPE_PURCHASE_IMAGE}
          w="40%"
        />
      </Hide>
    </HStack>
  );
};

export { AcceptPaymentForm };
