import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useSteps } from '@/common/hooks/useSteps';
import { StepItem } from '@/common/components/Step/Step';

import { PaymentData, SummaryItem } from '../../types/types';
import { EventInfoForm } from '../EventInfoForm';
import { SignUpInfoForm } from '../SignUpInfoForm';
import { AdditionalGiftsForm } from '../AdditionalGiftsForm/AdditionalGiftsForm';

import { AdditionalGiftSchema, EventInfoSchema, SignUpInfoSchema } from './FormValidations';

interface FormStep extends StepItem {
  isSkipable: boolean;
  schema: typeof AdditionalGiftSchema | typeof EventInfoSchema | typeof SignUpInfoSchema;
}

export type CreateTicketFieldsSchema = z.infer<
  typeof EventInfoSchema & typeof SignUpInfoSchema & typeof AdditionalGiftSchema
>;

export interface CreateTicketDropContextTypes {
  onNextStep: () => void;
  onPreviousStep: () => void;
  currentIndex: number;
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: () => void;
  formSteps: FormStep[];
  createLinksSWR: {
    data: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateTicketDropContext = createContext<CreateTicketDropContextTypes>(null);

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
  };
};

const formSteps: FormStep[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <EventInfoForm />,
    isSkipable: false,
    schema: EventInfoSchema,
  },
  {
    name: 'signUpInfo',
    title: 'Sign-up info',
    component: <SignUpInfoForm />,
    isSkipable: true,
    schema: SignUpInfoSchema,
  },
  {
    name: 'additionalGifts',
    title: 'Additional gifts',
    component: <AdditionalGiftsForm />,
    isSkipable: true,
    schema: AdditionalGiftSchema,
  },
];

/**
 *
 * Context for managing form state
 */
export const CreateTicketDropProvider = ({ children }: PropsWithChildren) => {
  const {
    onNext: onNextStep,
    onPrevious: onPreviousStep,
    currentIndex,
  } = useSteps({ maxSteps: formSteps.length });
  const { trigger, data } = useSWRMutation('/api/drops/tickets', createLinks);

  const methods = useForm<CreateTicketFieldsSchema>({
    mode: 'onChange',
    defaultValues: {
      eventName: '',
      totalTickets: null,
      firstName: false,
      secondName: false,
      emailAddress: false,
      additionalGift: {
        type: 'none',
        token: {
          selectedFromWallet: null,
          amountPerLink: '',
        },
        poapNft: { name: '', description: '', artwork: null },
      },
    },
    resolver: zodResolver(formSteps[currentIndex].schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    // const { getValues } = methods;
    // const [eventName] = getValues(['eventName']);

    return [];
  };

  const getPaymentData = (): PaymentData => {
    return { costsData: [], totalCost: 0, confirmationText: '' };
  };

  const handleDropConfirmation = () => {
    // TODO: send transaction/request to backend
    trigger();
  };

  const createLinksSWR = {
    data,
    handleDropConfirmation,
  };

  return (
    <CreateTicketDropContext.Provider
      value={{
        getSummaryData,
        getPaymentData,
        handleDropConfirmation,
        createLinksSWR,
        onNextStep,
        onPreviousStep,
        currentIndex,
        formSteps,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateTicketDropContext.Provider>
  );
};

export const useCreateTicketDropContext = () => useContext(CreateTicketDropContext);
