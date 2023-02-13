import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createDrop, formatNearAmount } from 'keypom-js';

import { urlRegex } from '@/constants/common';
import {
  type PaymentData,
  type PaymentItem,
  type SummaryItem,
} from '@/features/create-drop/types/types';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const schema = z.object({
  nftName: z.string().min(1, 'NFT name required'),
  description: z.string().min(1, 'Description required'),
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
  handleDropConfirmation: () => void;
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
      nftName: '',
      description: '',
      artwork: '',
      selectedToWallets: [],
      redirectLink: '',
    },
    resolver: zodResolver(schema),
  });

  const getSummaryData = (): SummaryItem[] => {
    const { getValues } = methods;
    const [nftName, description, artwork] = getValues(['nftName', 'description', 'artwork']);

    return [
      {
        type: 'text',
        name: 'NFT name',
        value: nftName,
      },
      {
        type: 'text',
        name: 'NFT description',
        value: description,
      },
      {
        type: 'image',
        name: 'Artwork',
        value: artwork,
      },
    ];
  };

  const getPaymentData = async (): Promise<PaymentData> => {
    const { nftName, description, artwork } = methods.getValues();

    const numBytes = nftName.length + description.length + artwork[0].size

    console.log(numBytes)

    /*
    TODO
    - save nft deets and artwork to localStorage / indexeddb
    - create required deposit for 2 drops (1 storage payment for nft, 1 for drop itself)
    - create subtotal for whole payment
    - create add to balance call for whole payment
    - return from redirect / await
    - send drop to worker
    - worker responds true
    - create drop for nft lazy mint
    */

    // const { requiredDeposit } = await createDrop({
    //   wallet: await window.selector.wallet(),
    //   depositPerUseNEAR: amountPerLink!,
    //   numKeys: totalLinks,
    //   returnTransactions: true,
    // });

    // TODO: assuming this comes from backend
    const totalLinkCost = 20 * 3.5;
    const NEARNetworkFee = 50.15;
    const totalCost = totalLinkCost + NEARNetworkFee;
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `20 x 3.509`,
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

    const confirmationText = `Creating 20 for ${totalCost} NEAR`;

    return { costsData, totalCost, confirmationText };
  };

  const handleDropConfirmation = () => {
    // TODO: send transaction/request to backend
    trigger();
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
