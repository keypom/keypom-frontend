import { Button, HStack } from '@chakra-ui/react';
import { type ReactElement, useState } from 'react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step';

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

// const defaultFormData: TicketDropFormData = {
//   // Step 1
//   eventName: { value: '' },
//   eventArtwork: { value: undefined },
//   eventDescription: { value: '' },
//   eventLocation: { value: '' },
//   date: {
//     value: {
//       startDate: null,
//       endDate: null,
//     },
//   },
//
//   // Step 2
//   questions: [
//     { question: 'Full name', isRequired: true },
//     { question: 'Email address', isRequired: true },
//     { question: 'How did you find out about this event?', isRequired: false },
//   ],
//
//   // Step 3
//   tickets: [],
// };

export default function NewTicketDrop() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TicketDropFormData>(placeholderData);

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

  const nextStep = () => {
    let isErr = false;
    if (currentStep === 0) {
      const { isErr: eventInfoErr, newFormData } = EventInfoFormValidation(formData);
      isErr = eventInfoErr;
      setFormData(newFormData);
    }
    if (!isErr) {
      setCurrentStep((prevStep) => (prevStep < formSteps.length - 1 ? prevStep + 1 : prevStep));
    }
    console.log(JSON.stringify(formData));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const CurrentStepComponent = formSteps[currentStep].component({ formData, setFormData });
  return (
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
            Next
          </Button>
        </HStack>
      </HStack>
    </CreateTicketDropLayout>
  );
}
