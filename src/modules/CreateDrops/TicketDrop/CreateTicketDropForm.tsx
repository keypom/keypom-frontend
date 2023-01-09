import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { IconBox } from '@/common/components/IconBox';
import { FormControl } from '@/common/components/FormControl';
import { LinkIcon } from '@/common/components/Icons';
import { MultiStepForm, StepItem } from '@/common/components/MultiStep/MultiStep';

import { useDropFlowContext } from '../contexts/DropFlowContext';

const formSteps: StepItem[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <Box>Form 1</Box>,
  },
  {
    name: 'signUpInfo',
    title: 'Sign-up info',
    component: <Box>Form 2</Box>,
  },
  {
    name: 'additionalGifts',
    title: 'Additional gifts',
    component: <Box>Form 3</Box>,
  },
];

export const CreateTicketDropForm = () => {
  const { onNext } = useDropFlowContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid },
  } = useFormContext();

  const handleSubmitClick = () => {
    onNext();
  };

  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }} mx="auto">
      <MultiStepForm steps={formSteps} />
      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <Controller
          control={control}
          name="dropName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl
                errorText={error?.message}
                helperText="Will be shown on the claim page"
                label="Token Drop name"
              >
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="Star Invasion Beta Invites"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />

        <Flex justifyContent="flex-end">
          <Button disabled={!isDirty || !isValid} mt="10" type="submit">
            Continue to summary
          </Button>
        </Flex>
      </form>
    </IconBox>
  );
};
