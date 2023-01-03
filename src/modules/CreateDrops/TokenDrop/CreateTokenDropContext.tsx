import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // not sure why its not picking up from 'zod'

import { PaymentItem, SummaryItem } from '../types/types';

import { WALLET_TOKENS } from './data';

const CreateTokenDropContext = createContext(null);

const schema = z.object({
  dropName: z.string().min(1, 'Drop name required'),
  selectedFromWallet: z.object({
    symbol: z.string(),
    amount: z.string(),
  }),
  selectedToWallets: z.array(z.string().min(1)).min(1, 'At least one wallet is required'),
  totalLinks: z
    .number({ invalid_type_error: 'Number of links required' })
    .positive()
    .min(1, 'Required'),
  amountPerLink: z.number({ invalid_type_error: 'Amount required' }).gt(0),
  redirectLink: z.union([z.string().url(), z.string().length(0)]).optional(),
});

type Schema = z.infer<typeof schema>;

/**
 *
 * Context for managing form state
 */
export const CreateTokenDropProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      dropName: '',
      selectedFromWallet: { symbol: WALLET_TOKENS[0].symbol, amount: WALLET_TOKENS[0].amount },
      selectedToWallets: [],
      totalLinks: undefined,
      amountPerLink: undefined,
      redirectLink: '',
    },
    resolver: zodResolver(schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [dropName, totalLinks, amountPerLink, redirectLink, selectedFromWallet] = getValues([
      'dropName',
      'totalLinks',
      'amountPerLink',
      'redirectLink',
      'selectedFromWallet',
    ]);

    return [
      {
        name: 'Token Drop name',
        value: dropName,
      },
      {
        name: 'Amount per link',
        value: `${amountPerLink} ${selectedFromWallet.symbol}`,
      },
      {
        name: 'Number of links',
        value: totalLinks,
      },
      {
        name: 'Redirect link',
        value: redirectLink,
      },
    ];
  };

  const getPaymentData = () => {
    const { totalLinks, amountPerLink } = methods.getValues();
    const totalLinkCost = totalLinks * amountPerLink;
    // assuming this comes from backend
    const paymentData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        symbol: 'NEAR',
        helperText: `${totalLinks} x ${amountPerLink}`,
      },
      {
        name: 'NEAR network fees',
        total: 50.15,
        symbol: 'NEAR',
      },
      {
        name: 'Keypom fee',
        total: 0,
        symbol: 'NEAR',
        isDiscount: true,
        discountText: 'Early bird discount',
      },
      {
        name: 'Total cost',
        total: totalLinkCost + 50.15,
        symbol: 'NEAR',
      },
    ];

    return paymentData;
  };

  return (
    <CreateTokenDropContext.Provider value={{ getSummaryData, getPaymentData }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateTokenDropContext.Provider>
  );
};

export const useCreateTokenDropContext = () => useContext(CreateTokenDropContext);
