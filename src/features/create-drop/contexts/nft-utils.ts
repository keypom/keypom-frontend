import { getEnv, generateKeys, createDrop, parseNearAmount } from 'keypom-js';
import { get, update, del } from 'idb-keyval';
import { pack } from 'ipfs-car/dist/esm/pack';
import { MemoryBlockStore } from 'ipfs-car/dist/esm/blockstore/memory';

import { MASTER_KEY, NFT_ATTEMPT_KEY, WORKER_BASE_URL } from '@/constants/common';

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

export const createDropsForNFT = async (dropId, returnTransactions, data, setAppModal) => {
  const { networkId } = getEnv();
  const networkSuffix = networkId === 'testnet' ? networkId : 'near';

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
  }

  let keys, requiredDeposit;
  if (!data.seriesSecret) {
    try {
      const res = await createDrop({
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
        await update(NFT_ATTEMPT_KEY, (val) => ({ ...val, seriesSecret: keys.secretKeys[0] }));
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

    const { responses, requiredDeposit: requiredDeposit2 } = await createDrop({
      wallet,
      dropId,
      numKeys,
      publicKeys,
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

const unloadFn = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

export const handleFinishNFTDrop = async (setAppModal) => {
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

  const { responses } = res;
  if (responses?.length > 0) {
    del(NFT_ATTEMPT_KEY);
  }

  window.removeEventListener('beforeunload', unloadFn);

  return data.dropId;
};
