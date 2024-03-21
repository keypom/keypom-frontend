import { Button, HStack } from '@chakra-ui/react';
import { type ReactElement, useState, useEffect } from 'react';
import { type Action, type Wallet } from '@near-wallet-selector/core';

import { get } from '@/utils/localStorage';
import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { EVENTS_WORKER_BASE, KEYPOM_EVENTS_CONTRACT } from '@/constants/common';

import { CreateTicketDropLayout } from '../components/CreateTicketDropLayout';
import { CollectInfoForm } from '../components/ticket/CollectInfoForm';
import {
  CreateTicketsForm,
  type TicketInfoFormMetadata,
} from '../components/ticket/CreateTicketsForm';
import {
  ClearEventInfoForm,
  EventInfoForm,
  EventInfoFormValidation,
} from '../components/ticket/EventInfoForm';
import { ReviewEventForm } from '../components/ticket/ReviewEventForm';
import { KeypomPasswordPromptModal } from '../components/ticket/KeypomPasswordPromptModal';
import {
  createPayload,
  estimateCosts,
  serializeMediaForWorker,
} from '../components/ticket/helpers';
import { AcceptPaymentForm } from '../components/ticket/AcceptPaymentForm';

interface TicketStep {
  title: string;
  description: string;
  name: string;
  skippable: boolean;
  canClearDetails: boolean;
  component: (props: EventStepFormProps) => ReactElement;
}

export interface EventDate {
  startDate: Date | null;
  endDate: Date | null;
  startTime?: string;
  endTime?: string;
}

export interface EventStepFormProps {
  formData: TicketDropFormData;
  setFormData: (data: TicketDropFormData) => void;
  accountId: string | null | undefined;
}

export interface TicketDropFormData {
  // Step 0
  stripeAccountId?: string;
  acceptStripePayments: boolean;
  acceptNearPayments: boolean;
  nearPrice?: number;

  // Step 1
  eventName: { value: string; error?: string };
  eventDescription: { value: string; error?: string };
  eventLocation: { value: string; error?: string };
  date: { value: EventDate; error?: string };
  eventArtwork: { value: File | undefined; error?: string };

  // Step 2
  questions: Array<{ question: string; isRequired: boolean }>;

  // Step 3
  tickets: TicketInfoFormMetadata[];

  costBreakdown: {
    marketListing: string;
    total: string;
    perDrop: string;
    perEvent: string;
  };
}

const breadcrumbs: IBreadcrumbItem[] = [
  {
    name: 'My events',
    href: '/events',
  },
  {
    name: 'Create event',
    href: '/drops/ticket/new',
  },
];

const formSteps: TicketStep[] = [
  {
    name: 'stripePayments',
    title: 'Payments',
    description: 'Allow attendees to purchase with credit cards',
    skippable: true,
    canClearDetails: false,
    component: (props: EventStepFormProps) => <AcceptPaymentForm {...props} />,
  },
  {
    name: 'eventInfo',
    title: 'Event info',
    description: 'Enter the details for your new event',
    canClearDetails: true,
    skippable: false,
    component: (props: EventStepFormProps) => <EventInfoForm {...props} />,
  },
  {
    name: 'collectInfo',
    title: 'Attendee info',
    description: 'Collect information from attendees (optional)',
    canClearDetails: true,
    skippable: true,
    component: (props: EventStepFormProps) => <CollectInfoForm {...props} />,
  },
  {
    name: 'tickets',
    title: 'Tickets',
    description: 'Create tickets for your event',
    canClearDetails: true,
    skippable: false,
    component: (props: EventStepFormProps) => <CreateTicketsForm {...props} />,
  },
  {
    name: 'review',
    title: 'Review',
    description: 'Review the details of your event',
    canClearDetails: false,
    skippable: false,
    component: (props: EventStepFormProps) => <ReviewEventForm {...props} />,
  },
];

// const placeholderData = {
//   eventName: { value: 'Vandelay Industries Networking Event' },
//   eventArtwork: { value: undefined },
//   eventDescription: {
//     value:
//       'Meet with the best latex salesmen in the industry! This will be a once-in-a-lifetime opportunity to network and meet with people that you enjoy being with. Drink beer, laugh, have fun, and have a great time at this networking event! This will be a once-in-a-lifetime opportunity!',
//   },
//   eventLocation: { value: '129 West 81st Street, Apartment Suite 288.' },
//   date: {
//     value: {
//       value: {
//         value: { startDate: null, endDate: null },
//         startDate: '2024-03-16T04:00:00.000Z',
//         endDate: null,
//       },
//       startDate: new Date('2024-03-16T04:00:00.000Z'),
//       endDate: new Date('2024-03-23T04:00:00.000Z'),
//       startTime: '09:00 AM',
//       endTime: '09:00 PM',
//     },
//   },
//   questions: [
//     { question: 'Full name', isRequired: true },
//     { question: 'Email address', isRequired: true },
//     { question: 'How did you find out about this event?', isRequired: false },
//   ],
//   tickets: [
//     {
//       name: 'VIP Ticket',
//       description:
//         'Get exclusive access to beer, fun, and games. Network with people, grant priority access to lines and skip the wait with this amazing ticket tier!',
//       price: '5',
//       artwork: undefined,
//       salesValidThrough: {
//         startDate: new Date('2024-03-13T04:00:00.000Z'),
//         endDate: new Date('2024-03-23T04:00:00.000Z'),
//       },
//       passValidThrough: {
//         startDate: new Date('2024-03-18T04:00:00.000Z'),
//         endDate: new Date('2024-03-22T04:00:00.000Z'),
//       },
//       maxSupply: 5000,
//     },
//     {
//       name: 'Standard Ticket',
//       description: 'Get standard access to the networking event',
//       artwork: undefined,
//       price: '0',
//       salesValidThrough: {
//         startDate: new Date('2024-03-13T04:00:00.000Z'),
//         endDate: new Date('2024-03-23T04:00:00.000Z'),
//       },
//       passValidThrough: {
//         startDate: new Date('2024-03-18T04:00:00.000Z'),
//         endDate: new Date('2024-03-22T04:00:00.000Z'),
//       },
//       maxSupply: 5000,
//     },
//   ],
//   actions: [],
//   costBreakdown: {
//     perEvent: '0',
//     perDrop: '0',
//     total: '0',
//     marketListing: '0',
//   },
// };

const placeholderData: TicketDropFormData = {
  // Step 0
  nearPrice: undefined,
  stripeAccountId: undefined,
  acceptStripePayments: false,
  acceptNearPayments: true,
  // Step 1
  eventName: { value: '' },
  eventArtwork: { value: undefined },
  eventDescription: { value: '' },
  eventLocation: { value: '' },
  date: {
    value: {
      startDate: null,
      endDate: null,
    },
  },

  // Step 2
  questions: [
    { question: 'Full name', isRequired: true },
    { question: 'Email address', isRequired: true },
    { question: 'How did you find out about this event?', isRequired: false },
  ],

  // Step 3
  tickets: [],
  costBreakdown: {
    perEvent: '0',
    perDrop: '0',
    total: '0',
    marketListing: '0',
  },
};

export default function NewTicketDrop() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingKey, setIsSettingKey] = useState(false);
  const [formData, setFormData] = useState<TicketDropFormData>(placeholderData);
  const { selector, accountId } = useAuthWalletContext();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    async function fetchWallet() {
      if (!selector) return;
      try {
        const wallet = await selector.wallet();
        setWallet(wallet);
      } catch (error) {
        console.error('Error fetching wallet:', error);
        // Handle the error appropriately
      }
    }

    fetchWallet();
  }, [selector]);

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setFormData((prev) => ({ ...prev, ...ClearEventInfoForm() }));
        break;
      case 1:
        setFormData((prev) => ({ ...prev, questions: [] }));
        break;
      case 2:
        setFormData((prev) => ({ ...prev, tickets: [] }));
        break;
      default:
        break;
    }
  };

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentStep === index} stepItem={step} />
  ));

  const handleModalClose = async () => {
    setIsSettingKey(true);
    await estimateCosts({
      accountId: accountId!,
      formData,
      setFormData,
      setCurrentStep,
    });
    setIsSettingKey(false);
    setIsModalOpen(false);
  };

  const payAndCreateEvent = async () => {
    if (!wallet) return;

    setIsSettingKey(true);
    const serializedData = await serializeMediaForWorker(formData);

    let response: Response | undefined;
    try {
      const url = `${EVENTS_WORKER_BASE}/ipfs-pin`;
      response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ base64Data: serializedData }),
      });
    } catch (error) {
      console.log('error', error);
    }

    if (response?.ok) {
      const resBody = await response.json();
      const cids: string[] = resBody.cids;

      const eventArtworkCid: string = cids[0];
      const ticketArtworkCids: string[] = [];
      for (let i = 0; i < cids.length - 1; i++) {
        ticketArtworkCids.push(cids[i + 1]);
      }

      const actions: Action[] = await createPayload({
        accountId: accountId!,
        formData,
        eventArtworkCid,
        ticketArtworkCids,
      });

      await wallet.signAndSendTransaction({
        signerId: accountId!,
        receiverId: KEYPOM_EVENTS_CONTRACT,
        actions,
      });
    }
    setIsSettingKey(false);
  };

  const nextStep = async () => {
    if (currentStep === 4) {
      payAndCreateEvent();
      return;
    }

    if (currentStep === 3) {
      const curMasterKey = get('MASTER_KEY');
      if (curMasterKey) {
        setIsSettingKey(true);
        await estimateCosts({
          accountId: accountId!,
          setFormData,
          formData,
          setCurrentStep,
        });
        setIsSettingKey(false);
      } else {
        setIsModalOpen(true);
      }
      return;
    }

    let isErr = false;
    if (currentStep === 1) {
      const { isErr: eventInfoErr, newFormData } = EventInfoFormValidation(formData);
      isErr = eventInfoErr;
      setFormData(newFormData);
    }
    if (!isErr) {
      setCurrentStep((prevStep) => (prevStep < formSteps.length - 1 ? prevStep + 1 : prevStep));
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const CurrentStepComponent = formSteps[currentStep].component({
    formData,
    setFormData,
    accountId,
  });
  return (
    <>
      <KeypomPasswordPromptModal
        isOpen={isModalOpen}
        isSetting={isSettingKey}
        onModalClose={handleModalClose}
      />
      <CreateTicketDropLayout
        breadcrumbs={breadcrumbs}
        description={formSteps[currentStep].description}
      >
        <IconBox
          icon={<LinkIcon h={{ base: '7', md: '9' }} />}
          maxW="full"
          mx="auto"
          px={{ base: '6', md: '8' }}
          py={{ base: '6', md: '12' }}
        >
          <HStack
            flexWrap="nowrap"
            justifyContent={{ base: 'flex-start', sm: 'center' }}
            mt={{ base: '8', md: '0' }}
            overflowX={{ base: 'scroll', md: 'visible' }}
            spacing={{ base: '2', md: '4' }}
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
            }}
          >
            {stepsDisplay}
          </HStack>
          {CurrentStepComponent}
        </IconBox>
        <HStack justifyContent="space-between" py={{ base: '4' }} spacing="auto">
          <HStack>
            <Button
              fontSize={{ base: 'sm', md: 'base' }}
              isDisabled={currentStep === 0}
              variant="secondary"
              onClick={prevStep}
            >
              Back
            </Button>
            {formSteps[currentStep].canClearDetails && (
              <Button
                fontSize={{ base: 'sm', md: 'base' }}
                variant="ghost"
                onClick={handleClearForm}
              >
                Clear all details
              </Button>
            )}
          </HStack>
          <HStack>
            {formSteps[currentStep].skippable && (
              <Button
                fontSize={{ base: 'sm', md: 'base' }}
                variant="secondary"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, questions: [] }));
                  setCurrentStep((prev) => prev + 1);
                }}
              >
                Skip
              </Button>
            )}
            <Button
              fontSize={{ base: 'sm', md: 'base' }}
              isDisabled={currentStep === 3 ? formData.tickets.length < 1 : false}
              isLoading={isSettingKey}
              onClick={nextStep}
            >
              {currentStep === formSteps.length - 1 ? 'Create event' : 'Next'}
            </Button>
          </HStack>
        </HStack>
      </CreateTicketDropLayout>
    </>
  );
}
