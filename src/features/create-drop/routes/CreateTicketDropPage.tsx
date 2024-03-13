import { Button, HStack } from '@chakra-ui/react';
import { type ReactElement, useState } from 'react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step';

import { ClearEventInfoForm, EventInfoForm, EventInfoFormValidation } from '../components/ticket';
import { EventInfoSchema } from '../contexts/CreateTicketDropContext/FormValidations';
import { CreateTicketDropLayout } from '../components/CreateTicketDropLayout';
import { CollectInfoForm } from '../components/ticket/CollectInfoForm';
import {
  CreateTicketsForm,
  type TicketInfoFormMetadata,
} from '../components/ticket/CreateTicketsForm';

interface TicketStep {
  title: string;
  name: string;
  component: (props: EventStepFormProps) => ReactElement;
  schema: typeof EventInfoSchema;
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
    schema: EventInfoSchema,
  },
  {
    name: 'collectInfo',
    title: 'Collect info',
    component: (props: EventStepFormProps) => <CollectInfoForm {...props} />,
    schema: EventInfoSchema,
  },
  {
    name: 'tickets',
    title: 'Tickets',
    component: (props: EventStepFormProps) => <CreateTicketsForm {...props} />,
    schema: EventInfoSchema,
  },
  {
    name: 'review',
    title: 'Review',
    component: (props: EventStepFormProps) => <EventInfoForm {...props} />,
    schema: EventInfoSchema,
  },
];

export default function NewTicketDrop() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TicketDropFormData>({
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
      { question: 'Email address', isRequired: false },
      { question: 'How did you find out about this event?', isRequired: false },
    ],

    // Step 3
    tickets: [],
  });

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
