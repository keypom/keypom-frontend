import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { TOKEN_BALANCES } from './data';

const CreateTokenDropContext = createContext({});

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
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const useCreateTokenDropContext = () => useContext(CreateTokenDropContext);
