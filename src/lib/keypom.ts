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
} from 'keypom-js';

import { CLOUDFLARE_IPFS, DROP_TYPE } from '@/constants/common';

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

  async verifyDrop(contractId: string, secretKey: string) {
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
  }

  async checkTicketRemainingUses(contractId: string, secretKey: string) {
    await this.verifyDrop(contractId, secretKey);

    const keyInfo = await getKeyInformation({ secretKey });

    if (keyInfo === null || keyInfo === undefined) {
      throw new Error('Ticket has been deleted or has already been claimed');
    }

    return keyInfo.remaining_uses;
  }

  async claimTicket(secretKey: string, password: string) {
    let keyInfo = await getKeyInformation({ secretKey });
    const publicKey: string = await getPubFromSecret(secretKey);
    console.log({ password });
    const passwordForClaim = await hashPassword(
      password + publicKey + keyInfo.cur_key_use.toString(),
    );
    await claim({ secretKey, password: passwordForClaim, accountId: 'foo' });

    keyInfo = await getKeyInformation({ secretKey });
    if (keyInfo.remaining_uses === 2) {
      throw new Error('Password is incorrect. Please try again.');
    }
  }

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
  async getLinkdropType(contractId: string, secretKey: string) {
    await this.verifyDrop(contractId, secretKey);
    const drop = await getDropInformation({ secretKey });

    return this.getDropType(drop);
  }

  getDropType(drop: ProtocolReturnedDrop) {
    if (drop.fc === undefined && drop.nft === undefined) {
      return DROP_TYPE.TOKEN;
    }

    if (drop.fc !== undefined) {
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

      return null;
    }

    return null;
  }

  getDropMetadata(metadata: string) {
    try {
      return JSON.parse(metadata);
    } catch (err) {
      return {
        title: metadata,
      };
    }
  }

  async getTokenClaimInformation(secretKey: string) {
    const drop = await getDropInformation({ secretKey });
    const dropMetadata = drop.metadata !== undefined ? this.getDropMetadata(drop.metadata) : {};
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
  }

  async getNFTClaimInformation(secretKey: string) {
    // given fc
    const drop = await getDropInformation({ secretKey });
    const dropMetadata = drop.metadata !== undefined ? this.getDropMetadata(drop.metadata) : {};

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
    const { receiver_id: contractId } = fcMethod;
    const { viewCall } = getEnv();
    const nftData = await viewCall({
      contractId,
      methodName: 'get_series_info',
      args: { mint_id: parseInt(drop.drop_id) },
    });

    return {
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
      title: nftData.metadata.title,
      description: nftData.metadata.description,
    };
  }

  async getTicketNftInformation(contractId: string, secretKey: string) {
    const remainingUses = await this.checkTicketRemainingUses(contractId, secretKey);

    if (remainingUses < 2) {
      throw new Error('This drop has been claimed.');
    }

    const drop = await getDropInformation({ secretKey });
    const dropMetadata = drop.metadata !== undefined ? this.getDropMetadata(drop.metadata) : {};

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
    const nftData = await viewCall({
      contractId: receiverId,
      methodName: 'get_series_info',
      args: { mint_id: parseFloat(drop.drop_id) },
    });

    return {
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
      title: nftData.metadata.title,
      description: nftData.metadata.description,
    };
  }

  async claim(secretKey: string, walletAddress?: string) {
    await claim({ secretKey, accountId: walletAddress });
  }
}

const keypomInstance = Object.freeze(new KeypomJS());

export default keypomInstance;
