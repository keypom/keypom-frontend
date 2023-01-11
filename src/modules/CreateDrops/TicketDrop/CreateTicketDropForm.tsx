import { useFormContext } from 'react-hook-form';

import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { MultiStepForm, StepItem } from '@/common/components/MultiStep/MultiStep';

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
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
      <MultiStepForm steps={formSteps} />
    </IconBox>
  );
};
