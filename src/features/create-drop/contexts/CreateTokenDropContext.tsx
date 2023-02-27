import { createContext, type PropsWithChildren, useContext, useEffect } from 'react';
import { evaluate, format } from 'mathjs';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDrop, formatNearAmount, generateKeys } from 'keypom-js';
import { type NavigateFunction } from 'react-router-dom';

import { get } from '@/utils/localStorage';
import { MASTER_KEY, urlRegex } from '@/constants/common';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { type PaymentData, type PaymentItem, type SummaryItem } from '../types/types';
import { WALLET_TOKENS } from '../components/WalletComponent';

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
    .min(1, 'Required')
    .max(50, 'Currently drops are limited to 50 links. This will be increased very soon!'),
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
  const { account } = useAuthWalletContext();

  const { data } = useSWRMutation('/api/drops/tokens', createLinks);
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

  useEffect(() => {
    if (account) {
      methods.setValue('selectedFromWallet', {
        symbol: WALLET_TOKENS[0].symbol,
        amount: formatNearAmount(account.amount, 4),
      });
    }
  }, [account]);

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [dropName, totalLinks, amountPerLink, selectedFromWallet] = getValues([
      'dropName',
      'totalLinks',
      'amountPerLink',
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
      // {
      //   type: 'text',
      //   name: 'Redirect link',
      //   value: redirectLink ?? '',
      // },
    ];
  };

  const getPaymentData = async (): Promise<PaymentData> => {
    const { totalLinks, amountPerLink } = methods.getValues();

    // TODO: assuming this comes from backend

    const { requiredDeposit } = await createDrop({
      wallet: await window.selector.wallet(),
      depositPerUseNEAR: amountPerLink,
      numKeys: totalLinks,
      returnTransactions: true,
    });

    const totalLinkCost = format(evaluate(`${totalLinks} * ${amountPerLink}`), {
      precision: 14,
    });
    const totalCost = parseFloat(formatNearAmount(requiredDeposit!, 4));
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `${totalLinks} x ${amountPerLink} =`,
      },
      {
        name: 'NEAR network fees',
        total: Number((totalCost - totalLinkCost).toFixed(4)),
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

  const handleDropConfirmation = async (navigate: NavigateFunction) => {
    const { dropName, totalLinks, amountPerLink } = methods.getValues();

    const dropId = Date.now().toString();
    const { publicKeys } = await generateKeys({
      numKeys: totalLinks,
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
      autoMetaNonceStart: 0,
    });

    try {
      await createDrop({
        dropId,
        wallet: await window.selector.wallet(),
        depositPerUseNEAR: amountPerLink,
        publicKeys: publicKeys || [],
        numKeys: totalLinks,
        metadata: JSON.stringify({ dropName }),
        successUrl: `${window.location.origin}/drop/token/${dropId}`,
      });
    } catch (e) {
      console.warn(e);
      if (/user reject/gi.test(JSON.stringify(e))) {
        // TODO modal where user informed they rejected TX
      }
    }

    setTimeout(() => {
      navigate('/drops');
    }, 1000);
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
