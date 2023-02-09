import {
  getDropInformation,
  getEnv,
  initKeypom,
  type ProtocolReturnedDrop,
  updateKeypomContractId,
  getFTMetadata,
} from 'keypom-js';

import { DROP_TYPE } from '@/constants/common';

let instance: KeypomJS;

const config = {
  network: 'testnet',
};
class KeypomJS {
  constructor() {
    if (instance !== undefined) {
      throw new Error('New instance cannot be created!!');
    }
  }

  init() {
    initKeypom(config)
      .then(() => {
        console.log('KeypomJS initialized');
      })
      .catch((err) => {
        console.error('Failed to initialize KeypomJS', err);
      });
  }

  // valid contract id -> v1-3.keypom.testnet
  // getEnv check for contractid validity
  // updateKeypomContractId
  // getDropInformation
  // check drop type
  /*
    ft -> Tokens
    fc -> Ticket
    nft -> NFT
    simple -> simple drop?
  */
  async getLinkdropType(contractId: string, secretKey: string) {
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
    const drop = await getDropInformation({ secretKey });
    return this.getDropType(drop);
  }

  getDropType(drop: ProtocolReturnedDrop) {
    if (drop.ft != null) {
      return DROP_TYPE.TOKEN;
    }

    if (drop.fc != null) {
      return DROP_TYPE.TICKET;
    }

    if (drop.nft != null) {
      return DROP_TYPE.NFT;
    }

    if (drop.simple != null) {
      return DROP_TYPE.SIMPLE;
    }

    return null;
  }

  /*
  Drop:

  metadata -> drop name
*/
  async getTokenClaimInformation(contractId: string, secretKey: string) {
    const drop = await getDropInformation({ secretKey });
    const ftMetadata = await getFTMetadata({ contractId: drop.ft?.contract_id as string });

    return {
      dropName: drop.metadata,
      tokens: ftMetadata,
      amount: drop.deposit_per_use,
    };
  }
}

const keypomInstance = Object.freeze(new KeypomJS());

export default keypomInstance;
