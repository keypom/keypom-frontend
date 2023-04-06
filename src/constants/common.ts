// Matches with optional protocol and URL with one dot
export const urlRegex = /(?:(?:https?:\/\/)?[\w.-]*\.[\w]{2,3})/;

export const CLOUDFLARE_IPFS = 'https://cloudflare-ipfs.com/ipfs';

export const DROP_TYPE = {
  TOKEN: 'TOKEN',
  TICKET: 'TICKET',
  TRIAL: 'TRIAL',
  NFT: 'NFT',
  SIMPLE: 'SIMPLE',
  OTHER: 'OTHER',
} as const;

type DROP_TYPE_KEYS = keyof typeof DROP_TYPE;
export type DROP_TYPES = (typeof DROP_TYPE)[DROP_TYPE_KEYS];

export const MASTER_KEY = 'MASTER_KEY';

export const PAGE_SIZE_LIMIT = 10;

export const PAGE_QUERY_PARAM = 'page';

export const PENDING_TICKET_PURCHASE = 'PENDING_TICKET_PURCHASE';
