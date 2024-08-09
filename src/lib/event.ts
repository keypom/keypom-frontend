import * as nearAPI from 'near-api-js';
import { KEYPOM_EVENTS_CONTRACT, TOKEN_FACTORY_CONTRACT } from '@/constants/common';
import getConfig from '@/config/config';
import { CreatedDropForm } from '@/features/conference-dashboard/components/CreateDropModal';

let instance: KeypomJS;
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
    const res = await this.viewAccount.viewFunctionV2({
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
    accountId,
    createdDrop,
  }: {
    secretKey: string;
    accountId: string;
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

    if (createdDrop.nftData) {
      return await userAccount.functionCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: 'create_nft_drop',
        args: {
          drop_data: {
            image: pinnedDrop.artwork,
            name: pinnedDrop.name,
          },
          nft_metadata: {
            ...pinnedDrop.nftData,
            media: 'bafybeibadywqnworqo5azj4rume54j5wuqgphljds7haxdf2kc45ytewpy',
          },
        },
      });
    }
    return await userAccount.functionCall({
      contractId: TOKEN_FACTORY_CONTRACT,
      methodName: 'create_token_drop',
      args: {
        drop_data: {
          image: pinnedDrop.artwork,
          name: pinnedDrop.name,
        },
        token_amount: this.nearToYocto(pinnedDrop.amount),
      },
    });
  };
}

const eventHelperInstance = EventJS.getInstance();

export default eventHelperInstance;
