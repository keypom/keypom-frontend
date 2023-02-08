import { getDropInformation, getEnv, initKeypom, updateKeypomContractId } from 'keypom-js';

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
  async getClaimDropType(contractId: string, secretKey: string) {
    const { networkId, supportedKeypomContracts } = getEnv();
    console.log(networkId, supportedKeypomContracts);

    if (
      supportedKeypomContracts === undefined ||
      networkId === undefined ||
      contractId === undefined
    ) {
      return;
    }

    if (supportedKeypomContracts[networkId][contractId] !== undefined) {
      await updateKeypomContractId({ keypomContractId: contractId });
      const drop = await getDropInformation({ secretKey });
      // check drop type
    }
  }
}

const keypomInstance = Object.freeze(new KeypomJS());

export default keypomInstance;
