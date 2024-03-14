import { Button, HStack } from '@chakra-ui/react';
import { type ReactElement, useState, useEffect } from 'react';
import { type Wallet } from '@near-wallet-selector/core';
import { parseNearAmount } from 'keypom-js';

import { get } from '@/utils/localStorage';
import keypomInstance from '@/lib/keypom';
import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type FunderEventMetadata, type FunderMetadata } from '@/lib/eventsHelpers';
import {
  deriveKeyFromPassword,
  encryptPrivateKey,
  exportPublicKeyToBase64,
  generateKeyPair,
  uint8ArrayToBase64,
} from '@/lib/cryptoHelpers';
import { KEYPOM_EVENTS_CONTRACT, KEYPOM_MARKET_CONTRACT } from '@/constants/common';

import { CreateTicketDropLayout } from '../components/CreateTicketDropLayout';
import { CollectInfoForm } from '../components/ticket/CollectInfoForm';
import {
  CreateTicketsForm,
  type TicketInfoFormMetadata,
} from '../components/ticket/CreateTicketsForm';
import {
  ClearEventInfoForm,
  eventDateToPlaceholder,
  EventInfoForm,
  EventInfoFormValidation,
} from '../components/ticket/EventInfoForm';
import { ReviewEventForm } from '../components/ticket/ReviewEventForm';
import { KeypomPasswordPromptModal } from '../components/ticket/KeypomPasswordPromptModal';

interface TicketStep {
  title: string;
  name: string;
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
}

export interface TicketDropFormData {
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
    name: 'eventInfo',
    title: 'Event info',
    component: (props: EventStepFormProps) => <EventInfoForm {...props} />,
  },
  {
    name: 'collectInfo',
    title: 'Collect info',
    component: (props: EventStepFormProps) => <CollectInfoForm {...props} />,
  },
  {
    name: 'tickets',
    title: 'Tickets',
    component: (props: EventStepFormProps) => <CreateTicketsForm {...props} />,
  },
  {
    name: 'review',
    title: 'Review',
    component: (props: EventStepFormProps) => <ReviewEventForm {...props} />,
  },
];

const placeholderData = {
  eventName: { value: 'Vandelay Industries Networking Event' },
  eventArtwork: { value: undefined },
  eventDescription: {
    value:
      'Meet with the best latex salesmen in the industry! This will be a once-in-a-lifetime opportunity to network and meet with people that you enjoy being with. Drink beer, laugh, have fun, and have a great time at this networking event! This will be a once-in-a-lifetime opportunity!',
  },
  eventLocation: { value: '129 West 81st Street, Apartment Suite 288.' },
  date: {
    value: {
      value: {
        value: { startDate: null, endDate: null },
        startDate: '2024-03-16T04:00:00.000Z',
        endDate: null,
      },
      startDate: new Date('2024-03-16T04:00:00.000Z'),
      endDate: new Date('2024-03-23T04:00:00.000Z'),
      startTime: '09:00 AM',
      endTime: '09:00 PM',
    },
  },
  questions: [
    { question: 'Full name', isRequired: true },
    { question: 'Email address', isRequired: true },
    { question: 'How did you find out about this event?', isRequired: false },
  ],
  tickets: [
    {
      name: 'VIP Ticket',
      description:
        'Get exclusive access to beer, fun, and games. Network with people, grant priority access to lines and skip the wait with this amazing ticket tier!',
      price: '5',
      artwork: undefined,
      salesValidThrough: {
        startDate: new Date('2024-03-13T04:00:00.000Z'),
        endDate: new Date('2024-03-23T04:00:00.000Z'),
      },
      passValidThrough: {
        startDate: new Date('2024-03-18T04:00:00.000Z'),
        endDate: new Date('2024-03-22T04:00:00.000Z'),
      },
      maxSupply: 5000,
    },
    {
      name: 'Standard Ticket',
      description: 'Get standard access to the networking event',
      artwork: undefined,
      price: '0',
      salesValidThrough: {
        startDate: new Date('2024-03-13T04:00:00.000Z'),
        endDate: new Date('2024-03-23T04:00:00.000Z'),
      },
      passValidThrough: {
        startDate: new Date('2024-03-18T04:00:00.000Z'),
        endDate: new Date('2024-03-22T04:00:00.000Z'),
      },
      maxSupply: 5000,
    },
  ],
};

const defaultFormData: TicketDropFormData = {
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
};

export default function NewTicketDrop() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TicketDropFormData>(defaultFormData);
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
      case 3:
        break;
      default:
        break;
    }
  };

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentStep === index} stepItem={step} />
  ));

  const handleModalClose = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    payAndCreateEvent();
  };

  const payAndCreateEvent = async () => {
    if (!wallet) return;
    const eventId = Date.now().toString();
    console.log('Event ID: ', eventId);
    const masterKey = get('MASTER_KEY');

    const funderInfo = await keypomInstance.viewCall({
      methodName: 'get_funder_info',
      args: { account_id: accountId! },
    });
    const funderMetadata: FunderMetadata =
      funderInfo === undefined || funderInfo === null ? {} : JSON.parse(funderInfo.metadata);
    console.log('Deploying Event: ', formData.eventName.value);

    const date = formData.date.value.endTime
      ? {
          date: {
            from: formData.date.value.startDate!.toISOString(),
            to: formData.date.value.endDate!.toISOString(),
          },
          time: eventDateToPlaceholder('', formData.date.value),
        }
      : {
          date: formData.date.value.startDate!.toISOString(),

          time: eventDateToPlaceholder('', formData.date.value),
        };

    const eventMetadata: FunderEventMetadata = {
      name: formData.eventName.value,
      dateCreated: Date.now().toString(),
      description: formData.eventDescription.value,
      location: formData.eventLocation.value,
      date,
      artwork: formData.eventArtwork.value ? formData.eventArtwork.value[0] : '',
      questions: formData.questions.map((question) => ({
        question: question.question,
        required: question.isRequired || false,
      })),
      id: eventId.toString(),
    };

    if (formData.questions.length > 0) {
      console.log('Event has questions. Generate keypairs');
      const { publicKey, privateKey } = await generateKeyPair();
      const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
      const saltBase64 = uint8ArrayToBase64(saltBytes);
      const symmetricKey = await deriveKeyFromPassword(masterKey, saltBase64);
      const { encryptedPrivateKeyBase64, ivBase64 } = await encryptPrivateKey(
        privateKey,
        symmetricKey,
      );

      eventMetadata.pubKey = await exportPublicKeyToBase64(publicKey);
      eventMetadata.encPrivKey = encryptedPrivateKeyBase64;
      eventMetadata.iv = ivBase64;
      eventMetadata.salt = saltBase64;
    }

    funderMetadata[eventId] = eventMetadata;
    console.log('Deployed Event: ', eventMetadata);

    const drop_ids: string[] = [];
    const drop_configs: any = [];
    const asset_datas: any = [];
    const ticket_information: Record<string, any> = {};

    for (const ticket of formData.tickets) {
      const dropId = `${Date.now().toString()}-${ticket.name
        .replaceAll(' ', '')
        .toLocaleLowerCase()}`;

      ticket_information[`${dropId}`] = {
        max_tickets: ticket.maxSupply,
        price: ticket.price,
      };

      const dropConfig = {
        metadata: JSON.stringify(ticket),
        add_key_allowlist: [KEYPOM_MARKET_CONTRACT],
        transfer_key_allowlist: [KEYPOM_MARKET_CONTRACT],
      };
      const assetData = [
        {
          uses: 2,
          assets: [null],
          config: {
            permissions: 'claim',
          },
        },
      ];
      drop_ids.push(dropId);
      asset_datas.push(assetData);
      drop_configs.push(dropConfig);
    }

    console.log(`Creating event with ticket information: ${JSON.stringify(ticket_information)}`);

    const funderMetadataString = JSON.stringify(funderMetadata);
    console.log('Funder Metadata: ', funderMetadataString);

    await wallet.signAndSendTransaction({
      signerId: accountId!,
      receiverId: KEYPOM_EVENTS_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_drop_batch',
            args: {
              drop_ids,
              drop_configs,
              asset_datas,
              change_user_metadata: JSON.stringify(funderMetadata),
              on_success: {
                receiver_id: KEYPOM_MARKET_CONTRACT,
                method_name: 'create_event',
                args: JSON.stringify({
                  event_id: eventId,
                  funder_id: accountId!,
                  ticket_information,
                }),
                attached_deposit: parseNearAmount('1'),
              },
            },
            gas: '300000000000000',
            deposit: parseNearAmount('10')!,
          },
        },
      ],
    });
  };

  const nextStep = () => {
    if (currentStep === 3) {
      const curMasterKey = get('MASTER_KEY');
      console.log('curMasterKey', curMasterKey);
      if (curMasterKey) {
        payAndCreateEvent();
      } else {
        setIsModalOpen(true);
      }
    } else {
      let isErr = false;
      if (currentStep === 0) {
        const { isErr: eventInfoErr, newFormData } = EventInfoFormValidation(formData);
        isErr = eventInfoErr;
        setFormData(newFormData);
      }
      if (!isErr) {
        setCurrentStep((prevStep) => (prevStep < formSteps.length - 1 ? prevStep + 1 : prevStep));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const CurrentStepComponent = formSteps[currentStep].component({ formData, setFormData });
  return (
    <>
      <KeypomPasswordPromptModal isOpen={isModalOpen} onModalClose={handleModalClose} />
      <CreateTicketDropLayout
        breadcrumbs={breadcrumbs}
        description="Enter the details for your new event"
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
        <HStack justifyContent="flex-end" py={{ base: '4' }} spacing="auto">
          <HStack>
            <Button
              fontSize={{ base: 'sm', md: 'base' }}
              isDisabled={currentStep === 0}
              variant="secondary"
              onClick={prevStep}
            >
              Back
            </Button>
            <Button fontSize={{ base: 'sm', md: 'base' }} variant="ghost" onClick={handleClearForm}>
              Clear all details
            </Button>
          </HStack>
          <HStack>
            {currentStep === 1 && (
              <Button
                fontSize={{ base: 'sm', md: 'base' }}
                variant="secondary"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, questions: [] }));
                  setCurrentStep(2);
                }}
              >
                Skip
              </Button>
            )}
            <Button
              fontSize={{ base: 'sm', md: 'base' }}
              isDisabled={currentStep === 2 ? formData.tickets.length < 1 : false}
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
