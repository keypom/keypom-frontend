import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useSteps } from '@/common/hooks/useSteps';
import { StepItem } from '@/common/components/Step/Step';

import { PaymentData, PaymentItem, SummaryItem } from '../../types/types';
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

    if (additionalGift.type == 'token') {
      results.push({
        type: 'text',
        name: 'Tokens gifted per ticket',
        value: `${additionalGift.token.amountPerLink} ${additionalGift.token.selectedFromWallet.symbol}`,
      });
    } else if (additionalGift.type == 'poapNft') {
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
