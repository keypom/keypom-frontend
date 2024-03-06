import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Image as ChakraImage,
  HStack,
  SimpleGrid,
  useDisclosure,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';

import { SellModal } from '@/features/gallery/components/SellModal';
import { PurchaseModal } from '@/features/gallery/components/PurchaseModal';
import { VerifyModal } from '@/features/gallery/components/VerifyModal';
import { TicketCard } from '@/features/gallery/components/TicketCard';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type EventDropMetadata } from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

export default function Event() {
  const params = useParams();
  const navigate = useNavigate();

  // GET SINGLE EVENT DATA USING URL
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noDrop, setNoDrop] = useState(false);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [ticketAmount, setTicketAmount] = useState(1);
  const [ticketList, setTicketList] = useState([]);
  const [areTicketsLoading, setAreTicketsLoading] = useState(true);

  const { selector } = useAuthWalletContext();

  const accountId = 'benjiman.testnet';

  const eventId = params.eventID;

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // verify
  const { isOpen: verifyIsOpen, onOpen: verifyOnOpen, onClose: verifyOnClose } = useDisclosure();

  const secretKey = window.location.hash.substring(1).trim().split('=', 2)[1];

  // example private key
  const privateKeyExample =
    'ed25519:gMCs9DUr2CD6ExN12VXKAe2M2wQJsXSpAru6Cdc9nmx1QEBNERXohLsaMiToV42Wq3nauGJPnY5m8gdqBkBcvXI';
  // test getting the public key from the private key
  console.log('wtfff: ');

  const crypto = require('crypto');
  const fs = require('fs');

  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(privateKeyExample, 'hex');
  const publicKeyExample = ecdh.getPublicKey();

  console.log('publicKeyExample: ', publicKeyExample);

  // example: http://localhost:3000/gallery/1#secretKey=itsasecret

  console.log('secretKey' + secretKey);
  let doKeyModal = false;
  if (secretKey == null) {
    // uhh
    doKeyModal = false;
  } else if (secretKey === 'itsasecret') {
    // do something
    doKeyModal = true;
  } else {
    toast({
      title: 'Sale request failure',
      description: `This item may not be put for sale at this time`,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  const loadingdata = [];

  // append 10 loading cards
  for (let i = 0; i < 3; i++) {
    const loadingCard = {
      id: i,
      name: 'dummy2',
      type: 'Type 1',
      media: 'https://via.placeholder.com/300',
      claimed: 100,
    };
    loadingdata.push(loadingCard);
  }

  console.log(event);

  const res = '';
  if (event) {
    event.location.trim().replace(/ /g, '+');
  }

  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // purchase modal

  const incrementAmount = () => {
    if (ticketAmount < event.tickets) {
      setTicketAmount(ticketAmount + 1);
    }
  };

  const decrementAmount = () => {
    if (ticketAmount > 1) {
      setTicketAmount(ticketAmount - 1);
    }
  };

  const OpenPurchaseModal = () => {
    setEmail('');
    onOpen();
  };

  const ClosePurchaseModal = () => {
    setEmail('');
    setTicketAmount(1);
    onClose();
  };

  const PurchaseTicket = (e) => {
    e.preventDefault();
    // sell the ticket with the secret key, give toast, and sell
    navigate('./');

    const buySuccessful = Math.random();
    if (buySuccessful <= 0.5) {
      toast({
        title: 'Purchase successful PLACEHOLDER',
        description: `The item has been bought for ${event.price as number} NEAR`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Purchase failed PLACEHOLDER',
        description: 'The item has n  ot purchased',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // mobile stacking
  const Stack = useBreakpointValue({ base: VStack, md: HStack });

  function CloseSellModal() {
    doKeyModal = false;
    // Remove the secretKey parameter from the URL
    // const params = new URLSearchParams(location.search);
    // params.delete('secretKey');
    navigate('./');

    console.log('secretKegwgewey' + secretKey);
  }

  const SellTicket = (event) => {
    event.preventDefault();
    // sell the ticket with the secret key, give toast, and sell
    navigate('./');
    const sellsuccessful = Math.random();
    console.log('inpuit' + input);
    if (sellsuccessful <= 0.5) {
      toast({
        title: 'Item put for sale successfully PLACEHOLDER',
        description: `Your item has been put for sale for ${input} NEAR`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Item not put for sale',
        description: 'Your item has not been put for sale',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGetAllTickets = useCallback(async () => {
    setIsLoading(true);
    const ticketsForEvent: EventDrop[] = await keypomInstance.getTicketsForEvent({
      accountId,
      eventId,
    });

    const promises = ticketsForEvent.map(async (ticket) => {
      const meta: EventDropMetadata = JSON.parse(ticket.drop_config.metadata);
      const supply = await keypomInstance.getKeySupplyForTicket(ticket.drop_id);
      console.log('Valid Through', meta.ticketInfo.salesValidThrough);
      return {
        id: ticket.drop_id,
        artwork: meta.ticketInfo.artwork,
        name: meta.ticketInfo.name,
        description: meta.ticketInfo.name,
        salesValidThrough: meta.ticketInfo.salesValidThrough,
        passValidThrough: meta.ticketInfo.passValidThrough,
        maxTickets: meta.ticketInfo.maxSupply,
        soldTickets: supply,
        priceNear: keypomInstance.yoctoToNear(meta.ticketInfo.price),
      };
    });

    let tickets = await Promise.all(promises);

    // map tickets
    tickets = tickets.map((ticket) => {
      let available = 'unlimited';
      if (ticket.maxTickets != undefined) {
        available = String(ticket.maxTickets - ticket.soldTickets);
      }
      let dateString = '';
      if (ticket.passValidThrough) {
        dateString = ticket.passValidThrough;
        // typeof ticket.passValidThrough === 'string'
        //   ? ticket.passValidThrough
        //   : `${ticket.date.from} to ${ticket.date.to}`;
      }
      return {
        ...ticket,
        price: ticket.priceNear,
        media: ticket.artwork,
        numTickets: available,
        dateString,
        location: '',
        description: ticket.description,
      };
    });

    console.log('tickets: ', tickets);

    setTicketList(tickets);

    setAreTicketsLoading(false);
  }, [accountId, keypomInstance]);

  useEffect(() => {
    if (!keypomInstance || !eventId || !accountId) return;

    handleGetAllTickets();
  }, [keypomInstance, eventId, accountId]);

  useEffect(() => {
    if (eventId === '') navigate('/drops');
    if (!accountId) return;
    if (!eventId) return;

    const getEventData = async () => {
      // console.log('eventID: ' + eventId);
      try {
        const drop = await keypomInstance.getEventDrop({ accountId, eventId });

        const meta: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
        let dateString = '';
        if (meta.eventInfo?.date) {
          dateString =
            typeof meta.eventInfo?.date.date === 'string'
              ? meta.eventInfo?.date.date
              : `${meta.eventInfo?.date.date.from} to ${meta.eventInfo?.date.date.to}`;
        }
        console.log('driopeed: ', meta);
        console.log('meta.ticketInfo: ', meta.ticketInfo);
        setEvent({
          name: meta.eventInfo?.name || 'Untitled',
          artwork: meta.eventInfo?.artwork || 'loading',
          questions: meta.eventInfo?.questions || [],
          location: meta.eventInfo?.location || 'loading',
          date: dateString,
          description: meta.eventInfo?.description || 'loading',
          ticketInfo: meta.ticketInfo,
        });
        setIsLoading(false);
      } catch (error) {
        setNoDrop(true);
      }
    };
    getEventData();
  }, [eventId, selector, accountId, keypomInstance]);

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
          src={event.artwork}
          width="100%"
        />
        <Heading
          as="h2"
          color="black"
          left="50%"
          my="5"
          position="absolute"
          size="2xl"
          textAlign="center"
          textShadow="
    -1px -1px 0 #fff,  
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    1px 1px 0 #fff
  "
          top="33%"
          transform="translate(-50%, -50%)"
        >
          {event.name}
        </Heading>
      </Box>
      <Box my="5" />

      <Box my="5" />
      {/* <Text>Details about the Event:</Text>
      <Text>Event ID: {eventID}</Text> */}

      {/* <Box backgroundColor={'white'} h="100vh" left="0" ml="0" position="absolute" w="100vw"></Box> */}
      <Stack
        align="start"
        // bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
        borderRadius={{ base: '1rem', md: '8xl' }}
        justifyContent="space-between"
        p="0"
      >
        <Box flex="2" mr="20" textAlign="left">
          <Text color="black.800" fontSize="xl" fontWeight="medium" my="2">
            Event Details
          </Text>

          <Text> {event.description} </Text>
        </Box>
        <Box flex="1" textAlign="left">
          <Text color="black.800" fontSize="xl" fontWeight="medium" my="2">
            Location
          </Text>

          <Text>{event.location}</Text>

          <a href={mapHref} rel="noopener noreferrer" target="_blank">
            Open in Google Maps <ExternalLinkIcon mx="2px" />
          </a>

          <Text color="black.800" fontSize="xl" fontWeight="medium" my="2">
            Date
          </Text>
          <Text>{event.date}</Text>

          <Button mt="4" variant="primary" onClick={verifyOnOpen}>
            Verify Ticket
          </Button>
        </Box>
      </Stack>

      <Heading as="h3" my="5" size="lg">
        Tickets
      </Heading>
      <SimpleGrid minChildWidth="250px" spacing={5}>
        {!areTicketsLoading
          ? ticketList.map((ticket) => (
              <TicketCard
                key={ticket.id}
                amount={ticketAmount}
                decrementAmount={decrementAmount}
                event={ticket}
                incrementAmount={incrementAmount}
                loading={false}
                surroundingNavLink={false}
                onSubmit={OpenPurchaseModal}
              />
            ))
          : loadingdata.map((ticket) => (
              <TicketCard
                key={loadingdata.id}
                amount={ticketAmount}
                decrementAmount={decrementAmount}
                event={loadingdata[0]}
                incrementAmount={incrementAmount}
                loading={true}
                surroundingNavLink={false}
                onSubmit={OpenPurchaseModal}
              />
            ))}
      </SimpleGrid>

      <PurchaseModal
        amount={ticketAmount}
        decrementAmount={decrementAmount}
        email={email}
        event={event}
        incrementAmount={incrementAmount}
        isOpen={isOpen}
        setEmail={setEmail}
        onClose={ClosePurchaseModal}
        onSubmit={PurchaseTicket}
      />
      <SellModal
        event={event}
        input={input}
        isOpen={doKeyModal}
        setInput={setInput}
        onClose={CloseSellModal}
        onSubmit={SellTicket}
      />

      <VerifyModal event={event} isOpen={verifyIsOpen} onClose={verifyOnClose} />
    </Box>
  );
}
