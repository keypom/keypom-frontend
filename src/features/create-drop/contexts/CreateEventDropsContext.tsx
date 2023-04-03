import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDrop, formatNearAmount, parseNearAmount } from 'keypom-js';

import {
  type PaymentItem,
  type PaymentData,
  type SummaryItem,
} from '@/features/create-drop/types/types';

// import { type PaymentData, type SummaryItem } from '../types/types';

interface CreateEventDropsContextProps {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => Promise<PaymentData>;
  handleCreateDrops: () => void;
}

const CreateEventDropsContext = createContext<CreateEventDropsContextProps>({
  handleCreateDrops: () => {
    throw new Error('Function not implemented');
  },
  getPaymentData: async () => {
    throw new Error('Function not implemented');
  },
  getSummaryData: () => {
    throw new Error('Function not implemented');
  },
});

const schema = z.object({
  eventName: z.string().min(1, 'Event name required'),
  tickets: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        salesStartDate: z.string(), // challenging to use z.string().datetime() to work with datetime-local
        salesEndDate: z.string(),
        nearPricePerTicket: z.coerce.number(),
        numberOfTickets: z.coerce
          .number({ invalid_type_error: 'Number of tickets required' })
          .positive()
          .min(1, 'Required')
          .max(50, 'Currently tickets are limited to 50 links. This will be increased very soon!'),
      }),
    )
    .min(1),
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
      tickets: [],
    },
    resolver: zodResolver(schema),
  });

  const handleCreateDrops = () => {
    const { getValues } = methods;
    const { tickets, eventName } = getValues();

    tickets.forEach(async (ticket, index) => {
      const dropId = (Date.now() + index).toString();
      await createDrop({
        dropId,
        wallet: await window.selector.wallet(),
        numKeys: parseInt(ticket.numberOfTickets),
        metadata: JSON.stringify({
          eventId: new Date().getTime() + index,
          eventName,
          dropName: `${eventName} - ${ticket.name}`,
          wallets: ['mynearwallet', 'herewallet'],
        }),
        config: {
          usesPerKey: 3,
          sale: {
            // Maximum of 100 Keys
            maxNumKeys: parseInt(ticket.numberOfTickets),

            // 1 $NEAR per key
            pricePerKeyNEAR: parseFloat(ticket.nearPricePerTicket),

            // only allow benji.testnet and minqi.testnet to add keys
            // allowlist: ["benji.testnet", "minqi.testnet"],

            // don't allow boogieman.testnet to add keys
            blocklist: ['satoshi.testnet'],

            // send revenue back to funder's NEAR wallet
            autoWithdrawFunds: true,

            // start 3 days from now
            start: new Date(ticket.salesStartDate).getTime(),

            // end 10 days from now
            end: new Date(ticket.salesEndDate).getTime(),
          },
        },
        fcData: {
          methods: [
            null,
            null,
            [
              {
                receiverId: `nft-v2.keypom.testnet`,
                methodName: 'nft_mint',
                args: '',
                dropIdField: 'mint_id',
                accountIdField: 'receiver_id',
                attachedDeposit: parseNearAmount('0.1'),
              },
            ],
          ],
        },
        successUrl: `${window.location.origin}/drops`,
      });
    });
  };

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [eventName] = getValues(['eventName']);

    return [
      {
        type: 'text',
        name: 'Event name',
        value: eventName,
      },
    ];
  };

  const getPaymentData = async (): Promise<PaymentData> => {
    const { tickets, eventName } = methods.getValues();

    const totalDeposits = await tickets.reduce(async (deposits, ticket, index) => {
      const { requiredDeposit } = await createDrop({
        wallet: await window.selector.wallet(),
        numKeys: ticket.numberOfTickets,
        metadata: JSON.stringify({
          eventId: new Date().getTime() + index,
          eventName,
          dropName: ticket.name,
          wallets: ['mynearwallet', 'herewallet'],
        }),
        config: {
          usesPerKey: 3,
          sale: {
            // Maximum of 100 Keys
            maxNumKeys: ticket.numberOfTickets,

            // 1 $NEAR per key
            pricePerKeyNEAR: parseFloat(
              parseNearAmount(ticket.nearPricePerTicket.toString()) as string,
            ),

            // only allow benji.testnet and minqi.testnet to add keys
            // allowlist: ["benji.testnet", "minqi.testnet"],

            // don't allow boogieman.testnet to add keys
            blocklist: ['satoshi.testnet'],

            // send revenue back to funder's NEAR wallet
            autoWithdrawFunds: true,

            // start 3 days from now
            start: new Date(ticket.salesStartDate).getTime(),

            // end 10 days from now
            end: new Date(ticket.salesEndDate).getTime(),
          },
        },
        fcData: {
          methods: [
            null,
            null,
            [
              {
                receiverId: `nft-v2.keypom.testnet`,
                methodName: 'nft_mint',
                args: '',
                dropIdField: 'mint_id',
                accountIdField: 'receiver_id',
                attachedDeposit: parseNearAmount('0.1'),
              },
            ],
          ],
        },
        returnTransactions: true,
      });
      const requiredDepositFloat = parseFloat(formatNearAmount(requiredDeposit || '0', 4));
      const depositsObject = await deposits;
      return {
        totalDeposit: depositsObject.totalDeposit + requiredDepositFloat,
        tickets: [...depositsObject.tickets, { name: ticket.name, total: requiredDepositFloat }],
      };
    }, Promise.resolve({ totalDeposit: 0, tickets: [] }));
    const totalCost = parseFloat(totalDeposits.totalDeposit.toString());
    const costsData: PaymentItem[] = totalDeposits.tickets;

    const confirmationText = `Creating ${tickets.length} tickets for ${totalCost} NEAR`;

    return { costsData, totalCost, confirmationText };
  };

  return (
    <CreateEventDropsContext.Provider value={{ handleCreateDrops, getPaymentData, getSummaryData }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateEventDropsContext.Provider>
  );
};

export const useCreateEventDropsContext = () => useContext(CreateEventDropsContext);
