import {
  getDropInformation,
  getEnv,
  initKeypom,
  type ProtocolReturnedDrop,
  updateKeypomContractId,
  getFTMetadata,
  claim,
  getKeyInformation,
  hashPassword,
  getPubFromSecret,
  formatNearAmount,
  formatLinkdropUrl,
  generateKeys,
  getKeyInformationBatch,
  getKeySupplyForDrop,
  deleteKeys,
  getKeysForDrop,
  deleteDrops,
  getDropSupplyForOwner,
  getDrops,
} from 'keypom-js';
import * as nearAPI from 'near-api-js';

import { CLOUDFLARE_IPFS, DROP_TYPE, MASTER_KEY } from '@/constants/common';
import getConfig from '@/config/config';
import { get } from '@/utils/localStorage';

let instance: KeypomJS;
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const networkId = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
const config = getConfig();

const connectionConfig = {
  networkId,
  keyStore: myKeyStore,
  nodeUrl: config.nodeUrl,
  walletUrl: config.walletUrl,
  helperUrl: config.helperUrl,
  explorerUrl: config.explorerUrl,
};

const CACHE_MAX_AGE = 5000; // in ms
class KeypomJS {
  private static instance: KeypomJS;
  nearConnection: nearAPI.Near;
  test = 0;

  dropStore: {
    dropWithKeys: Record<
      string,
      Record<
        number,
        {
          drop: ProtocolReturnedDrop;
          cacheExpiryTime: number;
          pk?: string[];
          sk?: string[];
        }
      >
    >;
    paginatedMyDrops: Record<number, { drops: ProtocolReturnedDrop[]; cacheExpiryTime: number }>;
  } = {
    dropWithKeys: {}, // this is to cache the keys of each respective drops, mainly used in DropManager.tsx and [id].tsx
    paginatedMyDrops: {}, // this is to cache the drops from My Drops, mainly used in AllDrops.tsx
  };

  constructor() {
    if (instance !== undefined) {
      throw new Error('New instance cannot be created!!');
    }
  }

  init = async () => {
    initKeypom({ network: networkId })
      .then(() => {
        console.log('KeypomJS initialized');
      })
      .catch((err) => {
        console.error('Failed to initialize KeypomJS', err);
      });

    const { connect } = nearAPI;

    this.nearConnection = await connect(connectionConfig);
  };

  public static getInstance(): KeypomJS {
    if (!KeypomJS.instance) {
      KeypomJS.instance = new KeypomJS();
    }

    return KeypomJS.instance;
  }

  validateAccountId = async (accountId: string) => {
    if (!(accountId.length >= 2 && accountId.length <= 64 && ACCOUNT_ID_REGEX.test(accountId))) {
      throw new Error('Account Id is invalid');
    }

    try {
      const account = await this.nearConnection.account(accountId);
      await account.state();
    } catch (err) {
      throw new Error('Account Id does not exist');
    }
    return true;
  };

  verifyDrop = async (contractId: string, secretKey: string) => {
    const { networkId, supportedKeypomContracts } = getEnv();

    if (
      supportedKeypomContracts === undefined ||
      networkId === undefined ||
      contractId === undefined
    ) {
      throw new Error('Please supply supportedKeypomContracts, networkId and contractId');
    }

    if (supportedKeypomContracts[networkId][contractId] === undefined) {
      throw new Error("Linkdrop is invalid and isn't officially supported by Keypom contract.");
    }

    await updateKeypomContractId({ keypomContractId: contractId });
  };

  checkTicketRemainingUses = async (contractId: string, secretKey: string) => {
    await this.verifyDrop(contractId, secretKey);

    const keyInfo = await getKeyInformation({ secretKey });

    if (keyInfo === null || keyInfo === undefined) {
      throw new Error('Drop has been deleted or has already been claimed');
    }

    return keyInfo.remaining_uses;
  };

  checkIfDropExists = async (secretKey: string) => {
    try {
      await this.getDropInfo({ secretKey });
      return true;
    } catch (err) {
      return false;
    }
  };

  claimTicket = async (secretKey: string, password: string) => {
    let keyInfo = await getKeyInformation({ secretKey });
    const publicKey: string = await getPubFromSecret(secretKey);
    const passwordForClaim = await hashPassword(
      password + publicKey + keyInfo.cur_key_use.toString(),
    );

    try {
      await claim({ secretKey, password: passwordForClaim, accountId: 'foo' });
    } catch (e) {
      console.warn(e);
    }

    keyInfo = await getKeyInformation({ secretKey });
    if (keyInfo.remaining_uses === 2) {
      throw new Error('Password is incorrect. Please try again.');
    }
  };

  // valid contract id -> v1-3.keypom.testnet
  // getEnv check for contractid validity
  // updateKeypomContractId
  // getDropInformation
  // check drop type
  /*
    ft -> Tokens
    fc -> Ticket (3 method calls)
    fc -> NFT (1 method call)
    simple -> simple drop?
  */
  getLinkdropType = async (drop: ProtocolReturnedDrop, contractId: string, secretKey: string) => {
    await this.verifyDrop(contractId, secretKey);
    return this.getDropType(drop);
  };

  getDropType = (drop: ProtocolReturnedDrop) => {
    if (drop.fc === undefined && drop.nft === undefined) {
      return DROP_TYPE.TOKEN;
    }

    if (drop.fc !== undefined) {
      if (drop.fc.methods[0]?.length === 2) {
        return DROP_TYPE.TRIAL;
      }

      if (drop.fc.methods.length === 3) {
        return DROP_TYPE.TICKET;
      }

      if (
        drop.fc.methods.length === 1 &&
        drop.fc.methods[0] !== undefined &&
        drop.fc.methods[0][0].method_name === 'nft_mint'
      ) {
        return DROP_TYPE.NFT;
      }
    }

    return DROP_TYPE.OTHER;
  };

  getDrops = async ({
    accountId,
    start,
    limit,
    withKeys,
  }: {
    accountId: string;
    start: number;
    limit: number;
    withKeys: boolean;
  }) => {
    /** Get Drops caching logic */
    if (
      !Object.prototype.hasOwnProperty.call(this.dropStore.paginatedMyDrops, start) ||
      Date.now() > this.dropStore.paginatedMyDrops[start].cacheExpiryTime
    ) {
      const newDropsCacheExpiryTime = new Date(Date.now() + CACHE_MAX_AGE).getTime();

      this.dropStore.paginatedMyDrops[start] = {
        drops: await getDrops({ accountId, start, limit, withKeys }),
        cacheExpiryTime: newDropsCacheExpiryTime,
      };
    }

    return this.dropStore.paginatedMyDrops[start].drops;
  };

  getDropSupplyForOwner = async ({ accountId }) => await getDropSupplyForOwner({ accountId });

  getDropMetadata = (metadata: string | undefined) =>
    JSON.parse(metadata || JSON.stringify({ dropName: 'Untitled' }));

  deleteDrops = async ({ wallet, dropIds }) => await deleteDrops({ wallet, dropIds });

  deleteKeys = async ({ wallet, dropId, publicKeys }) =>
    await deleteKeys({ wallet, dropId, publicKeys });

  getDropInfo = async ({
    dropId,
    secretKey,
  }: {
    dropId?: string;
    secretKey?: string;
  }): Promise<ProtocolReturnedDrop> => {
    let drop: ProtocolReturnedDrop;

    if (!dropId && !secretKey) {
      throw new Error('dropId or secretKey must be provided.');
    }

    try {
      drop = await getDropInformation({ dropId, secretKey });
    } catch (err) {
      throw new Error('Unable to claim. This drop may have been claimed before.');
    }

    return drop;
  };

  getClaimedDropInfo = async (dropId: string) => await getKeySupplyForDrop({ dropId });

  getKeysForDrop = async ({ dropId, limit, start }) =>
    await getKeysForDrop({ dropId, limit, start });

  getLinksToExport = async (dropId) => {
    const drop = await this.getDropInfo({ dropId });
    const { secretKeys } = await generateKeys({
      numKeys: drop.next_key_id,
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId as string}`,
      autoMetaNonceStart: 0,
    });

    const links = secretKeys.map(
      (key, i) =>
        `${window.location.origin}/claim/${getConfig().contractId}#${key.replace('ed25519:', '')}`,
    );

    return links;
  };

  getKeysInfo = async (
    dropId: string,
    pageIndex: number,
    pageSize: number,
    getDropErrorCallback?: () => void,
  ) => {
    try {
      /** Get PaginatedDrops caching logic */
      if (
        !Object.prototype.hasOwnProperty.call(this.dropStore.dropWithKeys, dropId) ||
        !Object.prototype.hasOwnProperty.call(this.dropStore.dropWithKeys[dropId], pageIndex) ||
        Date.now() > this.dropStore.dropWithKeys[dropId][pageIndex].cacheExpiryTime
      ) {
        if (this.dropStore.dropWithKeys[dropId] === undefined)
          this.dropStore.dropWithKeys[dropId] = {};
        const newPaginatedDropsCacheExpiryTime = new Date(Date.now() + CACHE_MAX_AGE).getTime();

        this.dropStore.dropWithKeys[dropId][pageIndex] = {
          drop: await this.getDropInfo({ dropId }),
          cacheExpiryTime: newPaginatedDropsCacheExpiryTime,
          pk: undefined,
          sk: undefined,
        };
      }

      const dropSize = this.dropStore.dropWithKeys[dropId][pageIndex].drop.next_key_id;
      const { dropName } = this.getDropMetadata(
        this.dropStore.dropWithKeys[dropId][pageIndex].drop.metadata,
      );

      // Get PaginatedDrops PK SK caching logic
      if (
        this.dropStore.dropWithKeys[dropId][pageIndex].pk === undefined ||
        this.dropStore.dropWithKeys[dropId][pageIndex].sk === undefined
      ) {
        const { publicKeys, secretKeys } = await generateKeys({
          numKeys:
            (pageIndex + 1) * pageSize > dropSize
              ? dropSize - pageIndex * pageSize
              : Math.min(dropSize, pageSize),
          rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
          autoMetaNonceStart: pageIndex * pageSize,
        });

        this.dropStore.dropWithKeys[dropId][pageIndex].pk = publicKeys;
        this.dropStore.dropWithKeys[dropId][pageIndex].sk = secretKeys;
      }

      const keyInfo = await getKeyInformationBatch({
        publicKeys: this.dropStore.dropWithKeys[dropId][pageIndex].pk,
        secretKeys: this.dropStore.dropWithKeys[dropId][pageIndex].sk,
      });

      return {
        dropSize,
        dropName,
        publicKeys: this.dropStore.dropWithKeys[dropId][pageIndex].pk,
        secretKeys: this.dropStore.dropWithKeys[dropId][pageIndex].sk,
        keyInfo,
      };
    } catch (e) {
      if (getDropErrorCallback) getDropErrorCallback();
      return; // eslint-disable-line no-useless-return
    }
  };

  generateExternalWalletLink = async (
    walletName: string,
    contractId: string,
    secretKey: string,
  ) => {
    // verify the drop first
    try {
      await this.getDropInfo({ secretKey });
    } catch (err) {
      console.error(err);
      throw new Error('This drop has been claimed.');
    }

    // generate the link to navigate to
    const urls = formatLinkdropUrl({
      claimPage: walletName,
      contractId,
      secretKeys: [secretKey],
    });

    return urls[0];
  };

  getTokenClaimInformation = async (
    contractId: string,
    secretKey: string,
    skipLinkdropCheck = false,
  ) => {
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a token drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType && !DROP_TYPE[linkdropType]) {
      throw new Error('This drop is not supported. Please contact the sender of this link.');
    }

    const dropMetadata = this.getDropMetadata(drop.metadata);
    let ftMetadata;
    if (drop.ft !== undefined) {
      ftMetadata = await getFTMetadata({ contractId: drop.ft.contract_id });
    }

    return {
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      ftMetadata,
      amountTokens: drop.ft?.balance_per_use, // TODO: format correctly with FT metadata
      amountNEAR: formatNearAmount(drop.deposit_per_use, 4),
    };
  };

  getNftMetadata = async (drop: ProtocolReturnedDrop) => {
    const fcMethods = drop.fc?.methods;
    if (
      fcMethods === undefined ||
      fcMethods.length === 0 ||
      fcMethods[0] === undefined ||
      fcMethods[0][0] === undefined
    ) {
      throw new Error('Unable to retrieve function calls.');
    }

    const fcMethod = fcMethods[0][0];
    const { receiver_id: receiverId } = fcMethod;
    const { viewCall } = getEnv();

    let nftData;
    try {
      nftData = await viewCall({
        contractId: receiverId,
        methodName: 'get_series_info',
        args: { mint_id: parseInt(drop.drop_id) },
      });
    } catch (err) {
      console.error('NFT series not found');
      throw new Error('NFT series not found');
    }

    return {
      media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
      title: nftData.metadata.title,
      description: nftData.metadata.description,
    };
  };

  getNFTClaimInformation = async (contractId: string, secretKey: string) => {
    // given fc
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a nft drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType !== DROP_TYPE.NFT) {
      throw new Error('This drop is not an NFT drop. Please contact your drop creator.');
    }

    const dropMetadata = this.getDropMetadata(drop.metadata);

    const nftMetadata = await this.getNftMetadata(drop); // will still throw relevant error

    return {
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      ...nftMetadata,
    };
  };

  getTicketNftInformation = async (contractId: string, secretKey: string) => {
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a ticket drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType !== DROP_TYPE.TICKET) {
      throw new Error('This drop is not a Ticket drop. Please contact your drop creator.');
    }
    const remainingUses = await this.checkTicketRemainingUses(contractId, secretKey);

    const dropMetadata = this.getDropMetadata(drop.metadata);

    const fcMethods = drop.fc?.methods;
    if (
      fcMethods === undefined ||
      fcMethods.length < 3 ||
      fcMethods[2] === undefined ||
      fcMethods[2][0] === undefined
    ) {
      throw new Error('Unable to retrieve function calls.');
    }

    const fcMethod = fcMethods[2][0];
    const { receiver_id: receiverId } = fcMethod;
    const { viewCall } = getEnv();

    let nftData;
    try {
      nftData = await viewCall({
        contractId: receiverId,
        methodName: 'get_series_info',
        args: { mint_id: parseFloat(drop.drop_id) },
      });
    } catch (err) {
      console.error('NFT series not found');
      throw new Error('NFT series not found');
    }

    return {
      remainingUses,
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
      title: nftData.metadata.title,
      description: nftData.metadata.description,
    };
  };

  claim = async (secretKey: string, walletAddress: string, skipValidation = false) => {
    if (!skipValidation) {
      await this.validateAccountId(walletAddress);
    }
    await claim({ secretKey, accountId: walletAddress });
  };
}

const keypomInstance = KeypomJS.getInstance();

export default keypomInstance;
