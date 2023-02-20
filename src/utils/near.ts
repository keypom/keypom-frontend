import { BrowserLocalStorageKeyStore, InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import { Account, Near } from 'near-api-js';

import getConfig from '@/config/config';

const { nodeUrl, walletUrl, networkId, contractId, isBrowser } = getConfig();

let credentials, keyStore;

if (isBrowser) {
  keyStore = new BrowserLocalStorageKeyStore();
} else {
  /// nodejs (for tests)
  // try {
  //   // eslint-disable-next-line no-console
  //   console.log(
  //     `Loading Credentials: ${process.env.HOME}/.near-credentials/${networkId}/${contractId}.json`,
  //   );
  //   credentials = JSON.parse(
  //     fs
  //       .readFileSync(`${process.env.HOME}/.near-credentials/${networkId}/${contractId}.json`)
  //       .toString(),
  //   );
  // } catch (e) {
  //   // eslint-disable-next-line no-console
  //   console.warn(`Loading Credentials: ./neardev/${networkId}/${contractId}.json`);
  //   credentials = JSON.parse(
  //     fs.readFileSync(`./neardev/${networkId}/${contractId}.json`).toString(),
  //   );
  // }

  keyStore = new InMemoryKeyStore();
  keyStore.setKey(networkId, contractId);
}

const near = new Near({
  networkId,
  nodeUrl,
  walletUrl,
});
const { connection } = near;
const contractAccount = new Account(connection, contractId);

const nearConfig = {
  near,
  walletUrl,
  networkId,
  accountSuffix: networkId === 'mainnet' ? '.near' : '.testnet',
  credentials,
  keyStore,
  connection,
  contractId,
  contractAccount,
};

export default nearConfig;
