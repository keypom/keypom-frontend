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
import keypomInstance from '@/lib/keypom';
import { truncateAddress } from '@/utils/truncateAddress';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import myData from '../data/db.json';

export default function Event() {
  const params = useParams();
  const eventID = params.eventID;
  const navigate = useNavigate();

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // verify
  const { isOpen: verifyIsOpen, onOpen: verifyOnOpen, onClose: verifyOnClose } = useDisclosure();

  // function useQuery() {
  //   return new URLSearchParams(useLocation().search);
  // }

  // const query = useQuery();
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

  function CloseSellModal() {
    doKeyModal = false;
    // Remove the secretKey parameter from the URL
    // const params = new URLSearchParams(location.search);
    // params.delete('secretKey');
    navigate('./');

    console.log('secretKegwgewey' + secretKey);
  }

  const [input, setInput] = useState('');
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

  const formatDate = (date) => {
    // Create an instance of Intl.DateTimeFormat for formatting
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', // Full month name.
      day: 'numeric', // Numeric day of the month.
      year: 'numeric', // Numeric full year.
      hour: 'numeric', // Numeric hour.
      minute: 'numeric', // Numeric minute.
      hour12: true, // Use 12-hour time.
    });
    return formatter.format(date);
  };

  // GET SINGLE EVENT DATA USING URL
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { accountId } = useAuthWalletContext();

  useEffect(() => {
    if (!accountId) return;
    // In parallel, fetch all the drops
    handleGetAllEvents();
  }, [accountId]);

  const handleGetAllEvents = useCallback(async () => {
    setIsLoading(true);
    console.log('event drops incoming; ');
    const eventDrops = await keypomInstance.getAllEventDrops({
      accountId: 'benjiman.testnet',
    });

    console.log('eventDrops123123; ', eventDrops);
    const dropDataPromises = eventDrops.map(async (drop: EventDrop) => {
      const meta: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      const tickets = await keypomInstance.getTicketsForEvent({
        accountId: 'benjiman.testnet',
        eventId: meta.ticketInfo.eventId,
      });
      const numTickets = tickets.length;
      return {
        id: drop.drop_id,
        name: truncateAddress(meta.eventInfo?.name || 'Untitled', 'end', 48),
        media: meta.eventInfo?.artwork,
        dateCreated: formatDate(new Date(meta.dateCreated)), // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        eventId: meta.ticketInfo.eventId,
      };
    });

    // Use Promise.all to wait for all promises to resolve
    const dropData = await Promise.all(dropDataPromises);

    // set the event to the one with the matching ID
    console.log('eventID: ', eventID);
    dropData.forEach((event) => {
      console.log('eventID: ', event.id);
    });
    setEvent(dropData.find((event) => event.id === eventID));

    setIsLoading(false);
  }, [keypomInstance, accountId]);

  if (event == null && !isLoading) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p="10">
        <Heading as="h1">Loading...</Heading>
        <Divider bg="black" my="5" />
        <Text>Fetching event data</Text>
      </Box>
    );
  }

  const loadingdata = [];

  // append 10 loading cards
  for (let i = 0; i < 3; i++) {
    const loadingCard = {
      id: i,
      name: 'dummy',
      type: 'Type 1',
      media: 'https://via.placeholder.com/300',
      claimed: 100,
    };
    loadingdata.push(loadingCard);
  }

  const res = event.location.trim().replace(/ /g, '+');

  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // purchase modal
  const [email, setEmail] = useState('');
  const [ticketAmount, setTicketAmount] = useState(1);

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
          src={'../' + String(event.img)}
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
          {event.title}
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
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
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
        {loadingdata?.map((ticket) => (
          <Box>
            <TicketCard
              key={ticket.id}
              amount={ticketAmount}
              decrementAmount={decrementAmount}
              event={loadingdata[0]}
              incrementAmount={incrementAmount}
              loading={false}
              surroundingNavLink={false}
              onSubmit={OpenPurchaseModal}
            />
          </Box>
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

export const eventsLoader = async () => {
  // const res = await fetch("http://localhost:3000/events");

  return myData;
};
