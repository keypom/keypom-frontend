import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';

import { useSteps } from '@/hooks/useSteps';
import { type StepItem } from '@/components/Step/Step';
import {
  type PaymentData,
  type PaymentItem,
  type SummaryItem,
} from '@/features/create-drop/types/types';
import { EventInfoForm } from '@/features/create-drop/components/ticket/EventInfoForm';
import { AdditionalGiftsForm } from '@/features/create-drop/components/ticket/AdditionalGiftsForm/AdditionalGiftsForm';

import { AdditionalGiftSchema, EventInfoSchema, type SignUpInfoSchema } from './FormValidations';

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
    data?: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateTicketDropContext = createContext<CreateTicketDropContextTypes>({
  onNextStep: function (): void {
    throw new Error('Function not implemented.');
  },
  onPreviousStep: function (): void {
    throw new Error('Function not implemented.');
  },
  currentIndex: 0,
  getSummaryData: function (): SummaryItem[] {
    throw new Error('Function not implemented.');
  },
  getPaymentData: function (): PaymentData {
    throw new Error('Function not implemented.');
  },
  handleDropConfirmation: function (): void {
    throw new Error('Function not implemented.');
  },
  formSteps: [],
  createLinksSWR: {
    data: {
      success: false,
    },
    handleDropConfirmation: function (): void {
      throw new Error('Function not implemented.');
    },
  },
});

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((_resolve) => setTimeout(_resolve, 2000));
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
  /** commented in case there's a need for sign-up info in the future */
  // {
  //   name: 'signUpInfo',
  //   title: 'Sign-up info',
  //   component: <SignUpInfoForm />,
  //   isSkipable: true,
  //   schema: SignUpInfoSchema,
  // },
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
      totalTickets: undefined,
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
    const { eventName, totalTickets, additionalGift } = methods.getValues();

    const results: SummaryItem[] = [
      {
        type: 'text',
        name: 'Event name',
        value: eventName,
      },
      {
        type: 'text',
        name: 'Number of tickets',
        value: totalTickets,
      },
    ];

    if (additionalGift.type === 'token') {
      results.push({
        type: 'text',
        name: 'Tokens gifted per ticket',
        value: `${additionalGift.token.amountPerLink} ${additionalGift?.token?.selectedFromWallet?.symbol}`,
      });
    } else if (additionalGift.type === 'poapNft') {
      results.push({
        type: 'image',
        name: 'POAP',
        value: additionalGift.poapNft.artwork,
      });
    }

    return results;
  };

  const getPaymentData = (): PaymentData => {
    // TODO: assuming this comes from backend
    const totalLinkCost = 20 * 3.5;
    const NEARNetworkFee = 50.15;
    const totalCost = totalLinkCost + NEARNetworkFee;
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `20 x 3.509`,
      },
      {
        name: 'NEAR network fees',
        total: NEARNetworkFee,
      },
      {
        name: 'Keypom fee',
        total: 0,
        isDiscount: true,
        discountText: 'Early bird discount',
      },
    ];

    const confirmationText = `Creating 20 for ${totalCost} NEAR`;

    return { costsData, totalCost, confirmationText };
  };

  const handleDropConfirmation = () => {
    // TODO: send transaction/request to backend
    void trigger();
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
