import {
  getDropInformation,
  getEnv,
  initKeypom,
  type ProtocolReturnedDrop,
  updateKeypomContractId,
  getFTMetadata,
  claim,
  getKeyInformation,
  getPubFromSecret,
  formatNearAmount,
  formatLinkdropUrl,
  generateKeys,
  getKeyInformationBatch,
  getKeySupplyForDrop,
  deleteKeys,
  getKeysForDrop,
  deleteDrops,
  getDropSupplyForOwner,
  getDrops,
  type ProtocolReturnedKeyInfo,
} from 'keypom-js';
import * as nearAPI from 'near-api-js';
import { type Wallet } from '@near-wallet-selector/core';
import * as bs58 from 'bs58';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

import { truncateAddress } from '@/utils/truncateAddress';
import {
  CLOUDFLARE_IPFS,
  DROP_TYPE,
  KEYPOM_EVENTS_CONTRACT,
  KEYPOM_MARKETPLACE_CONTRACT,
  MASTER_KEY,
} from '@/constants/common';
import getConfig from '@/config/config';
import { get } from '@/utils/localStorage';

import {
  type FunderEventMetadata,
  type FunderMetadata,
  isValidTicketNFTMetadata,
  type TicketMetadataExtra,
  type EventDrop,
} from './eventsHelpers';
import { decryptPrivateKey, decryptWithPrivateKey, deriveKeyFromPassword } from './cryptoHelpers';

let instance: KeypomJS;
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const networkId = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
const config = getConfig();

const connectionConfig = {
  networkId,
  keyStore: myKeyStore,
  nodeUrl: config.nodeUrl,
  walletUrl: config.walletUrl,
  helperUrl: config.helperUrl,
  explorerUrl: config.explorerUrl,
};

export interface DropKeyItem {
  id: number;
  publicKey: string;
  link: string;
  slug: string;
  hasClaimed: boolean;
  keyInfo: ProtocolReturnedKeyInfo | undefined;
}

export interface AttendeeKeyItem {
  drop_id: string;
  pub_key: string;
  owner_id: string;
  metadata: string;
  uses_remaining: number;
  message_nonce: number;
}

export interface MarketListingTicketData {
  max_tickets: number;
  price: number;
}

export interface MarketListing {
  event_id: string;
  funder_id: string;
  status: string;
  ticket_info: MarketListingTicketData[];
}

const KEY_ITEMS_PER_QUERY = 30;
const DROP_ITEMS_PER_QUERY = 5;
const MARKETPLACE_ITEMS_PER_QUERY = 50;
class KeypomJS {
  static instance: KeypomJS;
  nearConnection: nearAPI.Near;
  viewAccount: nearAPI.Account;

  allEventsGallery: MarketListing[];

  // Map the event ID to a set of drop IDs
  ticketDropsByEventId: Record<string, EventDrop[]> = {};
  // Maps the event ID to its metadata
  eventInfoById: Record<string, FunderEventMetadata> = {};
  // Map a drop ID to a set of keys
  purchasedTicketsById: Record<
    string,
    {
      totalKeys: number;
      dropInfo: EventDrop;
      dropKeyItems: AttendeeKeyItem[];
    }
  > = {};

  // Drops
  totalDrops: number;
  dropStore: Record<string, ProtocolReturnedDrop[]> = {};
  keyStore: Record<
    string,
    {
      dropName: string;
      totalKeys: number;
      dropKeyItems: DropKeyItem[];
    }
  > = {};

  constructor() {
    if (instance !== undefined) {
      throw new Error('New instance cannot be created!!');
    }

    this.init();
  }

  async init() {
    await initKeypom({ network: networkId });
    this.nearConnection = await nearAPI.connect(connectionConfig);
    this.viewAccount = await this.nearConnection.account(config.contractId);
  }

  public static getInstance(): KeypomJS {
    if (
      KeypomJS.instance == null ||
      KeypomJS.instance === undefined ||
      !(KeypomJS.instance instanceof KeypomJS) ||
      this.instance === undefined
    ) {
      KeypomJS.instance = new KeypomJS();
    }

    return KeypomJS.instance;
  }

  yoctoToNear = (yocto: string) => nearAPI.utils.format.formatNearAmount(yocto, 4);

  nearToYocto = (near: string) => nearAPI.utils.format.parseNearAmount(near);

  viewCall = async ({ contractId = KEYPOM_EVENTS_CONTRACT, methodName, args }) => {
    const res = await this.viewAccount.viewFunctionV2({
      contractId,
      methodName,
      args,
    });
    return res;
  };

  getResalesForEvent = async ({ eventId }) => {
    return await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_MARKETPLACE_CONTRACT,
      methodName: 'get_resales_per_event',
      args: { event_id: eventId },
    });
  };

  GetGlobalKey = async () => {
    return await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_global_secret_key',
      args: {},
    });
  };

  ListUnownedTickets = async ({ msg }) => {
    // const publicKey = JSON.parse(msg).linkdrop_pk;
    const keypomGlobalSecretKey = await this.GetGlobalKey();
    const keypomKeypair = nearAPI.KeyPair.fromString(keypomGlobalSecretKey);
    myKeyStore.setKey(networkId, KEYPOM_EVENTS_CONTRACT, keypomKeypair);
    const keypomAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_EVENTS_CONTRACT,
    );
    await keypomAccount.functionCall({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'nft_approve',
      args: {
        account_id: KEYPOM_MARKETPLACE_CONTRACT,
        msg,
      },
      gas: '300000000000000',
    });
  };

  GenerateResellSignature = async (keypair) => {
    const sk_bytes = bs58.decode(keypair.secretKey);

    const signing_message = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_signing_message',
      args: {},
    });
    const key_info = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_key_information',
      args: {
        key: keypair.publicKey.toString(),
      },
    });
    const message_nonce = key_info.message_nonce;

    const message = `${String(signing_message)}${String(message_nonce.toString())}`;
    const message_bytes = new TextEncoder().encode(`${message}`);

    const signature = nacl.sign.detached(message_bytes, sk_bytes);
    const base64_signature = naclUtil.encodeBase64(signature);

    return [base64_signature, signature];
  };

  GenerateTicketKeys = async (numKeys) => {
    const { publicKeys, secretKeys } = await generateKeys({
      numKeys,
      // rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
      // autoMetaNonceStart: start,
    });

    return { publicKeys, secretKeys };
  };

  GetMarketListings = async ({ start, limit }: { start: number; limit: number }) => {
    try {
      const totalSupply = await this.getEventSupply();
      if (limit <= 0) {
        limit = totalSupply;
      }
      if (this.allEventsGallery === undefined || this.allEventsGallery.length !== totalSupply) {
        this.allEventsGallery = new Array(totalSupply).fill(null);
      }

      // Calculate the end index for the requested market listings
      const endIndex = Math.min(start + limit, this.allEventsGallery.length);

      // Fetch and cache only the needed batches
      for (let i = start; i < totalSupply; i += MARKETPLACE_ITEMS_PER_QUERY) {
        const batchStart = i;
        const batchEnd = Math.min(i + MARKETPLACE_ITEMS_PER_QUERY, endIndex);
        if (this.allEventsGallery.slice(batchStart, batchEnd).some((item) => item === null)) {
          // If any item in the range is null, fetch the batch
          const answer: MarketListing[] = await this.viewAccount.viewFunctionV2({
            contractId: KEYPOM_MARKETPLACE_CONTRACT,
            methodName: 'get_events',
            args: { from_index: batchStart, limit: batchEnd - batchStart },
          });
          // add answers to cache
          for (let j = 0; j < answer.length; j++) {
            this.allEventsGallery[batchStart + j] = answer[j];
          }
        }
      }

      // Return the requested slice from the cache
      return this.allEventsGallery.slice(start, endIndex);
    } catch (error) {
      throw new Error('Failed to get all market listings due to error: ' + String(error));
    }
  };

  // GetMarketListings = async ({ contractId = KEYPOM_MARKETPLACE_CONTRACT, limit, from_index }) => {
  //   if (limit > 50) {
  //     limit = 50;
  //   }
  //   if (
  //     this.allEventsGallery == null ||
  //     this.allEventsGallery === undefined ||
  //     this.allEventsGallery.length === 0
  //   ) {
  //     const supply = await this.getEventSupply();
  //     // initialize to length supply
  //     this.allEventsGallery = new Array(supply).fill(null);
  //   }

  //   const cached = this.allEventsGallery.slice(from_index, parseInt(from_index) + parseInt(limit));

  //   const hasNoNulls = cached.every((item) => item !== null);
  //   const hasNoUndefineds = cached.every((item) => item !== undefined);

  //   if (hasNoNulls && hasNoUndefineds) {
  //     // just return from cache
  //     return cached;
  //   }

  //   const answer: MarketListing[] = await this.viewAccount.viewFunctionV2({
  //     contractId,
  //     methodName: 'get_events',
  //     args: { limit, from_index },
  //   });

  //   this.allEventsGallery.splice(from_index, limit, ...answer);

  //   return answer;
  // };

  validateAccountId = async (accountId: string) => {
    if (!(accountId.length >= 2 && accountId.length <= 64 && ACCOUNT_ID_REGEX.test(accountId))) {
      throw new Error('Account Id is invalid');
    }

    try {
      const account = await this.nearConnection.account(accountId);
      await account.state();
    } catch (err) {
      throw new Error('Account Id does not exist');
    }
    return true;
  };

  verifyDrop = async (contractId: string, secretKey?: string) => {
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

    updateKeypomContractId({ keypomContractId: contractId });
  };

  getCurrentKeyUse = async (contractId: string, secretKey: string) => {
    await this.verifyDrop(contractId, secretKey);

    const keyInfo = await getKeyInformation({ secretKey });

    if (keyInfo === null || keyInfo === undefined) {
      throw new Error('Drop has been deleted or has already been claimed');
    }

    return keyInfo.cur_key_use;
  };

  getCurrentKeyOwner = async (contractId: string, publicKey: string) => {
    const keyInfo = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_key_information',
      args: { key: publicKey },
    });
    console.log('keyinfo: ', keyInfo);

    if (keyInfo === null || keyInfo === undefined) {
      throw new Error('Key does not exist');
    }

    return keyInfo.owner_id;
  };

  checkIfDropExists = async (secretKey: string) => {
    try {
      await this.getDropInfo({ secretKey });
      return true;
    } catch (err) {
      return false;
    }
  };

  onEventTicketScanned = async (secretKey: string) => {
    const pubKey = getPubFromSecret(secretKey);

    const keypomGlobalSecretKey = await this.GetGlobalKey();
    const keypomKeypair = nearAPI.KeyPair.fromString(keypomGlobalSecretKey);
    await myKeyStore.setKey(networkId, KEYPOM_EVENTS_CONTRACT, keypomKeypair);
    const keypomAccount = new nearAPI.Account(
      this.nearConnection.connection,
      KEYPOM_EVENTS_CONTRACT,
    );

    const sk_bytes = bs58.decode(secretKey);
    const signingMessage = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_signing_message',
      args: {},
    });
    const keyInfo = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_key_information',
      args: {
        key: pubKey,
      },
    });
    const message_nonce = keyInfo.message_nonce;
    const message = `${String(signingMessage)}${String(message_nonce.toString())}`;
    const message_bytes = new TextEncoder().encode(`${message}`);
    const signature = nacl.sign.detached(message_bytes, sk_bytes);
    const base64Signature = naclUtil.encodeBase64(signature);
    const gasToAttach = keyInfo.required_gas;

    await keypomAccount.functionCall({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'claim',
      args: {
        account_id: KEYPOM_EVENTS_CONTRACT,
        signature: base64Signature,
        linkdrop_pk: pubKey,
      },
      gas: gasToAttach,
    });
  };

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
  getLinkdropType = async (drop: ProtocolReturnedDrop, contractId: string, secretKey: string) => {
    await this.verifyDrop(contractId, secretKey);
    return this.getDropType(drop);
  };

  getDropType = (drop: ProtocolReturnedDrop) => {
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
        drop.fc.methods[0] !== null &&
        drop.fc.methods[0][0].method_name === 'nft_mint'
      ) {
        return DROP_TYPE.NFT;
      }
    }

    return DROP_TYPE.OTHER;
  };

  // Utility function to fetch drops for a specific page index
  async fetchDropsPage(accountId, pageIndex) {
    return await getDrops({
      accountId,
      start: pageIndex * DROP_ITEMS_PER_QUERY,
      limit: DROP_ITEMS_PER_QUERY,
      withKeys: false,
    });
  }

  // Main function to get drops, with caching logic for paginated values
  getAllDrops = async ({ accountId }: { accountId: string }) => {
    try {
      // If totalDrops is not known, fetch it
      if (!this.totalDrops) {
        this.totalDrops = await getDropSupplyForOwner({ accountId });
      }

      // Initialize the cache for this account if it doesn't exist
      if (this.dropStore[accountId] == null || this.dropStore[accountId] === undefined) {
        this.dropStore[accountId] = [];
      }

      if (this.dropStore[accountId].length >= this.totalDrops) {
        return this.dropStore[accountId];
      }

      const totalQueries = Math.ceil(this.totalDrops / DROP_ITEMS_PER_QUERY);
      const pageIndices = Array.from({ length: totalQueries }, (_, index) => index);

      const allPagesDrops = await Promise.all(
        pageIndices.map(
          async (pageIndex) =>
            await getDrops({
              accountId,
              start: pageIndex * DROP_ITEMS_PER_QUERY,
              limit: DROP_ITEMS_PER_QUERY,
              withKeys: false,
            }),
        ),
      );
      this.dropStore[accountId] = allPagesDrops.flat();

      return this.dropStore[accountId];
    } catch (error) {
      throw new Error('Failed to fetch drops.');
    }
  };

  getKeySupplyForTicket = async (dropId: string) => {
    return await this.viewCall({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_key_supply_for_drop',
      args: { drop_id: dropId },
    });
  };

  getEventSupply = async () => {
    return await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_MARKETPLACE_CONTRACT,
      methodName: 'get_event_supply',
      args: {},
    });
  };

  getStripeAccountId = async (accountId: string) => {
    return await this.viewCall({
      contractId: KEYPOM_MARKETPLACE_CONTRACT,
      methodName: 'get_stripe_id_for_account',
      args: { account_id: accountId },
    });
  };

  getStripeEnabledEvents = async () => {
    return await this.viewCall({
      contractId: KEYPOM_MARKETPLACE_CONTRACT,
      methodName: 'get_stripe_enabled_events',
      args: {},
    });
  };

  getEventStripeStatus = async (eventId: string) => {
    const res = await this.viewCall({
      contractId: KEYPOM_MARKETPLACE_CONTRACT,
      methodName: 'event_stripe_status',
      args: { event_id: eventId },
    });
    console.log('res', res);
    return res;
  };

  deleteEventFromFunderMetadata = async ({
    wallet,
    eventId,
    accountId,
  }: {
    wallet: Wallet;
    eventId: string;
    accountId: string;
  }) => {
    const funderInfo = await this.viewCall({
      methodName: 'get_funder_info',
      args: { account_id: accountId },
    });
    const meta: FunderMetadata = JSON.parse(funderInfo.metadata);
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete meta[eventId];

    await wallet.signAndSendTransaction({
      signerId: accountId,
      receiverId: KEYPOM_EVENTS_CONTRACT,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'set_funder_metadata',
            args: { metadata: JSON.stringify(meta) },
            gas: '300000000000000',
            deposit: '0',
          },
        },
      ],
    });
  };

  deleteEventFromCache = ({ eventId }: { eventId: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.eventInfoById[eventId];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.ticketDropsByEventId[eventId];
  };

  deleteTicketFromCache = ({ dropId }: { dropId: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.purchasedTicketsById[dropId];
  };

  getEventInfo = async ({
    accountId,
    eventId,
  }: {
    accountId: string;
    eventId: string;
  }): Promise<FunderEventMetadata | null> => {
    try {
      const funderInfo = await this.viewCall({
        methodName: 'get_funder_info',
        args: { account_id: accountId },
      });

      const funderMeta: Record<string, FunderEventMetadata> = JSON.parse(funderInfo.metadata);
      const eventInfo: FunderEventMetadata = funderMeta[eventId];

      if (eventInfo === undefined || eventInfo === null) {
        throw new Error(`Event ${String(eventId)} not exist`);
      }

      eventInfo.artwork = `${CLOUDFLARE_IPFS}/${eventInfo.artwork}`;

      return eventInfo;
    } catch (error) {
      /* eslint-disable no-console */
      console.warn('Error getting event info', error);
      return null;
    }
  };

  groupDropsByEvent = (drops: EventDrop[]) => {
    for (const eventDrop of drops) {
      const metadata: TicketMetadataExtra = JSON.parse(
        eventDrop.drop_config.nft_keys_config.token_metadata.extra,
      );

      if (!Object.hasOwn(this.ticketDropsByEventId, metadata.eventId)) {
        this.ticketDropsByEventId[metadata.eventId] = [];
      }
      this.ticketDropsByEventId[metadata.eventId].push(eventDrop);
    }
  };

  groupAllDropsForAccount = async ({ accountId }: { accountId: string }) => {
    const numDrops = await this.viewCall({
      methodName: 'get_drop_supply_for_funder',
      args: { account_id: accountId },
    });
    const totalQueries = Math.ceil(numDrops / DROP_ITEMS_PER_QUERY);
    const pageIndices = Array.from({ length: totalQueries }, (_, index) => index);

    const allPagesDrops = await Promise.all(
      pageIndices.map(
        async (pageIndex) =>
          await this.viewCall({
            contractId: KEYPOM_EVENTS_CONTRACT,
            methodName: 'get_drops_for_funder',
            args: {
              account_id: accountId,
              from_index: (pageIndex * DROP_ITEMS_PER_QUERY).toString(),
              limit: DROP_ITEMS_PER_QUERY,
            },
          }),
      ),
    );

    let allDrops: EventDrop[] = allPagesDrops.flat(); // Assuming allPagesDrops is already defined and flattened.
    allDrops = allDrops.filter((drop) => {
      if (
        !drop.drop_id ||
        !drop.funder_id ||
        !drop.drop_config ||
        !drop.drop_config.nft_keys_config
      ) {
        return false; // Drop does not have the required top-level structure
      }

      return isValidTicketNFTMetadata(drop.drop_config.nft_keys_config.token_metadata);
    });

    // Add cloudflare IPFS prefix to media
    allDrops = allDrops.map((drop) => {
      return {
        ...drop,
        drop_config: {
          ...drop.drop_config,
          nft_keys_config: {
            ...drop.drop_config.nft_keys_config,
            token_metadata: {
              ...drop.drop_config.nft_keys_config.token_metadata,
              media: `${CLOUDFLARE_IPFS}/${drop.drop_config.nft_keys_config.token_metadata.media}`,
            },
          },
        },
      };
    });

    this.groupDropsByEvent(allDrops);
  };

  getTicketsForEventId = async ({ accountId, eventId }: { accountId: string; eventId: string }) => {
    if (!Object.hasOwn(this.ticketDropsByEventId, eventId)) {
      await this.groupAllDropsForAccount({ accountId });
    }

    if (
      this.ticketDropsByEventId[eventId] != null &&
      this.ticketDropsByEventId[eventId] !== undefined
    ) {
      return this.ticketDropsByEventId[eventId];
    }

    return [];
  };

  getEventsForAccount = async ({ accountId }: { accountId: string }) => {
    try {
      const funderInfo = await this.viewCall({
        methodName: 'get_funder_info',
        args: { account_id: accountId },
      });
      const funderMeta: FunderMetadata = JSON.parse(funderInfo.metadata);

      const events: FunderEventMetadata[] = [];
      for (const eventId in funderMeta) {
        const eventInfo: FunderEventMetadata = funderMeta[eventId];
        eventInfo.artwork = `${CLOUDFLARE_IPFS}/${eventInfo.artwork}`;

        events.push(eventInfo);
        this.eventInfoById[eventId] = eventInfo;
      }

      return events;
    } catch (error) {
      throw new Error('Failed to fetch drops.');
    }
  };

  getDerivedPrivKey = async ({ encryptedPk, pw, saltBase64, ivBase64 }) => {
    // Step 3: Derive a symmetric key from the password
    const symmetricKey = await deriveKeyFromPassword(pw, saltBase64);
    // Step 5: Decrypt the private key using the symmetric key
    const decryptedPrivateKey = await decryptPrivateKey(encryptedPk, ivBase64, symmetricKey);
    return decryptedPrivateKey;
  };

  decryptMetadata = async ({ privKey, data }) => {
    // Step 6: Decrypt the encrypted data using the decrypted private key
    const decryptedData = await decryptWithPrivateKey(data, privKey);
    return decryptedData;
  };

  getAllKeysForTicket = async ({ dropId }) => {
    try {
      const dropInfo = await this.viewCall({
        methodName: 'get_drop_information',
        args: { drop_id: dropId },
      });
      const totalKeys = dropInfo.next_key_id;
      if (
        !Object.hasOwn(this.purchasedTicketsById, dropId) ||
        this.purchasedTicketsById[dropId]?.totalKeys !== totalKeys
      ) {
        // Initialize the cache for this drop
        this.purchasedTicketsById[dropId] = {
          dropKeyItems: new Array(totalKeys).fill(null),
          dropInfo,
          totalKeys,
        };

        // Define how many batches are needed based on KEY_ITEMS_PER_QUERY
        const totalBatches = Math.ceil(totalKeys / KEY_ITEMS_PER_QUERY);
        const batchPromises: Array<Promise<AttendeeKeyItem[]>> = [];

        for (let i = 0; i < totalBatches; i++) {
          const start = i * KEY_ITEMS_PER_QUERY;
          const limit = Math.min(KEY_ITEMS_PER_QUERY, totalKeys - start);

          batchPromises.push(
            this.viewCall({
              methodName: 'get_keys_for_drop',
              args: { drop_id: dropId, from_index: start.toString(), limit },
            }),
          );
        }

        // Wait for all batches to resolve and process the results
        const batchResults = await Promise.all(batchPromises);
        this.purchasedTicketsById[dropId].dropKeyItems = batchResults.flat(); // Use .flat()
      }

      return this.purchasedTicketsById[dropId];
    } catch (error) {
      throw new Error('Failed to get keys info.');
    }
  };

  getTicketKeyInformation = async ({ publicKey }: { publicKey: string }) => {
    const fetchedinfo = await this.viewAccount.viewFunctionV2({
      contractId: KEYPOM_EVENTS_CONTRACT,
      methodName: 'get_key_information',
      args: {
        key: publicKey,
      },
    });
    return fetchedinfo;
  };

  getTicketDropInformation = async ({ dropId }: { dropId: string }) => {
    try {
      const fetchedinfo = await this.viewCall({
        methodName: 'get_drop_information',
        args: {
          drop_id: dropId,
        },
      });

      // Return the requested slice from the cache
      return fetchedinfo;
    } catch (e) {
      throw new Error('Failed to get key info.');
    }
  };

  getPaginatedKeysForTicket = async ({
    dropId,
    start,
    limit,
  }: {
    dropId: string;
    start: number;
    limit: number;
  }) => {
    try {
      // Initialize or update the cache for this drop if it doesn't exist or if total keys have changed
      const dropInfo = await this.viewCall({
        methodName: 'get_drop_information',
        args: { drop_id: dropId },
      });
      const totalKeys = dropInfo.next_key_id;

      if (
        !Object.hasOwn(this.purchasedTicketsById, dropId) ||
        this.purchasedTicketsById[dropId]?.totalKeys !== totalKeys
      ) {
        this.purchasedTicketsById[dropId] = {
          dropInfo,
          dropKeyItems: new Array(totalKeys).fill(null),
          totalKeys,
        };
      }

      // Calculate the end index for the requested keys
      const endIndex = Math.min(start + limit, this.purchasedTicketsById[dropId].totalKeys);

      // Fetch and cache only the needed batches
      for (let i = start; i < endIndex; i += KEY_ITEMS_PER_QUERY) {
        const batchStart = i;
        const batchEnd = Math.min(i + KEY_ITEMS_PER_QUERY, endIndex);
        if (
          this.purchasedTicketsById[dropId].dropKeyItems
            .slice(batchStart, batchEnd)
            .some((item) => item === null)
        ) {
          // If any item in the range is null, fetch the batch
          const fetchedKeys = await this.viewCall({
            methodName: 'get_keys_for_drop',
            args: {
              drop_id: dropId,
              from_index: batchStart.toString(),
              limit: batchEnd - batchStart,
            },
          });
          // Assume fetchedKeys is an array of keys; adjust based on actual structure
          for (let j = 0; j < fetchedKeys.length; j++) {
            this.purchasedTicketsById[dropId].dropKeyItems[batchStart + j] = fetchedKeys[j];
          }
        }
      }

      // Return the requested slice from the cache
      return this.purchasedTicketsById[dropId].dropKeyItems.slice(start, endIndex);
    } catch (e) {
      throw new Error('Failed to get paginated keys info.');
    }
  };

  // Main function to get drops, with caching logic for paginated values
  getPaginatedDrops = async ({
    accountId,
    start,
    limit,
  }: {
    accountId: string;
    start: number;
    limit: number;
  }) => {
    try {
      // If totalDrops is not known, fetch it
      if (!this.totalDrops) {
        this.totalDrops = await getDropSupplyForOwner({ accountId });
      }

      // Initialize the cache for this account if it doesn't exist
      if (this.dropStore[accountId] == null || this.dropStore[accountId] === undefined) {
        this.dropStore[accountId] = [];
      }

      // Calculate the end index and the page index for start and end
      const endIndex = start + limit;
      const startPageIndex = Math.floor(start / DROP_ITEMS_PER_QUERY);
      const endPageIndex = Math.ceil(endIndex / DROP_ITEMS_PER_QUERY);

      // Fetch and cache pages as needed
      for (let pageIndex = startPageIndex; pageIndex < endPageIndex; pageIndex++) {
        const pageStart = pageIndex * DROP_ITEMS_PER_QUERY;

        // Only fetch if this page hasn't been cached yet
        if (
          this.dropStore[accountId][pageStart] == null ||
          this.dropStore[accountId][pageStart] === undefined
        ) {
          const pageDrops = await this.fetchDropsPage(accountId, pageIndex);

          // Cache each item from the page with its index as the key
          pageDrops.forEach((drop, index) => {
            this.dropStore[accountId][pageStart + index] = drop;
          });
        }
      }

      // Return the requested slice from the cache
      return this.dropStore[accountId].slice(start, endIndex);
    } catch (error) {
      throw new Error('Failed to fetch drops.');
    }
  };

  getDropSupplyForOwner = async ({ accountId }) => await getDropSupplyForOwner({ accountId });

  getDropMetadata = (metadata: string | undefined) => {
    const parsedObj = JSON.parse(metadata || '{}');
    if (Object.hasOwn(parsedObj, 'drop_name')) {
      parsedObj.dropName = parsedObj.drop_name;
    }

    if (!Object.hasOwn(parsedObj, 'dropName')) {
      parsedObj.dropName = 'Untitled';
    }
    return parsedObj;
  };

  getDropData = async ({
    drop,
    dropId,
  }: {
    drop?: ProtocolReturnedDrop;
    dropId?: string | number;
  }) => {
    if (drop === undefined && dropId === undefined) {
      throw new Error('drop or dropId must be provided.');
    }

    if (dropId !== undefined) {
      drop = await this.getDropInfo({ dropId: dropId.toString() });
    }
    if (drop == null || drop === undefined) throw new Error('Drop is null or undefined');

    const { drop_id: id, metadata, next_key_id: totalKeys } = drop;
    const claimedKeys = await this.getAvailableKeys(id);
    const claimedText = `${totalKeys - claimedKeys} / ${totalKeys}`;

    const { dropName } = this.getDropMetadata(metadata);

    let type: string | null = '';
    try {
      if (drop == null || drop === undefined) throw new Error('Drop is null or undefined');
      type = this.getDropType(drop);
    } catch (_) {
      type = DROP_TYPE.OTHER;
    }

    let nftHref: string | undefined;
    if (type === DROP_TYPE.NFT) {
      let nftMetadata = {
        media: '',
        title: '',
        description: '',
      };
      try {
        const fcMethods = drop.fc?.methods;
        if (
          fcMethods === undefined ||
          fcMethods.length === 0 ||
          fcMethods[0] === undefined ||
          fcMethods[0][0] === undefined
        ) {
          throw new Error('Unable to retrieve function calls.');
        }

        const { nftData } = await this.getNFTorTokensMetadata(fcMethods[0][0], drop.drop_id);

        nftMetadata = {
          media: `${CLOUDFLARE_IPFS}/${nftData?.metadata?.media}`, // eslint-disable-line
          title: nftData?.metadata?.title,
          description: nftData?.metadata?.description,
        };
      } catch (e) {
        throw new Error('Failed to get NFT metadata.');
      }
      nftHref = nftMetadata?.media || 'assets/image-not-found.png';
    }

    return {
      id,
      name: truncateAddress(dropName, 'end', 48),
      type: type !== 'NFT' ? type?.toLowerCase() : type,
      media: nftHref,
      claimed: claimedText,
    };
  };

  deleteDrops = async ({ wallet, dropIds }) => await deleteDrops({ wallet, dropIds });

  deleteKeys = async ({ wallet, dropId, publicKeys }) =>
    await deleteKeys({ wallet, dropId, publicKeys });

  getDropInfo = async ({
    dropId,
    secretKey,
  }: {
    dropId?: string;
    secretKey?: string;
  }): Promise<ProtocolReturnedDrop> => {
    let drop: ProtocolReturnedDrop;

    if (!dropId && !secretKey) {
      throw new Error('dropId or secretKey must be provided.');
    }

    try {
      drop = await getDropInformation({ dropId, secretKey });
    } catch (err) {
      throw new Error('Unable to claim. This drop may have been claimed before.');
    }

    return drop;
  };

  getAvailableKeys = async (dropId: string) => await getKeySupplyForDrop({ dropId });

  getKeysForDrop = async ({ dropId, limit, start }) =>
    await getKeysForDrop({ dropId, limit, start });

  getLinksToExport = async (dropId) => {
    const drop = await this.getDropInfo({ dropId });
    const { secretKeys } = await generateKeys({
      numKeys: drop.next_key_id,
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId as string}`,
      autoMetaNonceStart: 0,
    });

    const links = secretKeys.map(
      (key, i) =>
        `${window.location.origin}/claim/${getConfig().contractId}#${key.replace('ed25519:', '')}`,
    );

    return links;
  };

  // Utility function to fetch a batch of key information
  fetchKeyBatch = async (dropId: string, start: number, limit: number) => {
    const { publicKeys, secretKeys } = await generateKeys({
      numKeys: limit,
      rootEntropy: `${get(MASTER_KEY) as string}-${dropId}`,
      autoMetaNonceStart: start,
    });

    const keyInfos = await getKeyInformationBatch({ publicKeys });

    const dropKeyItems: DropKeyItem[] = [];
    keyInfos.forEach((info, index) => {
      const keyIndex = start + index;
      this.keyStore[dropId].dropKeyItems[keyIndex] = {
        id: keyIndex,
        link: `${window.location.origin}/claim/${getConfig().contractId}#${secretKeys[
          index
        ].replace('ed25519:', '')}`,
        slug: secretKeys[index].substring(8, 16),
        publicKey: publicKeys[index],
        hasClaimed: info === null, // Assuming the info contains data to determine this
        keyInfo: info,
      };
    });

    return dropKeyItems;
  };

  async getAllKeysInfo({ dropId }) {
    try {
      const dropInfo = await this.getDropInfo({ dropId });
      const dropName = this.getDropMetadata(dropInfo.metadata).dropName;
      const totalKeys = dropInfo.next_key_id;
      if (
        this.keyStore[dropId] == null ||
        this.keyStore[dropId] === undefined ||
        (this.keyStore[dropId] != null && this.keyStore[dropId].totalKeys !== totalKeys)
      ) {
        // Initialize the cache for this drop
        this.keyStore[dropId] = {
          dropName,
          dropKeyItems: new Array(totalKeys).fill(null),
          totalKeys,
        };

        // Define how many batches are needed based on KEY_ITEMS_PER_QUERY
        const totalBatches = Math.ceil(totalKeys / KEY_ITEMS_PER_QUERY);
        const batchPromises: Array<Promise<DropKeyItem[]>> = [];

        for (let i = 0; i < totalBatches; i++) {
          const start = i * KEY_ITEMS_PER_QUERY;
          const limit = Math.min(KEY_ITEMS_PER_QUERY, totalKeys - start);

          batchPromises.push(this.fetchKeyBatch(dropId, start, limit));
        }

        // Wait for all batches to resolve
        await Promise.all(batchPromises);
      }

      return this.keyStore[dropId];
    } catch (error) {
      throw new Error('Failed to get keys info.');
    }
  }

  // Main function to get key info, with caching logic for paginated values
  getPaginatedKeysInfo = async ({
    dropId,
    start,
    limit,
  }: {
    dropId: string;
    start: number;
    limit: number;
  }) => {
    try {
      // Initialize the cache for this drop if it doesn't exist
      if (this.keyStore[dropId] == null || this.keyStore[dropId] === undefined)
        throw new Error('Drop is null or undefined');

      const dropInfo = await this.getDropInfo({ dropId });
      const dropName = this.getDropMetadata(dropInfo.metadata).dropName;
      const totalKeys = dropInfo.next_key_id;

      this.keyStore[dropId] = {
        dropName,
        dropKeyItems: Array(totalKeys).fill(null), // Initialize with nulls
        totalKeys,
      };

      // Calculate the end index
      const endIndex = Math.min(start + limit, this.keyStore[dropId].totalKeys);

      // Fetch and cache batches as needed
      for (let i = start; i < endIndex; i += KEY_ITEMS_PER_QUERY) {
        if (
          this.keyStore[dropId].dropKeyItems[i] == null ||
          this.keyStore[dropId].dropKeyItems[i] === undefined
        ) {
          // Fetch the keys for this batch
          const batchLimit = Math.min(KEY_ITEMS_PER_QUERY, endIndex - i);
          await this.fetchKeyBatch(dropId, i, batchLimit);
        }
      }

      // Return the requested slice from the cache
      return this.keyStore[dropId].dropKeyItems.slice(start, endIndex);
    } catch (e) {
      throw new Error('Failed to get keys info.');
    }
  };

  generateExternalWalletLink = async (
    walletName: string,
    contractId: string,
    secretKey: string,
  ) => {
    // verify the drop first
    try {
      await this.getDropInfo({ secretKey });
    } catch (err) {
      throw new Error('This drop has been claimed.');
    }

    // generate the link to navigate to
    const urls = formatLinkdropUrl({
      claimPage: walletName,
      contractId,
      secretKeys: [secretKey],
    });

    return urls[0];
  };

  getTokenClaimInformation = async (contractId: string, secretKey: string) => {
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a token drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType && !DROP_TYPE[linkdropType]) {
      throw new Error('This drop is not supported. Please contact the sender of this link.');
    }

    const dropMetadata = this.getDropMetadata(drop.metadata);
    let ftMetadata;
    if (drop.ft !== undefined) {
      ftMetadata = await getFTMetadata({ contractId: drop.ft.contract_id });
    }

    return {
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      redirectUrl: dropMetadata.redirectUrl,
      ftMetadata,
      amountTokens: drop.ft?.balance_per_use, // TODO: format correctly with FT metadata
      amountNEAR: formatNearAmount(drop.deposit_per_use, 4),
    };
  };

  getNFTorTokensMetadata = async (
    fcMethod: { receiver_id: string },
    dropId: string,
    secretKey?: string,
    contractId?: string,
  ) => {
    let nftData;
    let tokensData;

    const { receiver_id: receiverId } = fcMethod;
    const { viewCall } = getEnv();

    try {
      nftData = await viewCall({
        contractId: receiverId,
        methodName: 'get_series_info',
        args: { mint_id: parseFloat(dropId) },
      });
    } catch (err) {
      throw new Error('NFT series not found');
    }

    // show tokens if NFT series not found
    if (nftData === undefined && contractId && secretKey) {
      tokensData = await this.getTokenClaimInformation(contractId, secretKey);
    }

    return {
      nftData,
      tokensData,
    };
  };

  getNFTClaimInformation = async (contractId: string, secretKey: string) => {
    // given fc
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a nft drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType !== DROP_TYPE.NFT) {
      throw new Error('This drop is not an NFT drop. Please contact your drop creator.');
    }

    const dropMetadata = this.getDropMetadata(drop.metadata);

    const fcMethods = drop.fc?.methods;
    if (
      fcMethods === undefined ||
      fcMethods.length === 0 ||
      fcMethods[0] === undefined ||
      fcMethods[0][0] === undefined
    ) {
      throw new Error('Unable to retrieve function calls.');
    }

    const { nftData, tokensData } = await this.getNFTorTokensMetadata(
      fcMethods[0][0],
      drop.drop_id,
      secretKey,
      contractId,
    );

    return {
      type: nftData ? DROP_TYPE.NFT : DROP_TYPE.TOKEN,
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      redirectUrl: dropMetadata.redirectUrl,
      ...(nftData
        ? {
            media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
            title: nftData.metadata.title,
            description: nftData.metadata.description,
          }
        : {}),
      ...(tokensData || {}),
    };
  };

  getTicketNftInformation = async (contractId: string, secretKey: string) => {
    const drop = await this.getDropInfo({ secretKey });

    // verify if secretKey is a ticket drop
    const linkdropType = await this.getLinkdropType(drop, contractId, secretKey);
    if (linkdropType !== DROP_TYPE.TICKET) {
      throw new Error('This drop is not a Ticket drop. Please contact your drop creator.');
    }

    const dropMetadata = this.getDropMetadata(drop.metadata);

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

    const { nftData, tokensData } = await this.getNFTorTokensMetadata(
      fcMethod,
      drop.drop_id,
      secretKey,
      contractId,
    );

    return {
      type: nftData ? DROP_TYPE.NFT : DROP_TYPE.TOKEN,
      dropName: dropMetadata.dropName,
      wallets: dropMetadata.wallets,
      redirectUrl: dropMetadata.redirectUrl,
      ...(nftData
        ? {
            media: `${CLOUDFLARE_IPFS}/${nftData.metadata.media}`, // eslint-disable-line
            title: nftData.metadata.title,
            description: nftData.metadata.description,
          }
        : {}),
      ...(tokensData || {}),
    };
  };

  claim = async (secretKey: string, walletAddress: string, skipValidation = false) => {
    if (!skipValidation) {
      await this.validateAccountId(walletAddress);
    }
    await claim({ secretKey, accountId: walletAddress });
  };
}

const keypomInstance = KeypomJS.getInstance();

export default keypomInstance;
