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

export const PURCHASED_LOCAL_STORAGE_PREFIX = 'TICKETS_PURCHASED';

export const MASTER_KEY = 'MASTER_KEY';

export const MAX_FILE_SIZE = 10000000;

export const WORKER_BASE_URL = 'https://keypom-nft-storage.keypom.workers.dev/';
export const EVENTS_WORKER_IPFS_PINNING = 'https://stripe-worker-production.keypom.workers.dev/ipfs-pin';
export const EVENTS_WORKER_BASE = 'https://stripe-worker-production.keypom.workers.dev';
export const EMAIL_WORKER_BASE = 'https://email-worker.keypom.workers.dev';

export const PAGE_SIZE_LIMIT = 5;
export const NFT_ATTEMPT_KEY = 'NFT_ATTEMPT';
export const PAGE_QUERY_PARAM = 'page';
// export const KEYPOM_EVENTS_CONTRACT = '1714778045977-kp-ticketing.testnet';
// export const KEYPOM_MARKETPLACE_CONTRACT = '1714778045977-marketplace.testnet';
export const KEYPOM_EVENTS_CONTRACT = 'ticketing-v1.keypom.near';
export const KEYPOM_MARKETPLACE_CONTRACT = 'marketplace-v1.keypom.near';
export const KEYPOM_GLOBAL_SIGNING_KEYS = [
  "ed25519:3SoKRJxQj29Kczj6TiMNNxq3c6S3WcA4MUb6oBEcHMEDyhLWxzJyWxXn69sKt3RKCs8akb5KHkNvjdq4mJLYCYGA",
  "ed25519:36s6Po4JAJVhQdZLmXx8gJh4HP6T4AtMYJb5UgWhiYLntxpTX5piAc2pGExdUYrFJujYi18ZevU1z52CRkL6kpLF",
  "ed25519:3c4EMC5d2DEvXjHxQZN7ef7pj8FDK7B9y4QfuvossLSBwntPorYsqxbyuh4vAqTEr397Dgabxjz1RTe9p4CiKs8C",
  "ed25519:5bx66kw3oPfa3vNXe2hXKcN6M5jqMJyC5WHAx8hFzDG4j68QXu8E4wdkaY1H1SvUzbdkxGpyio5Gxmfx8SrBjrg3",
  "ed25519:5JiAyefRbZsy8Yc4gBMJRJpsTFekxYCtvnZgBJUtQzqmRhX6VVB8ZwAnYcy3rdzquN5WPSrw9fUuwhD612L5RqzA",
  "ed25519:oNpuBdJY4HSGZhi1oSEeUWxErdSTjzLmJdx5erMDrV9hzrGVE8peAjRb2QVY4aP81ctf96YpWe419Fr2wqrc7mG",
  "ed25519:nzf775uk2hBRoZXk41kXMqLRofKK2E5qGi3jUjfQnKZvq22f7qhkzCyhenxuRqQMac4tFgGcSsogmFCmimNWkq5",
  "ed25519:2DwsKo8ZwVotcTtTLLRwx6iHamgxG9qFHo6T5G6udMQMyLNxeqo2oy3Z7UFwFJc5ztdqGCc3b4SidJUDcAhkF7V8",
  "ed25519:3PjnkrRdAmWEfoKBkdSXXfGs6AWB6rTG5Sva9EEJBAnAKnkbNwk5VsXPx43zFmKJJhfHwzgFM76FVGqmZQjh6wWh",
  "ed25519:2nP3KsnqWb96k6HKNXHiyumtGH6pmoBLvVqUAbNBAQFMBzTjho3Nw7Yo5fwDMZFwgPeaEeYMcGCqkmX1eoL8Abw1"
]
// export const KEYPOM_EVENTS_CONTRACT = '1711377493739-kp-ticketing.testnet';
// export const KEYPOM_MARKETPLACE_CONTRACT = '1711377493739-marketplace.testnet';

export const MIN_NEAR_SELL = 0.1;
