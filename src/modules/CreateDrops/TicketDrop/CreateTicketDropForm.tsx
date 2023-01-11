import { useFormContext } from 'react-hook-form';
import { Button, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { Step, StepItem } from '@/common/components/Step/Step';
import { useSteps } from '@/common/hooks/useSteps';

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { EventInfoForm } from './EventInfoForm';
import { SignUpInfoForm } from './SignUpInfoForm';
import { AdditionalGiftsForm } from './AdditionalGiftsForm/AdditionalGiftsForm';

export interface CreateTicketDropFormFieldTypes {
  nftName: string;
  description: string;
  artwork: string;
  selectedToWallets: string[];
  redirectLink?: string;
}

const formSteps: StepItem[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <EventInfoForm />,
  },
  {
    name: 'signUpInfo',
    title: 'Sign-up info',
    component: <SignUpInfoForm />,
  },
  {
    name: 'additionalGifts',
    title: 'Additional gifts',
    component: <AdditionalGiftsForm />,
    submitOnNextClick: true,
  },
];

export const CreateTicketDropForm = () => {
  const { onNext } = useDropFlowContext();
  const {
    onNext: onNextStep,
    onPrevious: onPreviousStep,
    currentIndex,
  } = useSteps({ maxSteps: formSteps.length });
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid, errors },
  } = useFormContext();

  console.log(errors);

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentIndex === index} stepItem={step} />
  ));

  const handleSubmitClick = () => {
    onNext();
  };

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <HStack flexWrap="nowrap" justifyContent="center" spacing="4">
        {stepsDisplay}
      </HStack>
      {formSteps[currentIndex].component}
      <Divider my={{ base: '6', md: '8' }} />
      <HStack justifyContent="flex-end" spacing="auto">
        {currentIndex > 0 && (
          <Button variant="secondary" onClick={onPreviousStep}>
            Go back
          </Button>
        )}
        <Button variant="secondary" onClick={onNext}>
          Skip this step
        </Button>
      </HStack>
    </IconBox>
  );
};
