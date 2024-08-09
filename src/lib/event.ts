import * as nearAPI from 'near-api-js';
import {
  CLOUDFLARE_IPFS,
  KEYPOM_EVENTS_CONTRACT,
  TOKEN_FACTORY_CONTRACT,
} from '@/constants/common';
import getConfig from '@/config/config';
import { CreatedDropForm } from '@/features/conference-dashboard/components/CreateDropModal';
import { FunderEventMetadata } from './eventsHelpers';
import { decryptPrivateKey, decryptWithPrivateKey, deriveKeyFromPassword } from './cryptoHelpers';

let instance: EventJS;
const networkId = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
const config = getConfig();

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
  );
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

    // Split at the decimal point
    const split = near.split('.');
    const integerPart = split[0];
    let decimalPart = split[1];

    // Take only the first 4 digits of the decimal part
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

  sendConferenceTokens = async ({
    secretKey,
    accountId,
    sendTo,
    amount,
    factoryAccount,
  }: {
    secretKey: string;
    accountId: string;
    sendTo: string;
    amount: string;
    factoryAccount: string;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(networkId, accountId, keyPair);
    const userAccount = new nearAPI.Account(this.nearConnection.connection, accountId);
    await userAccount.functionCall({
      contractId: factoryAccount,
      methodName: 'ft_transfer',
      args: {
        receiver_id: sendTo,
        amount,
      },
    });
  };

  getDerivedPrivKey = async ({ encryptedPk, pw, saltBase64, ivBase64 }) => {
    // Step 3: Derive a symmetric key from the password
    const symmetricKey = await deriveKeyFromPassword(pw, saltBase64);
    // Step 5: Decrypt the private key using the symmetric key
    const decryptedPrivateKey = await decryptPrivateKey(encryptedPk, ivBase64, symmetricKey);
    return decryptedPrivateKey;
  };

  decryptMetadata = async ({ privKey, data }) => {
    // Step 6: Decrypt the encrypted data using the decrypted private key
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
      /* eslint-disable no-console */
      console.warn('Error getting event info', error);
      return null;
    }
  };

  deleteConferenceDrop = async ({
    secretKey,
    accountId,
    dropId,
  }: {
    secretKey: string;
    accountId: string;
    dropId: string;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(networkId, accountId, keyPair);
    const userAccount = new nearAPI.Account(this.nearConnection.connection, accountId);

    return await userAccount.functionCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'delete_drop',
      args: {
        drop_id: dropId,
      },
    });
  };

  createConferenceDrop = async ({
    secretKey,
    scavengerHunt,
    isScavengerHunt,
    accountId,
    createdDrop,
  }: {
    secretKey: string;
    accountId: string;
    isScavengerHunt: boolean;
    scavengerHunt: Array<{ piece: string; description: string }>;
    createdDrop: CreatedDropForm;
  }) => {
    const keyPair = nearAPI.KeyPair.fromString(secretKey);
    await myKeyStore.setKey(networkId, accountId, keyPair);
    const userAccount = new nearAPI.Account(this.nearConnection.connection, accountId);

    // TODO: upload to IPFS
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
      let res = await userAccount.functionCall({
        contractId: TOKEN_FACTORY_CONTRACT,
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
      });
      // Parse the resulting base64 into a string
      let dropId = atob(res.status.SuccessValue);
      return dropId;
    }

    let res = await userAccount.functionCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'create_token_drop',
      args: {
        drop_data: {
          image: pinnedDrop.artwork,
          name: pinnedDrop.name,
          scavenger_hunt,
        },
        token_amount: this.nearToYocto(pinnedDrop.amount),
      },
    });

    // Parse the resulting base64 into a string
    let dropId = atob(res.status.SuccessValue);
    return dropId;
  };
}

const eventHelperInstance = EventJS.getInstance();

export default eventHelperInstance;
