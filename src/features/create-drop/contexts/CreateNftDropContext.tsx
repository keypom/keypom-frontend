import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BN from 'bn.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { set, update, get } from 'idb-keyval';

import { urlRegex, MAX_FILE_SIZE, NFT_ATTEMPT_KEY } from '@/constants/common';
import {
  type PaymentData,
  type PaymentItem,
  type SummaryItem,
} from '@/features/create-drop/types/types';

import { getCostForNFTDrop } from './nft-utils';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/webp'];

const schema = z.object({
  title: z.string().min(1, 'NFT name required'),
  description: z.string().min(1, 'Description required'),
  number: z.coerce
    .number()
    .min(1, 'You must create at least 1 NFT')
    .max(50, 'Max NFTs per drop is currently 50'),
  artwork: z
    .any()
    .refine((files) => files?.length === 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
  selectedToWallets: z.array(z.string().min(1)).min(1, 'At least one wallet is required'),
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

interface CreateNftDropContextType {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => Promise<PaymentData>;
  handleDropConfirmation: (paymentData: PaymentData) => void;
  createLinksSWR: {
    data?: { success: boolean };
    handleDropConfirmation: (paymentData: PaymentData) => void;
  };
}

const CreateNftDropContext = createContext<CreateNftDropContextType>({
  getSummaryData: () => [{ type: 'text', name: '', value: '' }] as SummaryItem[],
  getPaymentData: async () =>
    await (Promise.resolve({
      costsData: [{ name: '', total: 0 }],
      totalCost: 0,
      confirmationText: '',
    }) as Promise<PaymentData>),
  handleDropConfirmation: async function (): Promise<void> {
    await Promise.resolve();
  },
  createLinksSWR: {
    data: { success: false },
    handleDropConfirmation: async function (): Promise<void> {
      await Promise.resolve();
    },
  },
});

export const CreateNftDropProvider = ({ children }: PropsWithChildren) => {
  const { data } = useSWRMutation('/api/drops/tokens', createLinks);

  const methods = useForm<Schema>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      number: 1,
      artwork: '',
      selectedToWallets: [],
      redirectLink: '',
    },
    resolver: zodResolver(schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [title, description, number, artwork] = getValues([
      'title',
      'description',
      'number',
      'artwork',
    ]);

    return [
      {
        type: 'text',
        name: 'NFT name',
        value: title,
      },
      {
        type: 'text',
        name: 'NFT description',
        value: description,
      },
      {
        type: 'number',
        name: 'Number of NFTs',
        value: number,
      },
      {
        type: 'image',
        name: 'Artwork',
        value: artwork,
      },
    ];
  };

  const getPaymentData = async (): Promise<PaymentData> => {
    const { title, description, number, artwork } = methods.getValues();

    

    const numKeys = parseInt(Math.floor(number).toString());
    if (!numKeys || Number.isNaN(numKeys)) {
      throw new Error('incorrect number');
    }

    const media = artwork[0];

    const dropId = Date.now().toString();

    // quick timeout to prevent indexeddb from updating before page reload on injected wallets
    await new Promise((resolve) => setTimeout(resolve, 300));

    // json -> indexeddb NOT localStorage (see import above)
    await set(NFT_ATTEMPT_KEY, {
      confirmed: false,
      seriesClaimed: false,
      fileUploaded: false,
      dropId,
      title,
      description,
      numKeys,
      media,
    });

    console.log("getting cost")
    // requiredDeposit is inital create_series drop cost, requiredDeposit2 is the actual drop with nft_mint
    const { requiredDeposit, requiredDeposit2 } = await getCostForNFTDrop(
      dropId,
      {
        title,
        description,
        numKeys,
      },
    );

    // adjust only the nft_mint drop by factor of 1.75, not the create_series drop
    const adjustedDeposit2 = new BN(requiredDeposit2).mul(new BN(175)).div(new BN(100)).toString();
    const totalRequired = new BN(requiredDeposit).add(new BN(adjustedDeposit2)).toString();

    const totalLinkCost = parseFloat(formatNearAmount(requiredDeposit, 4));
    const totalStorageCost = parseFloat(formatNearAmount(adjustedDeposit2, 4));
    const totalCost = Number(totalLinkCost + totalStorageCost).toFixed(4);
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `${numKeys} x ${Number(totalLinkCost / numKeys).toFixed(4)} =`,
      },
      {
        name: 'Storage fees',
        total: totalStorageCost,
      },
      {
        name: 'Keypom fee',
        total: 0,
        isDiscount: true,
        discountText: 'Early bird discount',
      },
      {
        name: 'Total Required',
        total: totalRequired,
        doNotRender: true,
      },
    ];

    const confirmationText = `Creating ${numKeys} for ${totalCost} NEAR`;

    return { costsData, totalCost: parseFloat(totalCost), confirmationText };
  };

  const handleDropConfirmation = async (paymentData: PaymentData) => {
    const totalRequired = paymentData.costsData[3].total;

    await update(NFT_ATTEMPT_KEY, (val) => ({ ...val, confirmed: true }));
    
    get(NFT_ATTEMPT_KEY).then((val) => console.log("Updated NFT_ATTEMPT_KEY", val));
    const wallet = await window.selector.wallet();

    try{
      const add2bal_res = await wallet.signAndSendTransaction({
        callbackUrl: window.location.origin + '/drop/nft/new',
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'add_to_balance',
              args: {},
              gas: '300000000000000',
              deposit: totalRequired.toString(),
            },
          },
        ],
      })

      console.log("data: ", data);

      console.log("add to balanace result: ", add2bal_res)
      
      window.location.assign(window.location.origin + '/drop/nft/new');
    }catch(e){
      console.log(e)
    }

    // half second delay to allow for indexeddb to update
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const createLinksSWR = {
    data,
    handleDropConfirmation,
  };

  return (
    <CreateNftDropContext.Provider
      value={{
        getSummaryData,
        getPaymentData,
        handleDropConfirmation,
        createLinksSWR,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </CreateNftDropContext.Provider>
  );
};

export const useCreateNftDrop = (): CreateNftDropContextType => {
  const context = useContext(CreateNftDropContext);
  if (context == null) {
    throw new Error('unable to find CreateNftDropContext');
  }

  return context;
};
