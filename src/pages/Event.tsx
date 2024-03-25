import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Image as ChakraImage,
  SimpleGrid,
  useDisclosure,
  useToast,
  HStack,
  Hide,
  Show,
  VStack,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import { generateKeys, getPubFromSecret, formatNearAmount } from 'keypom-js';
import { type Wallet } from '@near-wallet-selector/core';

import { SellModal } from '@/features/gallery/components/SellModal';
import { PurchaseModal } from '@/features/gallery/components/PurchaseModal';
import { VerifyModal } from '@/features/gallery/components/VerifyModal';
import { TicketCard } from '@/features/gallery/components/TicketCard';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import {
  type TicketInfoMetadata,
  type QuestionInfo,
  type TicketMetadataExtra,
  type DateAndTimeInfo,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';
import {
  EMAIL_WORKER_BASE,
  KEYPOM_EVENTS_CONTRACT,
  CLOUDFLARE_IPFS,
  EVENTS_WORKER_BASE,
  KEYPOM_MARKETPLACE_CONTRACT,
  PURCHASED_LOCAL_STORAGE_PREFIX,
} from '@/constants/common';
import { type DataItem } from '@/components/Table/types';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';
import { LoadingModal } from '@/features/events-page/components/LoadingModal';

import { botCheck } from '../utils/botCheck';

interface WorkerPayload {
  name: string | null;
  ticketAmount: number;
  buyerAnswers: string;
  ticket_info: {
    location: string;
    eventName: string;
    ticketType: string;
    eventDate: string;
    ticketOwner: string | undefined;
    eventId: string;
    dropId: string;
    funderId: string;
    event_image_url: string;
    ticket_image_url: string;
  };
  purchaseEmail: string;
  stripeAccountId: string | undefined;
  baseUrl: string;
  priceNear: string;
  // secret keys, for multiple primary purchases
  ticketKeys?: string[];
  // single secret key to send in email
  ticketKey?: string;
  network?: string;
  linkdrop_secret_key?: string;
}

export interface TicketInterface {
  id: string;
  artwork: string;
  name: string;
  description: string;
  salesValidThrough: DateAndTimeInfo;
  passValidThrough: DateAndTimeInfo;
  questions?: QuestionInfo[];
  supply: number;
  maxTickets: number | undefined;
  soldTickets: number;
  limitPerUser: number;
  priceNear: string;
  dateString?: string;
  media?: string;
  isSecondary?: boolean;
  publicKey?: string;
  public_key?: string;
  price?: string;
}

export interface EventInterface {
  title: string;
  name: string;
  stripeCheckout: boolean;
  nearCheckout: boolean;
  artwork: string;
  location: string;
  date: string;
  description: string;
  questions: QuestionInfo[];
  pubKey: string;
  secretKey: string;
  navurl: string | undefined;
  maxTickets: number | undefined;
  soldTickets: number | undefined;
  limitPerUser?: number;
  numTickets: number | string | undefined;
  id: number | undefined;
  media: string | undefined;
  supply: number | undefined;
  dateString: string | undefined;
  price: number | undefined;
  dateForPastCheck: Date | undefined;
}

export interface ResaleTicketInfo {
  name: string;
  artwork: string;
  description: string;
  passValidThrough: DateAndTimeInfo;
  salesValidThrough: DateAndTimeInfo;
  maxNearPrice: number;
  publicKey: string;
  secretKey: string;
}

export default function Event() {
  // const simulateStripe: boolean = false;

  const params = useParams();
  if (params.eventID == null || params.eventID === undefined) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
        <Text>The URL is malformed.</Text>
      </Box>
    );
  }
  // split up params into two parts, the funderId and the eventId
  const eventURL = params.eventID.split(':');
  const funderId = eventURL[0];
  const eventId = eventURL[1];

  if (eventId == null || eventId === undefined) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
        <Text>The URL is malformed.</Text>
      </Box>
    );
  }

  const navigate = useNavigate();
  const toast = useToast();

  // GET SINGLE EVENT DATA USING URL
  const [event, setEvent] = useState<EventInterface | undefined | null>(null);
  const [stripeEnabledEvent, setStripeEnabledEvent] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noDrop, setNoDrop] = useState(false);
  const [input, setInput] = useState('0.1');
  const [ticketList, setTicketList] = useState<TicketInterface[]>([]);
  const [resaleTicketList, setResaleTicketList] = useState<TicketInterface[]>([]);
  const [areTicketsLoading, setAreTicketsLoading] = useState(true);
  const [doKeyModal, setDoKeyModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingModalText, setLoadingModalText] = useState<{
    title: string;
    text: string;
    subtitle: string;
  }>({ title: '', text: '', subtitle: '' });

  const [sellDropInfo, setSellDropInfo] = useState<ResaleTicketInfo | null>(null);

  // purchase modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ticketBeingPurchased, setTicketBeingPurchased] = useState<any>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

  // verify
  const { isOpen: verifyIsOpen, onOpen: verifyOnOpen, onClose: verifyOnClose } = useDisclosure();

  const secretKey = window.location.hash.substring(1).trim().split('=', 2)[1];

  const { accountId, selector } = useAuthWalletContext();

  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    async function fetchWallet() {
      if (selector == null || selector === undefined) return;
      try {
        const wallet = await selector.wallet();
        setWallet(wallet);
      } catch (error) {
        // This error happens immediately on page load so just wait for the next
      }
    }
    fetchWallet();
  }, [selector]);

  useEffect(() => {
    if (keypomInstance == null || keypomInstance === undefined || !eventId || !funderId) return;
    // TODO: check if secretKey is reasonable

    getKeyInformation();
  }, [secretKey, eventId]);

  // http://localhost:3000/gallery/minqi.testnet:299df60c-5036-4adb-888f-001706f13962#secretKey=2121cLnS58WEghkDd7qptGovW3f7RGixJE2E6QJXbUkAAWCuRCWHEaxfeMgLpWsuvRAgzityezpW8wFXyahzuLDr

  // http://localhost:3000/gallery/minqi.testnet:299df60c-5036-4adb-888f-001706f13962/?transactionHashes=7VSivNFojMxDr1fVsTQ5teJSeqHxTj6ERG3ctyotBpUm
  const nearRedirect = window.location.search.substring(1).trim().split('=', 2)[1];

  useEffect(() => {
    if (keypomInstance == null || keypomInstance === undefined || !eventId || !funderId) return;

    CheckForNearRedirect();
  }, [keypomInstance, eventId, funderId]);

  useEffect(() => {
    CheckForSellSuccessToast();
  }, []);

  const getKeyInformation = useCallback(async () => {
    if (
      secretKey === null ||
      secretKey === undefined ||
      eventId === null ||
      eventId === undefined
    ) {
      return;
    }

    try {
      const publicKey: string = getPubFromSecret(secretKey);

      const keyInfo = await keypomInstance.getTicketKeyInformation({
        publicKey: String(publicKey),
      });

      // get drop info using the key info id
      const dropId = keyInfo.token_id.split(':')[0];
      const dropData: EventDrop = await keypomInstance.getTicketDropInformation({ dropId });

      // parse dropData's metadata to get eventId
      const ticketMetadata: TicketInfoMetadata =
        dropData.drop_config.nft_keys_config.token_metadata;
      const ticketMetadataExtra: TicketMetadataExtra = JSON.parse(ticketMetadata.extra);

      const keyInfoEventId = ticketMetadataExtra.eventId;
      if (keyInfoEventId !== eventId) {
        toast({
          title: 'Ticket does not match current event',
          description: `This ticket is for a different event, please scan it on the correct event page`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      const maxNearPriceYocto = await keypomInstance.viewCall({
        contractId: KEYPOM_MARKETPLACE_CONTRACT,
        methodName: 'get_max_resale_for_drop',
        args: { drop_id: dropId },
      });
      const maxNearPrice = parseFloat(formatNearAmount(maxNearPriceYocto, 3));

      setSellDropInfo({
        name: ticketMetadata.title,
        artwork: `${CLOUDFLARE_IPFS}/${ticketMetadata.media}`,
        description: ticketMetadata.description,
        salesValidThrough: ticketMetadataExtra.salesValidThrough,
        passValidThrough: ticketMetadataExtra.passValidThrough,
        maxNearPrice,
        publicKey,
        secretKey,
      });

      setDoKeyModal(true);
    } catch (error) {
      const errorLog: string = error.toString();
      toast({
        title: 'Sale request failure',
        description: `This item may not be put for sale at this time since ${errorLog}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [event, secretKey, keypomInstance]);

  // example: http://localhost:3000/gallery/minqi.testnet:152c9ef5-13de-40f6-9ec2-cc39f5886f4e#secretKey=ed25519:AXSwjeNg8qS8sFPSCK2eYK7UoQ3Kyyqt9oeKiJRd8pUhhEirhL2qbrs7tLBYpoGE4Acn8JbFL7FVjgyT2aDJaJx
  const loadingdata = [] as DataItem[];
  // append 3 loading cards
  for (let i = 0; i < 3; i++) {
    const loadingCard: DataItem = {
      id: i,
      title: 'Loading',
      name: 'Loading',
      artwork: 'https://via.placeholder.com/300',
      location: 'Loading',
    };
    loadingdata.push(loadingCard);
  }

  let res = '';
  if (event?.location !== undefined && event?.location !== null) {
    res = event.location.trim().replace(/ /g, '+');
  }

  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // purchase modal

  const OpenPurchaseModal = async (ticket, ticketAmount) => {
    setTicketBeingPurchased(ticket);
    setTicketAmount(ticketAmount);
    onOpen();
  };

  const ClosePurchaseModal = () => {
    setTicketAmount(1);
    onClose();
  };

  function uint8ArrayToBase64(u8Arr: Uint8Array): string {
    const string = u8Arr.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return btoa(string);
  }
  async function encryptWithPublicKey(data: string, publicKey: CryptoKey): Promise<string> {
    const encoded = new TextEncoder().encode(data);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      encoded,
    );

    return uint8ArrayToBase64(new Uint8Array(encrypted));
  }

  async function base64ToPublicKey(base64Key: string) {
    // Decode the Base64 string to an ArrayBuffer
    const binaryString = atob(base64Key);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Import the key from the ArrayBuffer
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
      },
      true,
      ['encrypt'],
    );

    return publicKey;
  }

  const PurchaseTicket = async (email, questionValues, purchaseType, isSecondary) => {
    navigate('./');

    const dropData = await keypomInstance.getTicketDropInformation({
      dropId: ticketBeingPurchased.id,
    });

    // parse dropData's metadata to get eventId
    const meta: TicketMetadataExtra = JSON.parse(
      dropData.drop_config.nft_keys_config.token_metadata.extra,
    );

    const keyinfoEventId = meta.eventId;

    const drop = await keypomInstance.getEventInfo({
      accountId: dropData.funder_id ? dropData.funder_id : undefined,
      eventId: keyinfoEventId,
    });

    if (drop == null || drop === undefined || drop.pubKey == null || drop.pubKey === undefined) {
      toast({
        title: 'Purchase failed',
        description: 'This event does not have a public key',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const publicKeyBase64: string = drop.pubKey;

    const publicKey = await base64ToPublicKey(publicKeyBase64);

    // encrypt the questionValues
    const data = JSON.stringify({ questions: questionValues });

    const encryptedValues = await encryptWithPublicKey(data, publicKey);

    let attendeeName: string | null = null;

    if (drop?.questions?.length !== 0 && drop?.questions !== undefined) {
      // filter each question to find the list of ones that contain "name"
      const indexlist: number[] = [];
      for (let i = 0; i < drop?.questions?.length; i++) {
        if (drop?.questions[i]?.question?.toLowerCase().replaceAll(' ', '').includes('name')) {
          indexlist.push(i);
        }
      }

      // get the shortest question in indexlist
      let shortestIndex = -1;
      let shortestLength = 1000;
      for (let i = 0; i < indexlist.length; i++) {
        if (drop?.questions[indexlist[i]].question.length < shortestLength) {
          shortestIndex = indexlist[i];
          shortestLength = drop?.questions[indexlist[i]].question.length;
        }
      }
      if (shortestIndex !== -1) {
        attendeeName = questionValues[shortestIndex];
      }
    }

    // limit the number of characters in the email and name to 500
    if (attendeeName != null && attendeeName.length > 500) {
      attendeeName = attendeeName.substring(0, 500);
    }
    let trimmedEmail = email;
    if (trimmedEmail && trimmedEmail.length > 500) {
      trimmedEmail = trimmedEmail.substring(0, 500);
    }

    const stripe_ticket_hash: string = dropData.drop_config.nft_keys_config.token_metadata.media;
    const ticket_url_stripe = `https://cloudflare-ipfs.com/ipfs/${stripe_ticket_hash}`;

    const workerPayload: WorkerPayload = {
      name: attendeeName,
      ticketAmount, // (number of tickets being purchase)
      buyerAnswers: encryptedValues, // (encrypted user answers)
      ticket_info: {
        location: drop.location,
        eventName: drop.name,
        ticketType: dropData.drop_config.nft_keys_config.token_metadata.title,
        eventDate: JSON.stringify(drop.date),
        ticketOwner: accountId || undefined, // (if signed in, this is signed in account, otherwise its none/empty)
        eventId: meta.eventId,
        dropId: ticketBeingPurchased.id,
        funderId,
        event_image_url: drop.artwork,
        ticket_image_url:
          purchaseType === 'stripe' ? ticket_url_stripe : ticketBeingPurchased.artwork,
      },
      purchaseEmail: trimmedEmail, // (currently just called email in userInfo)
      stripeAccountId,
      baseUrl: window.location.origin,
      priceNear: ticketBeingPurchased.price,
    };

    if (purchaseType === 'free') {
      if (!isSecondary) {
        const bot = await botCheck();

        if (bot) {
          toast({
            title: 'Purchase failed',
            description:
              'You have been identified as a bot and your purchase has been blocked. Make sure your VPN is turned off.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }

        const response = await fetch(
          'https://stripe-worker.kp-capstone.workers.dev/purchase-free-tickets',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(workerPayload),
          },
        );

        if (response.ok) {
          const responseBody = await response.json();
          TicketPurchaseSuccessful(workerPayload, responseBody);
        } else {
          const responseBody = await response.json();
          console.error('responseBody', responseBody);
          TicketPurchaseFailure(workerPayload, await response.json());
        }
      } else {
        // secondary
        if (wallet == null) {
          toast({
            title: 'Purchase failed',
            description: 'Wallet not found, reconnect it and try again',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        localStorage.setItem('purchaseType', 'secondary');

        // free tickets can only be sold for 0.1N
        const nearSendPrice = '100000000000000000000000';

        const { publicKeys, secretKeys } = await keypomInstance.GenerateTicketKeys(ticketAmount);
        workerPayload.ticketKeys = secretKeys;
        const memo = {
          linkdrop_pk: ticketBeingPurchased.publicKey,
          new_public_key: publicKeys[0],
        }; // NftTransferMemo,

        const owner: string = await keypomInstance.getCurrentKeyOwner(
          KEYPOM_MARKETPLACE_CONTRACT,
          ticketBeingPurchased.publicKey,
        );

        const linkdrop_keys = await generateKeys({ numKeys: 1 });
        // Seller did not have wallet when they bought, include linkdrop info in email
        if (owner === KEYPOM_EVENTS_CONTRACT) {
          console.log('seller did not have wallet when they bought');
          workerPayload.linkdrop_secret_key = linkdrop_keys.secretKeys[0];
          workerPayload.network = process.env.REACT_APP_NETWORK_ID;
        }

        console.log('workerPayload before signandsend', JSON.stringify(workerPayload));
        localStorage.setItem('workerPayload', JSON.stringify(workerPayload));

        await wallet.signAndSendTransaction({
          signerId: accountId || undefined,
          receiverId: KEYPOM_MARKETPLACE_CONTRACT,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'buy_resale',
                args: {
                  drop_id: ticketBeingPurchased.id,
                  memo,
                  new_owner: accountId,
                  seller_new_linkdrop_pk: linkdrop_keys.publicKeys[0],
                  seller_linkdrop_drop_id: Date.now().toString(),
                },
                gas: '300000000000000',
                // 0.1NEAR if not defined
                deposit: nearSendPrice,
              },
            },
          ],
        });
      }
    } else if (purchaseType === 'near') {
      // put the workerPayload in local storage
      const { secretKeys, publicKeys } = await keypomInstance.GenerateTicketKeys(ticketAmount);
      workerPayload.ticketKeys = secretKeys;
      localStorage.setItem('workerPayload', JSON.stringify(workerPayload));

      const nearSendPrice = keypomInstance.nearToYocto(
        (ticketAmount * ticketBeingPurchased.price).toString(),
      );

      if (nearSendPrice === null) {
        toast({
          title: 'Purchase failed',
          description: 'Given price was null, please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!isSecondary) {
        // primary

        const newKeys: any[] = [];
        for (const publicKey of publicKeys) {
          newKeys.push({
            public_key: publicKey,
            metadata: encryptedValues,
            key_owner: accountId,
          });
        }

        if (wallet == null) {
          toast({
            title: 'Purchase failed',
            description: 'Wallet not found, reconnect it and try again',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        localStorage.setItem('purchaseType', 'primary');

        await wallet.signAndSendTransaction({
          signerId: accountId || undefined,
          receiverId: KEYPOM_MARKETPLACE_CONTRACT,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'buy_initial_sale',
                args: {
                  event_id: meta.eventId,
                  drop_id: ticketBeingPurchased.id,
                  new_keys: newKeys,
                },
                gas: '300000000000000',
                deposit: nearSendPrice,
              },
            },
          ],
        });
      } else {
        // secondary
        if (wallet == null) {
          toast({
            title: 'Purchase failed',
            description: 'Wallet not found, reconnect it and try again',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        localStorage.setItem('purchaseType', 'secondary');

        const memo = {
          linkdrop_pk: ticketBeingPurchased.publicKey,
          new_public_key: publicKeys[0],
        }; // NftTransferMemo,

        const owner: string = await keypomInstance.getCurrentKeyOwner(
          KEYPOM_MARKETPLACE_CONTRACT,
          ticketBeingPurchased.publicKey,
        );

        const linkdrop_keys = await generateKeys({ numKeys: 1 });
        // Seller did not have wallet when they bought, include linkdrop info in email
        if (owner === KEYPOM_EVENTS_CONTRACT) {
          console.log('seller did not have wallet when they bought');
          workerPayload.linkdrop_secret_key = linkdrop_keys.secretKeys[0];
          workerPayload.network = process.env.REACT_APP_NETWORK_ID;
        }

        console.log('workerPayload before signandsend', JSON.stringify(workerPayload));
        localStorage.setItem('workerPayload', JSON.stringify(workerPayload));

        await wallet.signAndSendTransaction({
          signerId: accountId || undefined,
          receiverId: KEYPOM_MARKETPLACE_CONTRACT,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'buy_resale',
                args: {
                  drop_id: ticketBeingPurchased.id,
                  memo,
                  new_owner: accountId,
                  seller_new_linkdrop_pk: linkdrop_keys.publicKeys[0],
                  seller_linkdrop_drop_id: Date.now().toString(),
                },
                gas: '300000000000000',
                deposit: nearSendPrice,
              },
            },
          ],
        });
      }
    } else if (purchaseType === 'stripe') {
      const response = await fetch(EVENTS_WORKER_BASE + '/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerPayload),
      });
      if (response.ok) {
        // Account created successfully
        const responseBody = await response.json();

        const stripeUrl = responseBody.stripe_url;
        window.location.href = stripeUrl;
        TicketPurchaseSuccessful(workerPayload, responseBody);
      } else {
        // Error creating account
        TicketPurchaseFailure(workerPayload, await response.json());
      }
    }
  };

  const CheckForSellSuccessToast = () => {
    const price = localStorage.getItem('sellsuccessful');

    if (price == null || price === undefined) {
      return;
    }

    localStorage.removeItem('sellsuccessful');

    toast({
      title: 'Item put for sale successfully',
      description: `Your item has been put for sale for ${price} NEAR`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const CheckForNearRedirect = async () => {
    if (nearRedirect == null) {
      return;
    }
    // get workerpayload from local storage
    const workerPayloadStringified = localStorage.getItem('workerPayload');
    const purchaseType = localStorage.getItem('purchaseType');
    if (workerPayloadStringified == null || purchaseType == null) {
      return;
    }

    const workerPayload: WorkerPayload = JSON.parse(workerPayloadStringified);

    const purchaseLocalStorageKey = `${PURCHASED_LOCAL_STORAGE_PREFIX}_${workerPayload.ticket_info.dropId}`;
    let numTicketsPurchased = parseInt(localStorage.getItem(purchaseLocalStorageKey) || '0');
    numTicketsPurchased += workerPayload.ticketAmount;
    localStorage.setItem(purchaseLocalStorageKey, numTicketsPurchased.toString());
    // remove workerpayload from localstorage
    localStorage.removeItem('workerPayload');

    // Remove the near parameters from the URL
    navigate('./');

    const newWorkerPayload = workerPayload;

    // primary purchases are in batch, if one key has been added, then all of them should have been added.
    if (workerPayload.ticketKeys === undefined || workerPayload.ticketKeys.length === 0) {
      return;
    }
    const ticketPubKey = getPubFromSecret(workerPayload.ticketKeys[0]);
    const keyInfo = await keypomInstance.getTicketKeyInformation({ publicKey: ticketPubKey });
    if (keyInfo === null) {
      return;
    }

    if (purchaseType === 'primary') {
      const keyCount = workerPayload.ticketKeys?.length;
      let currentLoadedKey = 1;

      for (const key of workerPayload.ticketKeys) {
        const ticketKey = key;
        newWorkerPayload.ticketKey = ticketKey;

        setLoadingModal(true);
        setLoadingModalText({
          title: 'Purchase Successful',
          subtitle: 'Sending confirmation email',
          text: `Progress: ${currentLoadedKey} / ${keyCount}`,
        });

        // newWorkerPayload["ticketKeys"] = null;
        const response = await fetch(EMAIL_WORKER_BASE + '/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWorkerPayload),
        });

        currentLoadedKey++;

        if (response.ok) {
          const responseBody = await response.json();
          TicketPurchaseSuccessful(newWorkerPayload, responseBody);
        } else {
          // Error creating account
          TicketPurchaseFailure(newWorkerPayload, await response.json());
        }
      }
    } else if (purchaseType === 'secondary') {
      // send confirmation email first to buyer

      newWorkerPayload.ticketKey = workerPayload.ticketKeys[0];
      // newWorkerPayload["ticketKeys"] = null;
      const response_buyer = await fetch(EMAIL_WORKER_BASE + '/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkerPayload),
      });

      if (response_buyer.ok) {
        // Email sent
        const responseBody = await response_buyer.json();
        TicketPurchaseSuccessful(workerPayload, responseBody);
      } else {
        // Email not sent
        TicketPurchaseFailure(workerPayload, await response_buyer.json());
      }
      /* ~~~~~~~~~~~~~~~~ SELLER SOLD EMAIL DISABLED UNTIL IPFS INTEGRATION ~~~~~~~~~~~~~~~~
      let email_endpoint = EMAIL_WORKER_BASE + "/send-sold-confirmation-email"
      // Seller did not have wallet when they bought, include linkdrop info in email
      if(workerPayload.linkdrop_secret_key != null || workerPayload.linkdrop_secret_key != undefined){
        email_endpoint = email_endpoint + "-no-wallet"
      }

      workerPayload["purchaseEmail"] = "minqianlu1129@gmail.com"
      const seller_response = await fetch(
        email_endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workerPayload),
        },
      );

      if (response_buyer.ok && seller_response.ok) {
        // Email sent
        const responseBody = await response_buyer.json();
        TicketPurchaseSuccessful(workerPayload, responseBody);
      } else {
        // Email not sent
        if(!response_buyer.ok){
          TicketPurchaseFailure(workerPayload, await response_buyer.json());
        }else{
          TicketPurchaseFailure(workerPayload, await seller_response.json());
        }
      }
      */
    }
    setLoadingModal(false);
  };

  const TicketPurchaseSuccessful = (workerPayload: WorkerPayload, responseBody) => {
    const priceLog: string = workerPayload.priceNear.toString();
    let description = `The item has been bought for ${priceLog} NEAR`;

    const purchaseLocalStorageKey = `${PURCHASED_LOCAL_STORAGE_PREFIX}_${workerPayload.ticket_info.dropId}`;
    let numTicketsPurchased = parseInt(localStorage.getItem(purchaseLocalStorageKey) || '0');
    numTicketsPurchased += workerPayload.ticketAmount;
    localStorage.setItem(purchaseLocalStorageKey, numTicketsPurchased.toString());

    if (workerPayload.ticketAmount > 1) {
      const amountLog: string = workerPayload.ticketAmount.toString();
      description = `${amountLog} items have been bought for ${priceLog} NEAR`;
    }

    const emailLog: string = workerPayload.purchaseEmail.toString();
    const email = ` and an email has been sent to ${emailLog}`;
    description += email;
    toast({
      title: 'Purchase successful',
      description,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    // close modal
    ClosePurchaseModal();
  };

  const TicketPurchaseFailure = (workerPayload, responseBody) => {
    const responseLog: string = responseBody.toString();
    toast({
      title: 'Purchase failed',
      description: 'Not purchase was made due to the error: ' + responseLog,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  function CloseSellModal() {
    setDoKeyModal(false);
    setSellDropInfo(null);

    // Remove the secretKey parameter from the URL
    navigate('./');
  }

  const SellTicket = async (event) => {
    event.preventDefault();
    // sell the ticket with the secret key, give toast, and sell
    navigate('./');
    setDoKeyModal(false);

    const sellInfo = sellDropInfo;

    if (sellInfo == null) {
      return;
    }

    setSellDropInfo(null);

    const nearPrice = input;

    // open up loading modal
    setLoadingModal(true);
    setLoadingModalText({
      title: 'Selling Ticket',
      subtitle: 'Please wait',
      text: 'Your ticket is being put for sale',
    });

    const yoctoPrice = keypomInstance.nearToYocto(nearPrice);

    const signature = await keypomInstance.GenerateResellSignature({
      secretKey: sellInfo.secretKey,
      publicKey: sellInfo.publicKey,
    });

    const marketplaceMemo = {
      public_key: sellInfo.publicKey,
      price: yoctoPrice,
    };

    const base64Signature = signature[0];

    const memo = JSON.stringify({
      linkdrop_pk: sellInfo.publicKey,
      signature: base64Signature,
      msg: JSON.stringify(marketplaceMemo),
    });

    let sellsuccessful = false;
    try {
      await keypomInstance.ListUnownedTickets({ msg: memo });
      sellsuccessful = true;
    } catch (error) {
      toast({
        title: 'Item not put for sale',
        description: `Your item has not been put for sale due to the error: ${String(error)}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    // close loading modal
    setLoadingModal(false);

    navigate('./');

    if (sellsuccessful) {
      // add a sellsuccessful to local storage
      localStorage.setItem('sellsuccessful', nearPrice);
      window.location.reload();
    }
  };

  const handleGetAllTickets = useCallback(async () => {
    setIsLoading(true);
    const ticketsForEvent: EventDrop[] = await keypomInstance.getTicketsForEventId({
      accountId: funderId,
      eventId,
    });

    const resalePack: TicketInterface[][] = await keypomInstance.getResalesForEvent({
      eventId,
    });

    const eventStripeStatus = await keypomInstance.getEventStripeStatus(eventId);
    setStripeEnabledEvent(eventStripeStatus);

    // get stripe id for account
    const stripeAccountId = await keypomInstance.getStripeAccountId(funderId);
    setStripeAccountId(stripeAccountId);

    const promises = ticketsForEvent.map(async (ticket) => {
      const meta: TicketInfoMetadata = ticket.drop_config.nft_keys_config.token_metadata;
      const extra: TicketMetadataExtra = JSON.parse(meta.extra);

      const supply = await keypomInstance.getKeySupplyForTicket(ticket.drop_id);

      return {
        id: ticket.drop_id,
        artwork: meta.media,
        name: meta.title,
        description: meta.description,
        salesValidThrough: extra.salesValidThrough,
        passValidThrough: extra.passValidThrough,
        limitPerUser: extra.limitPerUser,
        supply,
        maxTickets: extra.maxSupply,
        soldTickets: supply,
        priceNear: keypomInstance.yoctoToNear(extra.price),
      };
    });

    let tickets: TicketInterface[] = await Promise.all(promises);

    // map tickets
    tickets = tickets.map((ticket: TicketInterface) => {
      let available = 'unlimited';
      if (ticket.maxTickets !== undefined) {
        available = String(ticket.maxTickets - ticket.soldTickets);
      }
      let dateString = '';
      if (ticket.passValidThrough != null && ticket.passValidThrough !== undefined) {
        dateString = dateAndTimeToText(ticket.passValidThrough);
      }

      return {
        ...ticket,
        price: ticket.priceNear,
        media: ticket.artwork,
        numTickets: available,
        dateString,
        location: '',
        description: ticket.description,
        isSecondary: false,
      };
    });

    setTicketList(tickets);

    // this resalePack object is not containing the things I need it to, instead it has a list of resales for each ticket tier.
    // I want to extract it into a list of resales for the event, so it looks like ticketsForEvent

    // NOTE: I will also need to use the previously set tickets to get some details
    const resaleTickets: TicketInterface[] = [];
    for (const [dropId, resales] of Object.entries(resalePack)) {
      for (const resale of resales) {
        // find the corresponding ticket in tickets using the dropId
        for (const ticket of tickets) {
          if (ticket.id === dropId) {
            resaleTickets.push({
              artwork: ticket.artwork,
              dateString: ticket.dateString,
              description: ticket.description,
              id: ticket.id,
              limitPerUser: ticket.limitPerUser,
              // location: ticket.location,
              maxTickets: 1,
              media: ticket.media,
              name: ticket.name,
              passValidThrough: ticket.passValidThrough,
              priceNear: ticket.priceNear,
              salesValidThrough: ticket.salesValidThrough,
              soldTickets: 0,
              supply: 0,
              isSecondary: true,
              publicKey: resale.public_key,
              price: keypomInstance.yoctoToNear(String(resale.price)),
            });
          }
        }
      }
    }

    setResaleTicketList(resaleTickets);

    setAreTicketsLoading(false);
  }, [funderId, keypomInstance]);

  useEffect(() => {
    if (keypomInstance == null || keypomInstance === undefined || !eventId || !funderId) {
      return;
    }

    handleGetAllTickets();
  }, [keypomInstance, eventId, funderId]);

  useEffect(() => {
    if (eventId === '') navigate('/drops');
    if (!funderId) return;
    if (!eventId) return;

    const getEventData = async () => {
      try {
        const eventInfo = await keypomInstance.getEventInfo({ accountId: funderId, eventId });

        if (eventInfo === null || eventInfo === undefined) {
          setNoDrop(true);
          return;
        }

        let dateString = '';
        if (eventInfo?.date != null) {
          dateString = dateAndTimeToText(eventInfo.date);
        }

        const stripeAccountId = await keypomInstance.getStripeAccountId(funderId);
        setStripeAccountId(stripeAccountId);

        const stripeEnabled = await keypomInstance.getEventStripeStatus(eventId);
        console.log('stripeEnabled', stripeEnabled);
        console.log('stripeAccountId', stripeAccountId);
        setStripeEnabledEvent(stripeEnabled);

        setEvent({
          name: eventInfo.name || 'Untitled',
          artwork: eventInfo.artwork || 'loading',
          questions: eventInfo.questions || [],
          location: eventInfo.location || 'loading',
          date: dateString,
          description: eventInfo.description || 'loading',
          stripeCheckout: eventInfo.nearCheckout,
          nearCheckout: eventInfo.nearCheckout,
          // WIP data below here
          title: '',
          pubKey: '',
          secretKey: '',
          navurl: '',
          maxTickets: 0,
          soldTickets: 0,
          numTickets: '',
          id: 0,
          media: '',
          supply: 0,
          dateString: '',
          price: 0,
          dateForPastCheck: new Date(),
        });
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line
        console.error('error loading event: ', error);

        setNoDrop(true);
      }
    };
    getEventData();
  }, [eventId, selector, funderId, keypomInstance]);

  if (noDrop) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
      </Box>
    );
  }

  if (isLoading || event == null) {
    return (
      <Box p="10">
        <Heading as="h1">Loading...</Heading>
        <Divider bg="black" my="5" />
        <Text>Fetching event data</Text>
      </Box>
    );
  }
  return (
    <Box p="10">
      <Box
        backgroundColor="white"
        h="100%"
        left={0}
        position="absolute"
        top={0}
        w="100%"
        zIndex={-1}
      />
      <Box position="relative">
        <ChakraImage
          alt={event.title}
          height="300"
          objectFit="cover"
          pt="0"
          src={event.artwork}
          width="100%"
        />
      </Box>
      <Box my="5" />
      <Box my="5" />
      {/* <Text>Details about the Event:</Text>
      <Text>Event ID: {eventID}</Text> */}
      {/* <Box backgroundColor={'white'} h="100vh" left="0" ml="0" position="absolute" w="100vw"></Box> */}
      <Heading as="h2" color="black" my="5" size="2xl">
        {event.name}
      </Heading>
      {/* For larger screens, show a horizontal stack */}
      <Show above="md">
        <HStack alignItems="flex-start" spacing="20">
          <Box flex="2">
            <Text as="h2" color="black.800" fontSize="l" fontWeight="bold" my="4px">
              Event Details
            </Text>
            <Text>{event.description}</Text>
          </Box>
          <VStack alignItems="flex-start" flex="1">
            <Text as="h2" color="black.800" fontSize="l" fontWeight="bold" my="4px">
              Location
            </Text>
            <Text>{event.location}</Text>
            <a href={mapHref} rel="noopener noreferrer" target="_blank">
              Open in Google Maps <ExternalLinkIcon mx="2px" />
            </a>
            <Text as="h2" color="black.800" fontSize="l" fontWeight="bold" mt="12px" my="4px">
              Date
            </Text>
            <Text color="gray.400">{event.date}</Text>
            <Button mt="4" variant="primary" onClick={verifyOnOpen}>
              Verify Ticket
            </Button>
          </VStack>
        </HStack>
      </Show>

      {/* For smaller screens, show a vertical stack */}
      <Hide above="md">
        <VStack alignItems="flex-start" spacing="4">
          <Text as="h2" color="black.800" fontSize="l" fontWeight="bold">
            Event Details
          </Text>
          <Text>{event.description}</Text>
          <Text as="h2" color="black.800" fontSize="l" fontWeight="bold">
            Location
          </Text>
          <Text>{event.location}</Text>
          <a href={mapHref} rel="noopener noreferrer" target="_blank">
            Open in Google Maps <ExternalLinkIcon mx="2px" />
          </a>
          <Text as="h2" color="black.800" fontSize="l" fontWeight="bold">
            Date
          </Text>
          <Text color="gray.400">{event.date}</Text>
          <Button variant="primary" onClick={verifyOnOpen}>
            Verify Ticket
          </Button>
        </VStack>
      </Hide>
      <Heading as="h3" my="5" size="lg">
        Tickets
      </Heading>
      <Box h="full" mt="0" p="0px" pb={{ base: '6', md: '16' }} w="full">
        <SimpleGrid minChildWidth="280px" spacing={5}>
          {!areTicketsLoading
            ? ticketList.map((ticket: any) => (
                <TicketCard
                  key={ticket.id}
                  event={ticket}
                  loading={false}
                  surroundingNavLink={false}
                  onSubmit={OpenPurchaseModal}
                />
              ))
            : loadingdata.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  event={loadingdata[0]}
                  loading={true}
                  surroundingNavLink={false}
                  onSubmit={OpenPurchaseModal}
                />
              ))}
        </SimpleGrid>
      </Box>
      {!areTicketsLoading && resaleTicketList.length > 0 ? (
        <Heading as="h3" my="5" size="lg">
          Secondary Market
        </Heading>
      ) : (
        <></>
      )}
      <Box h="full" mt="0" p="0px" pb={{ base: '6', md: '16' }} w="full">
        <SimpleGrid minChildWidth="280px" spacing={5}>
          {!areTicketsLoading ? (
            resaleTicketList.map((ticket: any) => (
              <TicketCard
                key={ticket.id}
                event={ticket}
                loading={false}
                surroundingNavLink={false}
                onSubmit={OpenPurchaseModal}
              />
            ))
          ) : (
            <></>
          )}
        </SimpleGrid>
      </Box>
      <PurchaseModal
        amount={ticketAmount}
        event={event}
        isOpen={isOpen}
        selector={selector}
        setAmount={setTicketAmount}
        stripeEnabledEvent={stripeEnabledEvent}
        ticket={ticketBeingPurchased}
        onClose={ClosePurchaseModal}
        onSubmit={PurchaseTicket}
      />
      {doKeyModal && sellDropInfo != null && (
        <SellModal
          event={event}
          input={input}
          isOpen={doKeyModal && sellDropInfo != null}
          saleInfo={sellDropInfo}
          setInput={setInput}
          onClose={CloseSellModal}
          onSubmit={SellTicket}
        />
      )}
      <VerifyModal
        accountId={funderId}
        event={event}
        eventId={eventId}
        isOpen={verifyIsOpen}
        onClose={verifyOnClose}
      />
      <LoadingModal
        isOpen={loadingModal}
        subtitle={loadingModalText.subtitle}
        text={loadingModalText.text}
        title={loadingModalText.title}
        onClose={() => {
          setLoadingModal(false);
        }}
      />
    </Box>
  );
}
