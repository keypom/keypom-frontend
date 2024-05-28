import { type IToken, type IWalletOption } from '@/types/common';

export const contractName = process.env.REACT_APP_CONTRACT_ID ?? 'v2.keypom.testnet';
export const cloudflareIfps =
  process.env.REACT_APP_CLOUDFLARE_IFPS ?? 'https://cloudflare-ipfs.com/ipfs';
// eslint-disable-next-line no-console
console.log(
  'Network and Contract IDs: ',
  process.env.REACT_APP_NETWORK_ID,
  process.env.REACT_APP_CONTRACT_ID,
);

const SUPPORTED_WALLET_OPTIONS: IWalletOption[] = [
  // {
  //   name: 'mintbasewallet',
  //   title: 'Mintbase Wallet',
  // },
  {
    name: 'meteorwallet',
    title: 'Meteor Wallet',
  },
  {
    name: 'mynearwallet',
    title: 'My Near Wallet',
  },
];

const DEFAULT_WALLET = SUPPORTED_WALLET_OPTIONS[0];

// used in create drops
const DEFAULT_TOKEN: IToken = {
  amount: '',
  symbol: 'NEAR',
};

export interface Config {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  contractName: string;
  explorerUrl: string;
  GAS: string;
  gas: string;
  attachedDeposit: string;
  NEW_ACCOUNT_AMOUNT: string;
  NEW_CONTRACT_AMOUNT: string;
  contractId: string;
  isBrowser: boolean;
  cloudflareIfps: string;
  supportedWallets: IWalletOption[];
  defaultWallet: IWalletOption;
  defaultToken: IToken;
}

export function getExtendConfig(network = process.env.REACT_APP_NETWORK_ID ?? 'testnet') {
  switch (network) {
    case 'mainnet':
      return {
        RPC_LIST: {
          defaultRpc: {
            url: 'https://rpc.mainnet.near.org',
            simpleName: 'official rpc',
          },
          lavaRpc: {
            url: 'https://g.w.lavanet.xyz:443/gateway/near/rpc-http/f653c33afd2ea30614f69bc1c73d4940',
            simpleName: 'lava rpc',
          },
          betaRpc: {
            url: 'https://beta.rpc.mainnet.near.org',
            simpleName: 'official beta rpc',
          },
          fastnearRpc: {
            url: 'https://free.rpc.fastnear.com',
            simpleName: 'fastnear rpc',
          },
        },
      };
    case 'testnet':
      return {
        RPC_LIST: {
          defaultRpc: {
            url: 'https://rpc.testnet.near.org',
            simpleName: 'official rpc',
          },
          lavaRpc: {
            url: 'https://g.w.lavanet.xyz:443/gateway/neart/rpc-http/f653c33afd2ea30614f69bc1c73d4940',
            simpleName: 'lava rpc',
          },
        },
      };
    default:
      throw Error(`Unconfigured environment '${network}'. Can be configured in src/config.ts.`);
  }
}

function getConfig(network = process.env.REACT_APP_NETWORK_ID ?? 'testnet'): Config {
  const defaultConfig = {
    GAS: '200000000000000',
    gas: '200000000000000',
    attachedDeposit: '10000000000000000000000', // 0.01 N (1kb storage)
    NEW_ACCOUNT_AMOUNT: '1000000000000000000000000',
    NEW_CONTRACT_AMOUNT: '5000000000000000000000000',
    contractId: contractName,
    isBrowser: typeof window !== 'undefined',
    cloudflareIfps,
    supportedWallets: SUPPORTED_WALLET_OPTIONS,
    defaultWallet: DEFAULT_WALLET,
    defaultToken: DEFAULT_TOKEN,
  };

  const chosenEndpoint = localStorage.getItem('endPoint') || 'defaultRpc';
  const nodeUrl = getExtendConfig(network).RPC_LIST[chosenEndpoint].url;

  switch (network) {
    case 'testnet':
      return {
        ...defaultConfig,
        contractName,
        networkId: 'testnet',
        // nodeUrl: 'https://rpc.testnet.near.org',
        nodeUrl,
        walletUrl: 'https://testnet.mynearwallet.com',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };

    case 'mainnet':
      return {
        ...defaultConfig,
        contractName,
        networkId: 'mainnet',
        // nodeUrl: 'https://rpc.mainnet.near.org',
        nodeUrl,
        walletUrl: 'https://app.mynearwallet.com',
        helperUrl: 'https://helper.near.org',
        explorerUrl: 'https://explorer.near.org',
      };
    default:
      throw Error(`Unconfigured environment '${network}'. Can be configured in src/config.ts.`);
  }
}

export default getConfig;
