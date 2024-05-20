import { getEnv, generateKeys, createDrop } from '@keypom/core';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { get, update, del } from 'idb-keyval';
import { pack } from 'ipfs-car/dist/esm/pack';
import { MemoryBlockStore } from 'ipfs-car/dist/esm/blockstore/memory';

import { MASTER_KEY, NFT_ATTEMPT_KEY, WORKER_BASE_URL } from '@/constants/common';
import getConfig from '@/config/config';
import { Account } from 'near-api-js';

export const DEBUG_DEL_NFT_ATTEMPT = async () => {
  await del(NFT_ATTEMPT_KEY);
};

export const getNFTAttempt = async () => {
  const data = (await get(NFT_ATTEMPT_KEY)) || {};
  if (!data.dropId) {
    return null;
  }
  return data;
};

export const getCostForNFTDrop = async (dropId, data) => {
  const { networkId } = getEnv();
  const networkSuffix = networkId === 'testnet' ? networkId : 'near';

  const { media = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } = data;

  const { numKeys, title, description } = data;

  const wallet = await window.selector.wallet();
  const selector = window.selector.store;

  console.log( window.selector.store.getState())
  console.log( window.selector.store.observable)

  console.log(selector);

  // Connection
  const env = getEnv();
  console.log(env)
  const near = env.near;
  const connection = near?.connection;
  if(connection == null) return {};

  const firstDropArgs = {
    wallet,
    numKeys: 1,
    metadata: JSON.stringify({
      dropName: title,
    }),
    depositPerUseNEAR: 0.1,
    fcData: {
      methods: [
        [
          {
            receiverId: 'nft-v2.keypom.' + networkSuffix,
            methodName: 'create_series',
            args: JSON.stringify({
              mint_id: parseInt(dropId),
              metadata: {
                title,
                description,
                copies: numKeys,
                media,
              },
              // royalty?
            }),
            attachedDeposit: parseNearAmount('0.1')!,
          },
        ],
      ],
    },
    useBalance: false,
    returnTransactions: true,
  }

  let requiredDeposit, requiredDeposit2;
  if (!data.seriesSecret) {
    try {
      const res = await createDrop(firstDropArgs);

      requiredDeposit = res.requiredDeposit;

      console.log(res)
      if (!res) {
        throw new Error('Error creating drop');
      }

    } catch (e) {
      console.log("error creating NFT drop: ", e);
      throw new Error('Error creating drop');
    }
  }

  try {
    const { publicKeys } = await generateKeys({
      numKeys,
      rootEntropy: `${localStorage.getItem(MASTER_KEY) as string}-${dropId as string}`,
      autoMetaNonceStart: 0,
    });

    const secondDropArgs = {
      wallet,
      publicKeys,
      dropId,
      numKeys,
      metadata: JSON.stringify({
        dropName: title,
      }),
      fcData: {
        methods: [
          [
            {
              receiverId: 'nft-v2.keypom.' + networkSuffix,
              methodName: 'nft_mint',
              args: '',
              dropIdField: 'mint_id',
              accountIdField: 'receiver_id',
              attachedDeposit: parseNearAmount('0.1')!,
            },
          ],
        ],
      },
      useBalance: false,
      returnTransactions: true,
    }

    const res2 = await createDrop(secondDropArgs);

    requiredDeposit2 = res2.requiredDeposit;

    return { requiredDeposit,  requiredDeposit2 };
  } catch (e) {
    // TODO better error here
    console.warn(e);
    return {};
  }
};

// TODO: once drop creation is working, refactor to add to balance to batch transaction
export const createDropsForNFT = async (dropId, returnTransactions, data, setAppModal) => {
  const { networkId } = getEnv();
  const networkSuffix = networkId === 'testnet' ? networkId : 'near';

  const file = await data?.media?.arrayBuffer();

  console.log("file in createDropsForNFT", file)

  let { media = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } = data;

  const { numKeys, title, description } = data;

  const wallet = await window.selector.wallet();

  // generate CID locally HERE
  if (file) {
    const { root } = await pack({
      input: file,
      blockstore: new MemoryBlockStore(),
      wrapWithDirectory: false,
    });
    media = root.toString();
  }

  let keys;
  // , requiredDeposit;
  if (!data.seriesSecret) {
    try {
      keys = await generateKeys({ numKeys: 1 });
      console.log("keys after generate: ", keys)

      const config = getConfig();
      await wallet.signAndSendTransaction({
        receiverId: config.contractName,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'create_drop',
              args: { 
                drop_id: dropId,
                deposit_per_use: parseNearAmount('0.1'), 
                metadata: JSON.stringify({
                  dropName: title,
                }),
                public_keys: keys.publicKeys,
                config: {
                  usage: {
                    auto_delete_drop: true
                  }
                },
                fc: {
                  methods: [
                    [
                      {
                        receiver_id: 'nft-v2.keypom.' + networkSuffix,
                        method_name: 'create_series',
                        args: JSON.stringify({
                          mint_id: parseInt(dropId),
                          metadata: {
                            title,
                            description,
                            copies: numKeys,
                            media,
                          },
                          // royalty?
                        }),
                        attached_deposit: parseNearAmount('0.1')!,
                      },
                    ],
                  ],
                },
              },
              gas: '300000000000000',
              deposit: '0',
            },
          },
        ]
      })
    
      // we're making the NFT now, so store the secret in case we have to re-attempt media upload
      if (file) {
        console.log("keys in file update: ", keys)
        await update(NFT_ATTEMPT_KEY, (val) => ({ ...val, seriesSecret: keys.secretKeys[0] }));
        data.seriesSecret = keys.secretKeys[0];
        console.log("data1", data)
      }
    } catch (e) {
      console.log("error creating NFT drop: ", e);
      throw new Error('Error creating drop');
    }
  }

  if (file) {
    const { networkId } = getEnv();
    console.log("data2", data)
    const url = `${WORKER_BASE_URL}?network=${networkId as string}&secretKey=${
      data.seriesSecret as string
    }`;
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        body: file,
      }).then(async (r) => await r.json());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('cfw error', error);
      res = { error };
    }

    if (res.error) {
      // eslint-disable-next-line no-console
      console.warn('cfw error', res.error);

      const mediaErrorModal = () =>
        setAppModal({
          isOpen: true,
          header: 'Whoops',
          message: 'Your media failed to upload. Please reload this page to try again.',
          options: [
            {
              label: 'Ok Reload',
              func: () => {
                window.location.reload();
              },
              buttonProps: {
                variant: 'outline',
              },
            },
            {
              label: 'DEBUG - CANCEL',
              func: async () => {
                await DEBUG_DEL_NFT_ATTEMPT();
                window.location.reload();
              },
              buttonProps: {
                variant: 'outline',
              },
            },
          ],
        });

      if (/drop not claimed/.test(res.error.toString())) {
        return mediaErrorModal();
      }

      if (/media not uploaded/.test(res.error.toString())) {
        // TODO get tx hash from error and store locally, resubmit tx hash to worker
        // TODO worker verifies that it tried to claim and was successful
        return mediaErrorModal();
      }
    }

    await update(NFT_ATTEMPT_KEY, (val) => ({ ...val, seriesClaimed: true, fileUploaded: true }));
  }

  try {
    const { publicKeys } = await generateKeys({
      numKeys,
      rootEntropy: `${localStorage.getItem(MASTER_KEY) as string}-${dropId as string}`,
      autoMetaNonceStart: 0,
    });

    const config = getConfig();
    const res2 = await wallet.signAndSendTransaction({
      receiverId: config.contractName,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_drop',
            args: { 
              drop_id: dropId,
              deposit_per_use: parseNearAmount('0.1'), 
              metadata: JSON.stringify({
                dropName: title,
              }),
              public_keys: publicKeys,
              fc:  {
                methods: [
                  [
                    {
                      receiver_id: 'nft-v2.keypom.' + networkSuffix,
                      method_name: 'nft_mint',
                      args: '',
                      drop_id_field: 'mint_id',
                      account_id_field: 'receiver_id',
                      attached_deposit: parseNearAmount('0.1')!,
                    },
                  ],
                ],
              },
            },
            gas: '300000000000000',
            deposit: '0',
          },
        },
      ]
    })

    return { responses: [res2] };
  } catch (e) {
    // TODO better error here
    console.warn(e);
    return {};
  }
};

const unloadFn = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

export const handleFinishNFTDrop = async (setAppModal) => {
  console.log("handleFinish")
  
  const data = await getNFTAttempt();
  if (!data?.confirmed) {
    return false;
  }


  window.addEventListener('beforeunload', unloadFn);
  let res;
  try {
    res = await createDropsForNFT(data.dropId, false, data, setAppModal);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  }

  console.log(res);
  const { responses } = res;
  if (responses?.length > 0) {
    del(NFT_ATTEMPT_KEY);
  }

  window.removeEventListener('beforeunload', unloadFn);

  return data.dropId;
};
