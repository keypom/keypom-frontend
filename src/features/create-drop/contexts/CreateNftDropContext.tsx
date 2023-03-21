import { createContext, type PropsWithChildren, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import BN from 'bn.js';
import { createDrop, formatNearAmount, parseNearAmount, addToBalance, getUserBalance } from 'keypom-js';
import { get, set, update, del } from 'idb-keyval'

import Hash from 'ipfs-only-hash'
import { pack } from 'ipfs-car/dist/esm/pack'
import { MemoryBlockStore } from 'ipfs-car/dist/esm/blockstore/memory'

import { urlRegex } from '@/constants/common';
import {
  type PaymentData,
  type PaymentItem,
  type SummaryItem,
} from '@/features/create-drop/types/types';
import {
  NFT_ATTEMPT_KEY
} from '@/constants/common'

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/webp'];
export const DEBUG_DEL_NFT_ATTEMPT = () => del(NFT_ATTEMPT_KEY)

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
  await new Promise((_resolve) => setTimeout(_resolve, 2000));
  return {
    success: true,
  };
};

interface CreateNftDropContextType {
  getSummaryData: () => SummaryItem[];
  getPaymentData: () => PaymentData;
  handleDropConfirmation: (paymentData: PaymentData) => void;
  createLinksSWR: {
    data?: { success: boolean };
    handleDropConfirmation: () => void;
  };
}

const CreateNftDropContext = createContext<CreateNftDropContextType>({
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
    data: { success: false },
    handleDropConfirmation: function (): void {
      throw new Error('Function not implemented.');
    },
  },
});

const createDropsForNFT = async (dropId, returnTransactions, data) => {
  const file = await data?.media?.arrayBuffer()

  let {
    numKeys,
    title,
    description,
    media = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  } = data;

  const wallet = await window.selector.wallet();

  const balance = await getUserBalance({
    accountId: (await wallet.getAccounts())[0].accountId,
  })
  console.log(formatNearAmount(balance, 4))

  // generate CID locally HERE
  if (file) {
    const { root } = await pack({
      input: file,
      blockstore: new MemoryBlockStore(),
      wrapWithDirectory: false
    })
    media = root.toString()
    console.log('CID', media)
  }

  const { keys, requiredDeposit } = await createDrop({
    wallet,
    numKeys: 1,
    metadata: JSON.stringify({
      name: title,
    }),
    depositPerUseNEAR: 0.1,
    fcData: {
      methods: [
        [
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
                media,
              },
              // royalty
            }),
            attachedDeposit: parseNearAmount('0.1')!,
          },
        ],
      ],
    },
    useBalance: !returnTransactions,
    returnTransactions,
  });

  if (!returnTransactions && !keys) {
    throw new Error('Error creating drop');
  }

  if (file) {
    const url = `http://192.168.0.134:8787/?network=testnet&secretKey=63cTCTC58UpZuxmLsABN5VCpgRjjMZB5DkH1sHwxJf3cpuzYAx8FAXEMHeEzBpyy77LGYeEogD896uHmVjrBQjdh`
    // const url = `http://192.168.0.134:8787/?network=testnet&secretKey=${keys.secretKeys[0]}`

    const res = await fetch(url, {
      method: 'POST',
      body: file,
    }).then((r) => r.json())

    console.log('response from worker', res)
  }

  const { keys: keys2, requiredDeposit: requiredDeposit2 } = await createDrop({
    wallet,
    dropId,
    numKeys,
    metadata: JSON.stringify({
      name: title,
    }),
    fcData: {
      methods: [
        [
          {
            receiverId: 'nft-v2.keypom.testnet',
            methodName: 'nft_mint',
            args: '',
            dropIdField: 'mint_id',
            accountIdField: 'receiver_id',
            attachedDeposit: parseNearAmount('0.1')!,
          },
        ],
      ],
    },
    useBalance: !returnTransactions,
    returnTransactions,
  });

  console.log('drop tx', keys2)

  if (returnTransactions) {
    return { requiredDeposit, requiredDeposit2 };
  }

  return { keyPairs: keys!.keyPairs, keyPairs2: keys2!.keyPairs };
};

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
    
    // json -> indexeddb NOT localStorage (see import above)
    await set(NFT_ATTEMPT_KEY, {
      confirmed: false,
      dropId,
      title,
      description,
      copies: numKeys,
      media,
    });

    const { requiredDeposit, requiredDeposit2 } = await createDropsForNFT(dropId, true, {
      title,
      description,
      numKeys,
    });

    const totalRequired = new BN(requiredDeposit).add(new BN(requiredDeposit2)).toString();

    const totalLinkCost = parseFloat(formatNearAmount(requiredDeposit!, 4));
    const totalStorageCost = parseFloat(formatNearAmount(requiredDeposit2!, 4));
    const totalCost = totalLinkCost + totalStorageCost;
    const costsData: PaymentItem[] = [
      {
        name: 'Link cost',
        total: totalLinkCost,
        helperText: `${numKeys} x ${Number(totalLinkCost / numKeys).toFixed(4)}`,
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

    return { costsData, totalCost, confirmationText };
  };

  const handleDropConfirmation = async (paymentData: PaymentData) => {
    const totalRequired = paymentData.costsData[3].total;

    // TODO set confirmed to true AND ignore if user cancels
    await update(NFT_ATTEMPT_KEY, (val) => ({ ...val, confirmed: true }))

    await addToBalance({
      wallet: await window.selector.wallet(),
      amountYocto: totalRequired.toString(),
      successUrl: window.location.origin + '/drops',
    });
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

export const handleFinishNFTDrop = async () => {
  const {
    dropId,
    title,
    description,
    copies,
    media
  } = await get(NFT_ATTEMPT_KEY) || {};

  // fail silently because we don't have an NFT_ATTEMPT in storage
  if (!title) {
    return;
  }

  let res;
  try {
    res = await createDropsForNFT(dropId, false, {
      title,
      description,
      numKeys: copies,
      media,
    });
  } catch (e) {
    console.warn(e);
  }

  const { keyPairs, keyPairs2 } = res;

  console.log(keyPairs, keyPairs2);

  if (keyPairs.length > 0 && keyPairs2.length > 0) {
    del(NFT_ATTEMPT_KEY);
  }

  /*
    TODO
    x save nft deets and artwork to localStorage / indexeddb
    x create required deposit for 2 drops (1 storage payment for nft, 1 for drop itself)
    x create subtotal for whole payment
    x create add to balance call for whole payment
    x return from redirect / await
    WIP
    - create drop for nft lazy mint
    - check drop created successfully
    - create drop for worker
    - send drop to worker
    - worker responds true
    - show user success
    */
};

export const useCreateNftDrop = (): CreateNftDropContextType => {
  const context = useContext(CreateNftDropContext);
  if (context == null) {
    throw new Error('unable to find CreateNftDropContext');
  }

  return context;
};
