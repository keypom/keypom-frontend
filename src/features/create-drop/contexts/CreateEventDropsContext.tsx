import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BN from 'bn.js';
import { addToBalance, createDrop, formatNearAmount, parseNearAmount } from 'keypom-js';

import {
  type PaymentItem,
  type PaymentData,
  type SummaryItem,
} from '@/features/create-drop/types/types';
import { set } from '@/utils/localStorage';
import { PENDING_EVENT_TICKETS } from '@/constants/common';
import { EventInfoForm } from '@/features/create-drop/components/event/form-steps/EventInfoForm';
import { type StepItem } from '@/components/Step';
import { EventQuestionsForm } from '@/features/create-drop/components/event/form-steps/EventQuestionsForm';
import { EventTicketsForm } from '@/features/create-drop/components/event/form-steps/EventTicketsForm';
import { useSteps } from '@/hooks/useSteps';

// import { type PaymentData, type SummaryItem } from '../types/types';

interface FormStep extends StepItem {
  isSkipable: boolean;
  schema: typeof TicketsSchema | typeof EventInfoSchema | typeof QuestionsSchema;
}
interface CreateEventDropsContextProps {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => Promise<PaymentData>;
  handleCreateDrops: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  currentIndex: number;
  formSteps: FormStep[];
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
  formSteps: [],
  onNextStep: function (): void {
    throw new Error('Function not implemented.');
  },
  onPreviousStep: function (): void {
    throw new Error('Function not implemented.');
  },
  currentIndex: 0,
});

export const ticketSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  salesStartDate: z.string(), // challenging to use z.string().datetime() to work with datetime-local
  salesEndDate: z.string(),
  nearPricePerTicket: z.coerce.number(),
  numberOfTickets: z.coerce
    .number({ invalid_type_error: 'Number of tickets required' })
    .positive()
    .min(1, 'Required')
    .max(50, 'Currently tickets are limited to 50 links. This will be increased very soon!')
    .optional(),
});

const EventInfoSchema = z.object({
  eventName: z.string().min(1, 'Event name required'),
});

const TicketsSchema = z.object({
  tickets: z.array(ticketSchema).min(1),
});

export const QuestionsSchema = z.object({
  questions: z.optional(
    z.array(
      z.object({
        text: z.string(),
        type: z.enum(['TEXT', 'RADIO']),
        isRequired: z.boolean(),
        isSelected: z.boolean(),
      }),
    ),
  ),
});

export type TicketSchema = z.infer<typeof ticketSchema>;
export type CreateEventFieldsSchema = z.infer<
  typeof EventInfoSchema & typeof QuestionsSchema & typeof TicketsSchema
>;

const formSteps: FormStep[] = [
  {
    name: 'eventInfo',
    title: 'Event info',
    component: <EventInfoForm />,
    isSkipable: false,
    schema: EventInfoSchema,
  },
  {
    name: 'collectInfo',
    title: 'Collect info',
    component: <EventQuestionsForm />,
    isSkipable: true,
    schema: QuestionsSchema,
  },
  {
    name: 'tickets',
    title: 'Tickets',
    component: <EventTicketsForm />,
    isSkipable: false,
    schema: TicketsSchema,
  },
];

/**
 *
 * Context for managing form state
 */
export const CreateEventDropsProvider = ({ children }: PropsWithChildren) => {
  // const { account } = useAuthWalletContext();
  const {
    onNext: onNextStep,
    onPrevious: onPreviousStep,
    currentIndex,
  } = useSteps({ maxSteps: formSteps.length });
  const [totalRequiredDeposits, setTotalDeposits] = useState('0');

  const methods = useForm<CreateEventFieldsSchema>({
    mode: 'onChange',
    defaultValues: {
      eventName: '',
      tickets: [],
      questions: [
        { text: 'Email address', type: 'TEXT', isRequired: true, isSelected: true },
        { text: 'How did you find this event?', type: 'TEXT', isSelected: true, isRequired: true },
      ],
    },
    resolver: zodResolver(formSteps[currentIndex].schema),
  });

  // get total deposits
  // add total deposits amount to the user balance
  // reduct user balance from creating drops
  const handleCreateDrops = async () => {
    const { getValues } = methods;
    set(PENDING_EVENT_TICKETS, JSON.stringify(getValues()));
    await addToBalance({
      amountYocto: totalRequiredDeposits,
      wallet: await window.selector.wallet(),
      successUrl: `${window.location.origin}/drop/event/create`,
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
    const { tickets, eventName, questions } = methods.getValues();

    const totalDeposits = await tickets.reduce(async (deposits, ticket, index) => {
      const { requiredDeposit } = await createDrop({
        wallet: await window.selector.wallet(),
        numKeys: ticket.numberOfTickets,
        metadata: JSON.stringify({
          eventId: new Date().getTime() + index,
          eventName,
          dropName: ticket.name,
          wallets: ['mynearwallet', 'herewallet'],
          questions,
        }),
        config: {
          usesPerKey: 3,
          sale: {
            maxNumKeys: parseInt(ticket.numberOfTickets),
            pricePerKeyNEAR: parseFloat(ticket.nearPricePerTicket),
            blocklist: ['satoshi.testnet'],
            autoWithdrawFunds: true,
            start: new Date(ticket.salesStartDate).getTime(),
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
      const depositsObject = await deposits;
      return {
        totalDeposit: depositsObject.totalDeposit.add(new BN(requiredDeposit)),
        tickets: [
          ...depositsObject.tickets,
          { name: ticket.name, total: parseFloat(formatNearAmount(requiredDeposit as string, 4)) },
        ],
      };
    }, Promise.resolve({ totalDeposit: new BN(0), tickets: [] }));
    const totalCost = formatNearAmount(totalDeposits.totalDeposit.toString(), 4);
    const costsData: PaymentItem[] = totalDeposits.tickets;

    const confirmationText = `Creating ${tickets.length} tickets for ${totalCost} NEAR`;

    setTotalDeposits(totalDeposits.totalDeposit.toString());

    return { costsData, totalCost, confirmationText };
  };

  return (
    <CreateEventDropsContext.Provider
      value={{
        handleCreateDrops,
        getPaymentData,
        getSummaryData,
        onNextStep,
        onPreviousStep,
        currentIndex,
        formSteps,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateEventDropsContext.Provider>
  );
};

export const useCreateEventDropsContext = () => useContext(CreateEventDropsContext);
