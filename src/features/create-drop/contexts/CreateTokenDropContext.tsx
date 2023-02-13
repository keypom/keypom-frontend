import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { urlRegex } from '@/constants/common';

import { type PaymentData, type PaymentItem, type SummaryItem } from '../types/types';
import { WALLET_TOKENS } from '../components/token/data';

interface CreateTokenDropContextProps {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: () => void;
  createLinksSWR: { data?: { success: boolean }; handleDropConfirmation: () => void };
}

const CreateTokenDropContext = createContext<CreateTokenDropContextProps>({
  getSummaryData: () => [{ type: 'text', name: '', value: '' }] as SummaryItem[],
  getPaymentData: () => ({
    costsData: [{ name: '', total: 0 }],
    totalCost: 0,
    confirmationText: '',
  }),
  handleDropConfirmation: function (): void {
    throw new Error('Function not implemented.');
  },
  createLinksSWR: {
    data: undefined,
    handleDropConfirmation: function (): void {
      throw new Error('Function not implemented.');
    },
  },
});

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
  redirectLink: z
    .union([z.string().regex(urlRegex, 'Please enter a valid url'), z.string().length(0)])
    .optional(),
});

type Schema = z.infer<typeof schema>;

// TODO: this is only a mock implementation of the backend api
const createLinks = async () => {
  await new Promise((_resolve) => setTimeout(_resolve, 2000));
  return {
    success: true,
  };
};

/**
 *
 * Context for managing form state
 */
export const CreateTokenDropProvider = ({ children }: PropsWithChildren) => {
  const { trigger, data } = useSWRMutation('/api/drops/tokens', createLinks);
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
        type: 'text',
        name: 'Token Drop name',
        value: dropName,
      },
      {
        type: 'text',
        name: 'Amount per link',
        value: `${amountPerLink} ${selectedFromWallet.symbol}`,
      },
      {
        type: 'text',
        name: 'Number of links',
        value: totalLinks,
      },
      {
        type: 'text',
        name: 'Redirect link',
        value: redirectLink ?? '',
      },
    ];
  };

  const getPaymentData = (): PaymentData => {
    const { totalLinks, amountPerLink } = methods.getValues();

    // TODO: assuming this comes from backend
    const totalLinkCost = totalLinks * amountPerLink;
    const NEARNetworkFee = 50.15;
    const totalCost = totalLinkCost + NEARNetworkFee;
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `${totalLinks} x ${amountPerLink}`,
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

    const confirmationText = `Creating ${totalLinks} for ${totalCost} NEAR`;

    return { costsData, totalCost, confirmationText };
  };

  const handleDropConfirmation = () => {
    // TODO: send transaction/request to backend
    void trigger();
  };

  const createLinksSWR = {
    data,
    handleDropConfirmation,
  };

  return (
    <CreateTokenDropContext.Provider
      value={{ getSummaryData, getPaymentData, handleDropConfirmation, createLinksSWR }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateTokenDropContext.Provider>
  );
};

export const useCreateTokenDropContext = () => useContext(CreateTokenDropContext);
