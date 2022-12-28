import React, { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { TOKEN_BALANCES } from './data';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

/**
 *
 * Context for managing form state
 */
export const CreateTokenDropProvider = ({ children }: PropsWithChildren) => {
  const methods = useForm({
    defaultValues: {
      dropName: '',
      selectedFromWallet: TOKEN_BALANCES[0],
      selectedToWallets: [],
      totalLinks: undefined,
      amountPerLink: undefined,
      redirectLink: '',
    },
    resolver: zodResolver,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
