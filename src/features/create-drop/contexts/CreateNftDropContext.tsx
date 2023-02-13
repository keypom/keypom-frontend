import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BN from 'bn.js';
import { createDrop, formatNearAmount, parseNearAmount, addToBalance } from 'keypom-js';
import { set, getFileAsBase64 } from '@/utils/localStorage';

import { urlRegex } from '@/constants/common';
import {
  type PaymentData,
  type PaymentItem,
  type SummaryItem,
} from '@/features/create-drop/types/types';

const NFT_ATTEMPT_KEY = 'NFT_ATTEMPT';
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
  title: z.string().min(1, 'NFT name required'),
  description: z.string().min(1, 'Description required'),
  number: z.coerce.number().min(1, 'You must create at least 1 NFT').max(50, 'Max NFTs per drop is currently 50'),
  artwork: z
    .any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
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
  await new Promise((res) => setTimeout(res, 2000));
  return {
    success: true,
  };
};

interface CreateNftDropContextType {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: (paymentData: PaymentData) => void;
  createLinksSWR: {
    data: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateNftDropContext = createContext<CreateNftDropContextType | null>(null);

export const CreateNftDropProvider = ({ children }: PropsWithChildren) => {
  const { trigger, data } = useSWRMutation('/api/drops/tokens', createLinks);
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
    const [title, description, number, artwork] = getValues(['title', 'description', 'number', 'artwork']);

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
      throw new Error('incorrect number')
    }

    const media = await getFileAsBase64(artwork[0])

    set(NFT_ATTEMPT_KEY, {
      title,
      description,
      copies: numKeys,
      media,
    })

    /*
    TODO
    x save nft deets and artwork to localStorage / indexeddb
    x create required deposit for 2 drops (1 storage payment for nft, 1 for drop itself)
    - create subtotal for whole payment
    - create add to balance call for whole payment
    - return from redirect / await
    - send drop to worker
    - worker responds true
    - create drop for nft lazy mint
    */

    const dropId = Date.now().toString()

    const { requiredDeposit } = await createDrop({
      wallet: await window.selector.wallet(),
      dropId,
      numKeys,
      metadata: title,
      fcData: {
          methods: [[
              {
                  receiverId: 'nft-v2.keypom.testnet',
                  methodName: "nft_mint",
                  args: "",
                  dropIdField: "mint_id",
                  accountIdField: "receiver_id",
                  attachedDeposit: parseNearAmount("0.1")!
              }
          ]]
      },
      returnTransactions: true,
    });

    const { requiredDeposit: requiredDeposit2 } = await createDrop({
      wallet: await window.selector.wallet(),
      numKeys: 1,
      metadata: JSON.stringify({
        name: title
      }),
      depositPerUseNEAR: 1,
      fcData: {
          methods: [[
            {
              receiverId: 'nft-v2.keypom.testnet',
              methodName: 'create_series',
              args: JSON.stringify({
                  mint_id: parseInt(dropId),
                  metadata: {
                    title,
                    description,
                    copies: numKeys,
                    // pay for CID at most 64 chars
                    media: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                  },
                  // royalty
              }),
              attachedDeposit: parseNearAmount("0.1")!
            }
          ]]
      },
      returnTransactions: true,
    });

    const totalRequired = new BN(requiredDeposit).add(new BN(requiredDeposit2)).toString()

    // TODO: assuming this comes from backend
    const totalLinkCost = parseFloat(formatNearAmount(requiredDeposit!, 4))
    const totalStorageCost = parseFloat(formatNearAmount(requiredDeposit2!, 4))
    const totalCost = totalLinkCost + totalStorageCost
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `${numKeys} x ${Number(totalLinkCost/numKeys).toFixed(4)}`,
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
      }
    ];

    const confirmationText = `Creating ${numKeys} for ${totalCost} NEAR`;

    return { costsData, totalCost, confirmationText };
  };

  const handleDropConfirmation = async (paymentData: PaymentData) => {

    const totalRequired = paymentData.costsData[3].total

    await addToBalance({
      wallet: await window.selector.wallet(),
      amountYocto: totalRequired.toString(),
      successUrl: window.location.origin + '/drops',
    })

    // TODO redirect to drops page and await confirmation of createDrop call with hasBalance
    
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
