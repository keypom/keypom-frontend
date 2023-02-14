import { useFormContext } from 'react-hook-form';
import { Button, Divider, HStack } from '@chakra-ui/react';

import { IconBox } from '@/components/IconBox';
import { LinkIcon } from '@/components/Icons';
import { Step } from '@/components/Step/Step';
import { useDropFlowContext } from '@/features/create-drop/contexts/DropFlowContext';
import { useCreateTicketDropContext } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

export const CreateTicketDropForm = () => {
  const { onNext } = useDropFlowContext();
  const {
    reset,
    formState: { isValid, dirtyFields, defaultValues },
  } = useFormContext();

  const { currentIndex, onNextStep, onPreviousStep, formSteps } = useCreateTicketDropContext();

  const currentStep = formSteps[currentIndex];

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentIndex === index} stepItem={step} />
  ));

  // TODO: add next step to summary
  const handleSubmitClick = () => {
    onNext?.();
  };

  const handleNextStepClick = () => {
    if (currentIndex === formSteps.length - 1) {
      handleSubmitClick();
      return;
    }

    reset(defaultValues, { keepValues: true });
    onNextStep();
  };

  // isDirty from react form hook does not match with dirtyFields correctly
  // https://github.com/react-hook-form/react-hook-form/issues/4740
  const isDirty = Object.keys(dirtyFields).length > 0;

  return (
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <HStack
        flexWrap="nowrap"
        justifyContent={{ base: 'flex-start', md: 'center' }}
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
      {currentStep.component}
      <Divider my={{ base: '6', md: '8' }} />
      <HStack justifyContent="flex-end" spacing="auto">
        {currentIndex > 0 && (
          <Button
            fontSize={{ base: 'sm', md: 'base' }}
            variant="secondary"
            onClick={onPreviousStep}
          >
            Go back
          </Button>
        )}
        {currentStep.isSkipable && !isDirty ? (
          <Button
            fontSize={{ base: 'sm', md: 'base' }}
            variant="secondary"
            onClick={handleNextStepClick}
          >
            Skip this step
          </Button>
        ) : (
          <Button
            disabled={!isValid}
            fontSize={{ base: 'sm', md: 'base' }}
            onClick={handleNextStepClick}
          >
            Continue
          </Button>
        )}
      </HStack>
    </IconBox>
  );
};
