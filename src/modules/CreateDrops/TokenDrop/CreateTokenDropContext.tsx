import React, { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // not sure why its not picking up from 'zod'

import { TOKEN_BALANCES } from './data';

const schema = z.object({
  dropName: z.string({ required_error: 'Drop name is required' }),
  selectedFromWallet: z.object({
    symbol: z.string(),
    amount: z.string(),
  }),
  selectedToWallets: z.array(z.string()),
  totalLinks: z.number(),
  amountPerLink: z.number(),
  redirectLink: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

/**
 *
 * Context for managing form state
 */
export const CreateTokenDropProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm<Schema>({
    defaultValues: {
      dropName: '',
      selectedFromWallet: { symbol: TOKEN_BALANCES[0].symbol, amount: TOKEN_BALANCES[0].amount },
      selectedToWallets: [],
      totalLinks: undefined,
      amountPerLink: undefined,
      redirectLink: '',
    },
    resolver: zodResolver(schema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
