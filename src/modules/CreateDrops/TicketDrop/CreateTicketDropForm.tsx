import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { MultiStepForm, StepItem } from '@/common/components/MultiStep/MultiStep';

import { useDropFlowContext } from '../contexts/DropFlowContext';

import { EventInfoForm } from './EventInfoForm';
import { SignUpInfoForm } from './SignUpInfoForm';

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
    </IconBox>
  );
};
