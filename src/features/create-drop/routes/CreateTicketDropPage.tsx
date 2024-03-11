import { Button, HStack } from '@chakra-ui/react';
import { type ReactElement, useState } from 'react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step';

import { EventInfoForm } from '../components/ticket';
import { EventInfoSchema } from '../contexts/CreateTicketDropContext/FormValidations';
import { CreateTicketDropLayout } from '../components/CreateTicketDropLayout';

interface TicketStep {
  title: string;
  name: string;
  component: (props: EventStepFormProps) => ReactElement;
  schema: typeof EventInfoSchema;
}

interface EventDate {
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
  eventName: { value: string; error?: string };
  eventDescription: { value: string; error?: string };
  eventLocation: { value: string; error?: string };
  date: { value: EventDate; error?: string };
  eventArtwork: { value: string; error?: string };
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
    component: (props: EventStepFormProps) => <EventInfoForm {...props} />,
    schema: EventInfoSchema,
  },
  {
    name: 'tickets',
    title: 'Tickets',
    component: (props: EventStepFormProps) => <EventInfoForm {...props} />,
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
    eventName: { value: '' },
    eventArtwork: { value: '' },
    eventDescription: { value: '' },
    eventLocation: { value: '' },
    date: {
      value: {
        startDate: null,
        endDate: null,
      },
    },
  });

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentStep === index} stepItem={step} />
  ));

  const nextStep = () => {
    let isErr = false;
    if (currentStep === 0) {
      const newFormData = { ...formData };
      if (formData.eventName.value === '') {
        newFormData.eventName = { ...formData.eventName, error: 'Event name is required' };
        isErr = true;
      }
      if (formData.eventArtwork.value === '') {
        newFormData.eventArtwork = { ...formData.eventArtwork, error: 'Event artwork is required' };
        isErr = true;
      }
      if (formData.eventDescription.value === '') {
        newFormData.eventDescription = {
          ...formData.eventDescription,
          error: 'Event description is required',
        };
        isErr = true;
      }
      if (formData.eventLocation.value === '') {
        newFormData.eventLocation = {
          ...formData.eventLocation,
          error: 'Event location is required',
        };
        isErr = true;
      }
      if (formData.date.value.startDate === null) {
        newFormData.date = { ...formData.date, error: 'Event date is required' };
        isErr = true;
      }
      setFormData(newFormData);
    }
    if (!isErr) {
      setCurrentStep((prevStep) => (prevStep < formSteps.length - 1 ? prevStep + 1 : prevStep));
    }
  };

  // const nextStep = () => {
  //   setCurrentStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : prevStep));
  // };

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
        {currentStep > 0 && (
          <Button fontSize={{ base: 'sm', md: 'base' }} variant="secondary" onClick={prevStep}>
            Back
          </Button>
        )}
        <Button disabled={false} fontSize={{ base: 'sm', md: 'base' }} onClick={nextStep}>
          Next
        </Button>
      </HStack>
    </CreateTicketDropLayout>
  );
}
