const contractName = process.env.REACT_APP_CONTRACT_ID ?? 'v2.keypom.testnet';
const cloudflareIfps = process.env.REACT_APP_CLOUDFLARE_IFPS ?? 'https://cloudflare-ipfs.com/ipfs';
// eslint-disable-next-line no-console
console.log(process.env.REACT_APP_NETWORK_ID, process.env.REACT_APP_CONTRACT_ID);

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
}

function getConfig(network = process.env.REACT_APP_NETWORK_ID ?? 'testnet'): Config {
  switch (network) {
    case 'testnet':
      return {
        contractName,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://testnet.mynearwallet.com',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        GAS: '200000000000000',
        gas: '200000000000000',
        attachedDeposit: '10000000000000000000000', // 0.01 N (1kb storage)
        NEW_ACCOUNT_AMOUNT: '1000000000000000000000000',
        NEW_CONTRACT_AMOUNT: '5000000000000000000000000',
        contractId: contractName,
        isBrowser: typeof window !== 'undefined',
        cloudflareIfps,
      };

    case 'mainnet':
      return {
        contractName,
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://app.mynearwallet.com',
        helperUrl: 'https://helper.near.org',
        explorerUrl: 'https://explorer.near.org',
        GAS: '200000000000000',
        gas: '200000000000000',
        attachedDeposit: '10000000000000000000000', // 0.01 N (1kb storage)
        NEW_ACCOUNT_AMOUNT: '1000000000000000000000000',
        NEW_CONTRACT_AMOUNT: '5000000000000000000000000',
        contractId: contractName,
        isBrowser: typeof window !== 'undefined',
        cloudflareIfps,
      };
    default:
      throw Error(`Unconfigured environment '${network}'. Can be configured in src/config.ts.`);
  }
}

export default getConfig;
