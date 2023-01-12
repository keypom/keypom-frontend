import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useSteps } from '@/common/hooks/useSteps';
import { StepItem } from '@/common/components/Step/Step';

import { PaymentData, SummaryItem } from '../types/types';

import { EventInfoForm } from './EventInfoForm';
import { SignUpInfoForm } from './SignUpInfoForm';
import { AdditionalGiftsForm } from './AdditionalGiftsForm/AdditionalGiftsForm';

export interface CreateTicketDropContextTypes {
  onNextStep: () => void;
  onPreviousStep: () => void;
  currentIndex: number;
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: () => void;
  formSteps: StepItem[];
  createLinksSWR: {
    data: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateTicketDropContext = createContext<CreateTicketDropContextTypes>(null);

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const EventInfoSchema = z.object({
  eventName: z.string().min(1, 'Event name required'),
  totalTickets: z
    .number({ invalid_type_error: 'Number of tickets required' })
    .positive()
    .min(1, 'Required'),
});

const SignUpInfoSchema = z.object({
  firstName: z.boolean().optional(),
  secondName: z.boolean().optional(),
  emailAddress: z.boolean().optional(),
});

const AdditionalGiftSchema = z.object({
  additionalGift: z.object({
    type: z.string(),
    tokenGift: z.object({
      selectedFromWallet: z.object({
        symbol: z.string(),
        amount: z.string(),
      }),
      amountPerLink: z.number({ invalid_type_error: 'Amount required' }).gt(0),
    }),
    poapNftGift: z.object({
      name: z.string(),
      description: z.string(),
      artwork: z
        .any()
        .refine((files) => files?.length == 1, 'Image is required.')
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
          '.jpg, .jpeg, .png and .webp files are accepted.',
        ),
    }),
  }),
});

const schemaValidations = [EventInfoSchema, SignUpInfoSchema, AdditionalGiftSchema];

type Schema = z.infer<
  typeof EventInfoSchema | typeof SignUpInfoSchema | typeof AdditionalGiftSchema
>;

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
  };
};

const formSteps: StepItem[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <EventInfoForm />,
    isSkipable: false,
  },
  {
    name: 'signUpInfo',
    title: 'Sign-up info',
    component: <SignUpInfoForm />,
    isSkipable: true,
  },
  {
    name: 'additionalGifts',
    title: 'Additional gifts',
    component: <AdditionalGiftsForm />,
    isSkipable: true,
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
  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      eventName: '',
      totalTickets: null,
      firstName: false,
      secondName: false,
      emailAddress: false,
    },
    resolver: zodResolver(schemaValidations[currentIndex]),
  });

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [eventName] = getValues(['eventName']);

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
