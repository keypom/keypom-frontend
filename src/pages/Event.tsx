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
import { getPubFromSecret } from 'keypom-js';
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
import { KEYPOM_MARKETPLACE_CONTRACT } from '@/constants/common';
import { type DataItem } from '@/components/Table/types';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

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
  };
  purchaseEmail: string;
  stripeAccountId: string | undefined;
  baseUrl: string;
  priceNear: string;
  ticketKeys?: string[];
  ticketKey?: string;
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
  numTickets: number | string | undefined;
  id: number | undefined;
  media: string | undefined;
  supply: number | undefined;
  dateString: string | undefined;
  price: number | undefined;
}

export interface SellDropInfo {
  name: string;
  artwork: string;
  questions: QuestionInfo[];
  location: string;
  date: string;
  description: string;
  publicKey: string;
  secretKey: string;
}

export default function Event() {
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
  const [input, setInput] = useState('');
  const [ticketList, setTicketList] = useState<TicketInterface[]>([]);
  const [resaleTicketList, setResaleTicketList] = useState<TicketInterface[]>([]);
  const [areTicketsLoading, setAreTicketsLoading] = useState(true);
  const [doKeyModal, setDoKeyModal] = useState(false);

  const [sellDropInfo, setSellDropInfo] = useState<SellDropInfo | null>(null);

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

  const getKeyInformation = useCallback(async () => {
    if (secretKey == null) {
      return;
    }

    try {
      const publicKey: string = getPubFromSecret(secretKey);

      const keyinfo = await keypomInstance.getTicketKeyInformation({
        publicKey: String(publicKey),
      });

      // get drop info using the key info id

      const dropID = keyinfo.token_id.split(':')[0];

      // testing dropID = "1709145479199-Ground Ticket-14"

      const dropData: EventDrop = await keypomInstance.getTicketDropInformation({ dropID });

      // parse dropData's metadata to get eventId
      const meta: TicketMetadataExtra = JSON.parse(
        dropData.drop_config.nft_keys_config.token_metadata.extra,
      );

      const keyinfoEventId = meta.eventId;
      if (keyinfoEventId !== eventId) {
        toast({
          title: 'Ticket does not match current event',
          description: `This ticket is for a different event, please scan it on the correct event page`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      const drop = await keypomInstance.getEventInfo({
        accountId: funderId,
        eventId: keyinfoEventId,
      });

      const meta2 = drop;
      let dateString = '';
      if (meta2?.date != null) {
        dateString = dateAndTimeToText(meta2.date);
      }
      setSellDropInfo({
        name: meta2.name || 'Untitled',
        artwork: meta2.artwork || 'loading',
        questions: meta2.questions || [],
        location: meta2.location || 'loading',
        date: dateString,
        description: meta2.description || 'loading',
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
  }, [secretKey, keypomInstance]);

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
      dropID: ticketBeingPurchased.id,
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

    if (drop.pubKey == null || drop.pubKey === undefined) {
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
      },
      purchaseEmail: trimmedEmail, // (currently just called email in userInfo)
      stripeAccountId,
      baseUrl: window.location.origin,
      priceNear: ticketBeingPurchased.price,
    };

    if (purchaseType === 'free') {
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
        const memo = {
          linkdrop_pk: ticketBeingPurchased.publicKey,
          new_public_key: publicKeys[0],
        }; // NftTransferMemo,

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
                },
                gas: '300000000000000',
                deposit: nearSendPrice,
              },
            },
          ],
        });
      }
    } else if (purchaseType === 'stripe') {
      const response = await fetch(
        'https://stripe-worker.kp-capstone.workers.dev/stripe/create-checkout-session',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workerPayload),
        },
      );
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

  const CheckForNearRedirect = async () => {
    if (nearRedirect == null) {
      return;
    }
    // get workerpayload from local storage
    const workerPayloadStringified = localStorage.getItem('workerPayload');
    if (workerPayloadStringified == null) {
      return;
    }

    const workerPayload: WorkerPayload = JSON.parse(workerPayloadStringified);

    // remove workerpayload from localstorage
    localStorage.removeItem('workerPayload');

    // Remove the near parameters from the URL
    navigate('./');

    const newWorkerPayload = workerPayload;

    for (const key in workerPayload.ticketKeys) {
      newWorkerPayload.ticketKey = workerPayload.ticketKeys[key];

      // newWorkerPayload["ticketKeys"] = null;
      const response = await fetch(
        'https://email-worker.kp-capstone.workers.dev/send-confirmation-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWorkerPayload),
        },
      );

      if (response.ok) {
        const responseBody = await response.json();
        TicketPurchaseSuccessful(newWorkerPayload, responseBody);
      } else {
        // Error creating account
        TicketPurchaseFailure(newWorkerPayload, await response.json());
      }
    }
  };

  const TicketPurchaseSuccessful = (workerPayload, responseBody) => {
    const priceLog: string = workerPayload.priceNear.toString();
    let description = `The item has been bought for ${priceLog} NEAR`;

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

    const yoctoPrice = keypomInstance.nearToYocto(input);

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

    if (sellsuccessful) {
      toast({
        title: 'Item put for sale successfully',
        description: `Your item has been put for sale for ${input} NEAR`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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

    const iseventavailable = await keypomInstance.getStripeEnabledEvents();
    // check if this event is stripe enabled
    const iseventstripeenabled = iseventavailable.includes(eventId);

    setStripeEnabledEvent(iseventstripeenabled);

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
        const drop = await keypomInstance.getEventInfo({ accountId: funderId, eventId });

        const meta = drop;

        let dateString = '';
        if (meta?.date != null) {
          dateString = dateAndTimeToText(meta.date);
        }

        setEvent({
          name: meta.name || 'Untitled',
          artwork: meta.artwork || 'loading',
          questions: meta.questions || [],
          location: meta.location || 'loading',
          date: dateString,
          description: meta.description || 'loading',
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
        });
        setIsLoading(false);
      } catch (error) {
        // eslint-disable-next-line
        console.log('error loading event', error);
        // toast({
        //   title: 'Error loading event',
        //   description: `please try again later`,
        //   status: 'error',
        //   duration: 5000,
        //   isClosable: true,
        // });
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
      {/* TODO: make these stacks change between hstack and vstack nicely */}
      <Show above="md">
        <HStack>
          <Box flex="2" mr="20" textAlign="left">
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              my="4px"
              textAlign="left"
            >
              Event Details
            </Text>

            <Text> {event.description} </Text>
          </Box>
          <Box flex="1" textAlign="left">
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              my="4px"
              textAlign="left"
            >
              Location
            </Text>

            <Text>{event.location}</Text>

            <a href={mapHref} rel="noopener noreferrer" target="_blank">
              Open in Google Maps <ExternalLinkIcon mx="2px" />
            </a>

            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              mt="12px"
              my="4px"
              textAlign="left"
            >
              Date
            </Text>
            <Text color="gray.400">{event.date}</Text>

            <Button mt="4" variant="primary" onClick={verifyOnOpen}>
              Verify Ticket
            </Button>
          </Box>
        </HStack>
      </Show>
      <Hide above="md">
        <VStack>
          <Box flex="2" mr="20" textAlign="left">
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              my="4px"
              textAlign="left"
            >
              Event Details
            </Text>

            <Text> {event.description} </Text>
          </Box>
          <Box flex="1" textAlign="left">
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              my="4px"
              textAlign="left"
            >
              Location
            </Text>

            <Text>{event.location}</Text>

            <a href={mapHref} rel="noopener noreferrer" target="_blank">
              Open in Google Maps <ExternalLinkIcon mx="2px" />
            </a>

            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="bold"
              mt="12px"
              my="4px"
              textAlign="left"
            >
              Date
            </Text>
            <Text color="gray.400">{event.date}</Text>

            <Button mt="4" variant="primary" onClick={verifyOnOpen}>
              Verify Ticket
            </Button>
          </Box>
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
          Secondary Tickets
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
          event={sellDropInfo}
          input={input}
          isOpen={doKeyModal && sellDropInfo != null}
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
    </Box>
  );
}
