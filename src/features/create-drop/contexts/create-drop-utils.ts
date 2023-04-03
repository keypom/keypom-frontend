import { getEnv, generateKeys, createDrop, parseNearAmount } from 'keypom-js';
import { get, update, del } from 'idb-keyval';
import { pack } from 'ipfs-car/dist/esm/pack';
import { MemoryBlockStore } from 'ipfs-car/dist/esm/blockstore/memory';

import { MASTER_KEY, NFT_ATTEMPT_KEY } from '@/constants/common';

const WORKER_BASE_URL = 'https://keypom-nft-storage.keypom.workers.dev/';

export const DEBUG_DEL_NFT_ATTEMPT = async (key) => {
  await del(key);
};

export const getAttempt = async (key) => {
  const data = (await get(key)) || {};
  if (!data.dropId) {
    return null;
  }
  return data;
};

export const createDropsWithLazyNFT = async ({
  dropId,
  returnTransactions = false,
  data,
  tickets = false,
  setAppModal = null,
  key,
}) => {
  const file = await data?.media?.arrayBuffer();

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
    console.log('CID', media);
  }

  let keys, requiredDeposit;
  if (!data.seriesSecret) {
    try {
      const res = await createDrop({
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
                    media,
                  },
                  // royalty?
                }),
                attachedDeposit: parseNearAmount('0.1')!,
              },
            ],
          ],
        },
        useBalance: !returnTransactions,
        returnTransactions,
      });

      keys = res.keys;
      requiredDeposit = res.requiredDeposit;

      if (!returnTransactions && !keys) {
        throw new Error('Error creating drop');
      }

      // we're making the NFT now, so store the secret in case we have to re-attempt media upload
      if (file) {
        await update(key, (val) => ({ ...val, seriesSecret: keys.secretKeys[0] }));
        data.seriesSecret = keys.secretKeys[0];
      }
    } catch (e) {
      console.warn(e);
      throw new Error('Error creating drop');
    }
  }

  if (file) {
    const { networkId } = getEnv();
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
      console.warn('cfw error', error);
      res = { error };
    }

    if (res.error) {
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
                await DEBUG_DEL_NFT_ATTEMPT(key);
                window.location.reload();
              },
              buttonProps: {
                variant: 'outline',
              },
            },
          ],
        });

      if (/Invalid drop/.test(res.error.toString())) {
        return mediaErrorModal();
      }

      if (/drop not claimed/.test(res.error.toString())) {
        return mediaErrorModal();
      }

      if (/media not uploaded/.test(res.error.toString())) {
        // TODO get tx hash from error and store locally, resubmit tx hash to worker
        // TODO worker verifies that it tried to claim and was successful
        return mediaErrorModal();
      }
    }

    await update(key, (val) => ({ ...val, seriesClaimed: true, fileUploaded: true }));

    console.log('response from worker', res);
  }

  try {
    const { publicKeys } = await generateKeys({
      numKeys,
      rootEntropy: `${localStorage.getItem(MASTER_KEY) as string}-${dropId as string}`,
      autoMetaNonceStart: 0,
    });

    const methods: any[][] = [];

    if (tickets) {
      methods.push(null, null);
    }

    methods.push([
      {
        receiverId: 'nft-v2.keypom.testnet',
        methodName: 'nft_mint',
        args: '',
        dropIdField: 'mint_id',
        accountIdField: 'receiver_id',
        attachedDeposit: parseNearAmount('0.1')!,
      },
    ]);

    const { responses, requiredDeposit: requiredDeposit2 } = await createDrop({
      wallet,
      dropId,
      numKeys,
      publicKeys,
      config: {
        usesPerKey: 3,
      },
      metadata: JSON.stringify({
        dropName: title,
      }),
      fcData: {
        methods,
      },
      useBalance: !returnTransactions,
      returnTransactions,
    });

    if (returnTransactions) {
      return { requiredDeposit, requiredDeposit2 };
    }

    return { responses };
  } catch (e) {
    // TODO better error here
    console.warn(e);
    return {};
  }
};

export const handleFinishDrop = async ({
  setAppModal,
  tickets = false,
  key = NFT_ATTEMPT_KEY,
}) => {
  const data = await getAttempt(key);
  if (!data?.confirmed) {
    console.log(data);
    return false;
  }

  let res;
  try {
    res = await createDropsWithLazyNFT({
      key,
      tickets,
      dropId: data.dropId,
      data,
      setAppModal,
    });
  } catch (e) {
    console.warn(e);
  }

  const { responses } = res;
  console.log(responses);
  if (responses?.length > 0) {
    del(key);
  }

  return data.dropId;
};
