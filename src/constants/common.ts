// Matches with optional protocol and URL with one dot
export const urlRegex = /(?:(?:https?:\/\/)?[\w.-]*\.[\w]{2,3})/;

export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';

export const WALLET_OPTIONS = [
  {
    coin: 'NEAR',
    walletName: 'NEAR',
    externalLink: 'https://wallet.near.org/create',
    id: 'wallet.near.org',
  },
  {
    coin: 'MYNEAR',
    walletName: 'My Near',
    externalLink: 'https://app.mynearwallet.com/create',
    id: 'mynearwallet',
  },
  {
    coin: 'HERE',
    walletName: 'My HERE',
    externalLink: 'https://herewallet.app/',
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
