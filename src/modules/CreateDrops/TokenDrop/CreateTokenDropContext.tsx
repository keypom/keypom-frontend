import React, { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // not sure why its not picking up from 'zod'

import { WALLET_TOKENS } from './data';

const schema = z.object({
  dropName: z.string().min(1, 'Required'),
  selectedFromWallet: z.object({
    symbol: z.string(),
    amount: z.string(),
  }),
  selectedToWallets: z.array(z.string().min(1)).min(1, 'At least one wallet is required'),
  totalLinks: z.number().positive().min(1),
  amountPerLink: z.number().positive().min(1),
  redirectLink: z.union([z.string().url(), z.string().length(0)]).optional(),
});

type Schema = z.infer<typeof schema>;

/**
 *
 * Context for managing form state
 */
export const CreateTokenDropProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<Schema>({
    mode: 'all',
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

  return <FormProvider {...methods}>{children}</FormProvider>;
};
