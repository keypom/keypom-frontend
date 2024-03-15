// Matches with optional protocol and URL with one dot
export const urlRegex = /(?:(?:https?:\/\/)?[\w.-]*\.[\w]{2,3})/;

export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';

export const DROP_TYPE = {
  TOKEN: 'TOKEN',
  TICKET: 'TICKET',
  EVENT: 'EVENT',
  TRIAL: 'TRIAL',
  NFT: 'NFT',
  SIMPLE: 'SIMPLE',
  OTHER: 'OTHER',
} as const;

type DROP_TYPE_KEYS = keyof typeof DROP_TYPE;
export type DROP_TYPES = (typeof DROP_TYPE)[DROP_TYPE_KEYS];

export const MASTER_KEY = 'MASTER_KEY';

export const MAX_FILE_SIZE = 10000000;

export const PAGE_SIZE_LIMIT = 5;
export const NFT_ATTEMPT_KEY = 'NFT_ATTEMPT';
export const PAGE_QUERY_PARAM = 'page';
export const KEYPOM_EVENTS_CONTRACT = '1710464155760-kp-ticketing.testnet';
export const KEYPOM_MARKETPLACE_CONTRACT = '1710464155760-marketplace.testnet';
