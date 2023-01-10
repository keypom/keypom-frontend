import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { PaymentData, SummaryItem } from '../types/types';

import { WALLET_TOKENS } from './data';

const CreateTicketDropContext = createContext(null);

const schema = z.object({
  dropName: z.string().min(1, 'Drop name required'),
  selectedFromWallet: z.object({
    symbol: z.string(),
    amount: z.string(),
  }),
  totalLinks: z
    .number({ invalid_type_error: 'Number of links required' })
    .positive()
    .min(1, 'Required'),
  amountPerLink: z.number({ invalid_type_error: 'Amount required' }).gt(0),
});

type Schema = z.infer<typeof schema>;

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
  };
};

/**
 *
 * Context for managing form state
 */
export const CreateTicketDropProvider = ({ children }: PropsWithChildren) => {
  const { trigger, data } = useSWRMutation('/api/drops/tickets', createLinks);
  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      dropName: '',
      selectedFromWallet: { symbol: WALLET_TOKENS[0].symbol, amount: WALLET_TOKENS[0].amount },
      totalLinks: undefined,
      amountPerLink: undefined,
    },
    resolver: zodResolver(schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [dropName] = getValues(['dropName']);

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
      value={{ getSummaryData, getPaymentData, handleDropConfirmation, createLinksSWR }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateTicketDropContext.Provider>
  );
};

export const useCreateTicketDropContext = () => useContext(CreateTicketDropContext);
