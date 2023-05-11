import { Button, HStack } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { IconBox } from '@/components/IconBox';
import { EventIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useCreateEventDropsContext } from '@/features/create-drop/contexts/CreateEventDropsContext';
import { Step } from '@/components/Step';

// const { defaultWallet } = getConfig();

export const CreateEventDropsForm = () => {
  const { onNext } = useDropFlowContext();
  const { currentIndex, onNextStep, onPreviousStep, formSteps } = useCreateEventDropsContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();
  const currentStep = formSteps[currentIndex];

  const stepsDisplay = formSteps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentIndex === index} stepItem={step} />
  ));

  const handleSubmitClick = (data) => {
    onNext?.();
  };

  return (
    <IconBox icon={<EventIcon />} maxW={{ base: '21.5rem', md: '36rem' }} mx="auto">
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

      <form onSubmit={handleSubmit(handleSubmitClick)}>
        {currentStep.component}
        <HStack>
          <Button w="full">Next</Button>
          {currentIndex > 0 && (
            <Button
              fontSize={{ base: 'sm', md: 'base' }}
              variant="secondary"
              w="full"
              onClick={onPreviousStep}
            >
              Go back
            </Button>
          )}
        </HStack>

        {/* <Flex justifyContent="flex-end">
          <Button
            isDisabled={ticketFields.length === 0 || !isDirty || !isValid}
            mt="10"
            type="submit"
          >
            Continue to summary
          </Button>
        </Flex> */}
      </form>
    </IconBox>
  );
};

/**
 * drop metadata
 * --------------
 * event id, event name, drop name, wallets
 * event id: 'drop name - event id'
 */
