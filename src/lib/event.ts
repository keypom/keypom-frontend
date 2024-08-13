import * as nearAPI from 'near-api-js';
import {
  CLOUDFLARE_IPFS,
  KEYPOM_EVENTS_CONTRACT,
  TOKEN_FACTORY_CONTRACT,
} from '@/constants/common';
import getConfig from '@/config/config';
import { FunderEventMetadata } from './eventsHelpers';
import { decryptPrivateKey, decryptWithPrivateKey, deriveKeyFromPassword } from './cryptoHelpers';
import { Wallet } from '@near-wallet-selector/core';

let instance: EventJS;
const networkId = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
const config = getConfig();

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );
}

export interface ExtClaimedDrop {
  type: 'token' | 'nft';
  name: string;
  image: string;
  drop_id: string;
  found_scavenger_ids?: string[];
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  amount?: string; // Only present if the drop is a token
}

export interface ExtDropData {
  type: 'token' | 'nft';
  name: string;
  image: string;
  drop_id: string;
  nft_metadata?: NftMetadata; // Only present if the drop is an NFT
  amount?: string; // Only present if the drop is a token
  scavenger_hunt?: string[]; // Optional scavenger hunt pieces
}

interface NftMetadata {
  title: string;
  media: string;
  description: string;
}

const connectionConfig = {
  networkId,
  keyStore: myKeyStore,
  nodeUrl: config.nodeUrl,
  walletUrl: config.walletUrl,
  helperUrl: config.helperUrl,
  explorerUrl: config.explorerUrl,
};

class EventJS {
  static instance: EventJS;
  nearConnection: nearAPI.Near;
  viewAccount: nearAPI.Account;
  private dropCache: ExtDropData[] = []; // Cache for all drops

  constructor() {
    if (instance !== undefined) {
      throw new Error('New instance cannot be created!!');
    }

    this.init();
  }

  async init() {
    this.nearConnection = await nearAPI.connect(connectionConfig);
    this.viewAccount = await this.nearConnection.account(config.contractId);
  }

  public static getInstance(): EventJS {
    if (
      EventJS.instance == null ||
      EventJS.instance === undefined ||
      !(EventJS.instance instanceof EventJS) ||
      this.instance === undefined
    ) {
      EventJS.instance = new EventJS();
    }

    return EventJS.instance;
  }

  yoctoToNear = (yocto: string) => nearAPI.utils.format.formatNearAmount(yocto, 4);

  yoctoToNearWith4Decimals = (yoctoString: string) => {
    const divisor = 1e24;
    const near =
      (BigInt(yoctoString) / BigInt(divisor)).toString() +
      '.' +
      (BigInt(yoctoString) % BigInt(divisor)).toString().padStart(24, '0');

    const split = near.split('.');
    const integerPart = split[0];
    let decimalPart = split[1];

    decimalPart = decimalPart.substring(0, 4);

    return `${integerPart}.${decimalPart}`;
  };

  nearToYocto = (near: string) => nearAPI.utils.format.parseNearAmount(near);

  viewCall = async ({ contractId = KEYPOM_EVENTS_CONTRACT, methodName, args }) => {
    const res = await this.viewAccount.viewFunction({
      contractId,
      methodName,
      args,
    });
    return res;
  };

  getDerivedPrivKey = async ({ encryptedPk, pw, saltBase64, ivBase64 }) => {
    const symmetricKey = await deriveKeyFromPassword(pw, saltBase64);
    const decryptedPrivateKey = await decryptPrivateKey(encryptedPk, ivBase64, symmetricKey);
    return decryptedPrivateKey;
  };

  decryptMetadata = async ({ privKey, data }) => {
    const decryptedData = await decryptWithPrivateKey(data, privKey);
    return decryptedData;
  };

  getEventInfo = async ({
    accountId,
    eventId,
  }: {
    accountId: string;
    eventId: string;
  }): Promise<FunderEventMetadata | null> => {
    try {
      const funderInfo = await this.viewCall({
        methodName: 'get_funder_info',
        args: { account_id: accountId },
      });

      const funderMeta: Record<string, FunderEventMetadata> = JSON.parse(funderInfo.metadata);
      let eventInfo: FunderEventMetadata = funderMeta[eventId];

      if (eventInfo === undefined || eventInfo === null) {
        throw new Error(`Event ${String(eventId)} not exist`);
      }

      eventInfo.artwork = `${CLOUDFLARE_IPFS}/${eventInfo.artwork}`;

      return eventInfo;
    } catch (error) {
      console.warn('Error getting event info', error);
      return null;
    }
  };

  deleteConferenceDrop = async ({
    wallet,
    dropId,
  }: {
    wallet: Wallet;
    dropId: string;
  }) => {
    const accounts = await wallet.getAccounts();

    await wallet.signAndSendTransaction({
      signerId: accounts[0].accountId,
      receiverId: TOKEN_FACTORY_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'delete_drop',
            args: {
              drop_id: dropId,
            },
            gas: '300000000000000',
            deposit: '0',
          },
        },
      ],
    });
  };

  createConferenceDrop = async ({
    wallet,
    scavengerHunt,
    isScavengerHunt,
    createdDrop,
  }: {
    wallet: Wallet;
    isScavengerHunt: boolean;
    scavengerHunt: Array<{ piece: string; description: string }>;
    createdDrop: any;
  }) => {
    const accounts = await wallet.getAccounts();
    const pinnedDrop = {
      ...createdDrop,
      artwork: 'bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy',
    };

    let scavenger_hunt: Array<{ piece: string; description: string }> | undefined;
    if (isScavengerHunt) {
      scavenger_hunt = [];
      for (const { description } of scavengerHunt) {
        scavenger_hunt.push({
          description,
          piece: uuidv4(),
        });
      }
    }

    if (createdDrop.nftData) {
      let res = await wallet.signAndSendTransaction({
        signerId: accounts[0].accountId,
        receiverId: TOKEN_FACTORY_CONTRACT,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'create_nft_drop',
              args: {
                drop_data: {
                  image: pinnedDrop.artwork,
                  name: pinnedDrop.name,
                  scavenger_hunt,
                },
                nft_metadata: {
                  ...pinnedDrop.nftData,
                  media: 'bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy',
                },
              },
              gas: '300000000000000',
              deposit: '0',
            },
          },
        ],
      });
      let dropId = atob(res?.status.SuccessValue);
      if (dropId.startsWith('"') && dropId.endsWith('"')) {
        dropId = dropId.slice(1, -1);
      }
      return {dropId, completeScavengerHunt: scavenger_hunt};
    }

    let res = await wallet.signAndSendTransaction({
      signerId: accounts[0].accountId,
      receiverId: TOKEN_FACTORY_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_token_drop',
            args: {
              drop_data: {
                image: pinnedDrop.artwork,
                name: pinnedDrop.name,
                scavenger_hunt,
              },
              token_amount: this.nearToYocto(pinnedDrop.amount),
            },
            gas: '300000000000000',
            deposit: '0',
          },
        },
      ],
    });

    let dropId = atob(res?.status.SuccessValue);
    if (dropId.startsWith('"') && dropId.endsWith('"')) {
      dropId = dropId.slice(1, -1);
    }
    return {dropId, completeScavengerHunt: scavenger_hunt};
  };

  claimEventTokenDrop = async ({
    secretKey,
    dropId,
    scavId,
  }: {
    secretKey: string;
    dropId: string;
    scavId: string | null;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(networkId, TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(this.nearConnection.connection, TOKEN_FACTORY_CONTRACT);
    await userAccount.functionCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'claim_drop',
      args: {
        drop_id: dropId,
        scavenger_id: scavId,
      },
    });
  };

  sendConferenceTokens = async ({
    secretKey,
    sendTo,
    amount,
  }: {
    secretKey: string;
    sendTo: string;
    amount: string;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(networkId, TOKEN_FACTORY_CONTRACT, keyPair);
    const userAccount = new nearAPI.Account(this.nearConnection.connection, TOKEN_FACTORY_CONTRACT);
    await userAccount.functionCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'ft_transfer',
      args: {
        receiver_id: sendTo,
        amount,
      },
    });
  };

  // Method to fetch all drops with caching
  fetchDropsWithCache = async () => {
    if (this.dropCache.length > 0) {
      return this.dropCache;
    }

    const numDrops = await this.viewCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'get_num_drops',
      args: {},
    });
    console.log("Num drops: ", numDrops)

    let allDrops: ExtDropData[] = [];
    for (let i = 0; i < numDrops; i += 50) {
      const dropBatch = await this.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: 'get_drops',
        args: { from_index: i.toString(), limit: 50 },
      });
      console.log("Drop batch: ", dropBatch)
      allDrops = allDrops.concat(dropBatch);
    }

    this.dropCache = allDrops;
    console.log("ALL DROPS: ", allDrops)
    return allDrops;
  };

  // Filter cached drops for NFTs
  getCachedNFTDrops = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter((drop) => 'nft_metadata' in drop);
  };

  // Filter cached drops for Tokens
  getCachedTokenDrops = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter((drop) => 'amount' in drop);
  };

  // Filter cached drops for scavenger hunts
  getCachedScavengerHunts = async (): Promise<ExtDropData[]> => {
    if (this.dropCache.length === 0) {
      await this.fetchDropsWithCache();
    }
    return this.dropCache.filter((drop) => drop.scavenger_hunt && drop.scavenger_hunt.length > 0);
  };
}

const eventHelperInstance = EventJS.getInstance();

export default eventHelperInstance;
