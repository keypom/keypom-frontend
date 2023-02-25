// Matches with optional protocol and URL with one dot
export const urlRegex = /(?:(?:https?:\/\/)?[\w.-]*\.[\w]{2,3})/;

export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';

// NEAR wallet is deprecating soon
export const WALLET_OPTIONS = [
  {
    coin: 'MYNEAR',
    walletName: 'My Near',
    id: 'mynearwallet',
  },
  {
    coin: 'HERE',
    walletName: 'My HERE',
    id: 'herewallet',
  },
];

export const DROP_TYPE = {
  TOKEN: 'TOKEN',
  TICKET: 'TICKET',
  TRIAL: 'TRIAL',
  NFT: 'NFT',
  SIMPLE: 'SIMPLE',
};

export const MASTER_KEY = 'MASTER_KEY';

export const PAGE_SIZE_LIMIT = 10;
