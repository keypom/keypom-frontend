import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// import { type PaymentData, type SummaryItem } from '../types/types';

// interface CreateEventDropsContextProps {
//   getSummaryData: () => SummaryItem[];
//   getPaymentData: () => PaymentData;
//   handleDropConfirmation: () => void;
//   createLinksSWR: { data?: { success: boolean }; handleDropConfirmation: () => void };
// }

const CreateEventDropsContext = createContext(null);

const schema = z.object({
  eventName: z.string().min(1, 'Event name required'),
  tickets: z.array(z.any()),
});

type Schema = z.infer<typeof schema>;

/**
 *
 * Context for managing form state
 */
export const CreateEventDropsProvider = ({ children }: PropsWithChildren) => {
  // const { account } = useAuthWalletContext();

  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      eventName: '',
    },
    resolver: zodResolver(schema),
  });

  // useEffect(() => {
  //   if (account) {
  //     methods.setValue('selectedToken', {
  //       symbol: defaultToken.symbol, // NEAR
  //       amount: formatNearAmount(account.amount, 4),
  //     });
  //   }
  // }, [account]);

  return (
    <CreateEventDropsContext.Provider value={null}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateEventDropsContext.Provider>
  );
};

export const useCreateEventDropsContext = () => useContext(CreateEventDropsContext);
