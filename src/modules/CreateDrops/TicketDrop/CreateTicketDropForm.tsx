import { useFormContext } from 'react-hook-form';
import { Button, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { Step } from '@/common/components/Step/Step';

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { useCreateTicketDropContext } from './CreateTicketDropContext';

export const CreateTicketDropForm = () => {
  const { onNext } = useDropFlowContext();
  const {
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    formState: { isValid, dirtyFields, errors, defaultValues, touchedFields },
  } = useFormContext();

  const { currentIndex, onNextStep, onPreviousStep, formSteps } = useCreateTicketDropContext();

  const currentStep = formSteps[currentIndex];

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentIndex === index} stepItem={step} />
  ));

  const handleSubmitClick = () => {
    onNext();
  };

  const handleNextStepClick = () => {
    reset(defaultValues, { keepValues: true });
    onNextStep();
  };

  const isDirty = Object.keys(dirtyFields).length > 0;

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <HStack flexWrap="nowrap" justifyContent="center" spacing="4">
        {stepsDisplay}
      </HStack>
      {currentStep.component}
      <Divider my={{ base: '6', md: '8' }} />
      <HStack justifyContent="flex-end" spacing="auto">
        {currentIndex > 0 && (
          <Button variant="secondary" onClick={onPreviousStep}>
            Go back
          </Button>
        )}
        {currentStep.isSkipable && !isDirty ? (
          <Button variant="secondary" onClick={handleNextStepClick}>
            Skip this step
          </Button>
        ) : (
          <Button disabled={!isValid} onClick={handleNextStepClick}>
            Continue
          </Button>
        )}
      </HStack>
    </IconBox>
  );
};
