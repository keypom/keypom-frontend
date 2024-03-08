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
  useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

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
  const toast = useToast();

  // GET SINGLE EVENT DATA USING URL
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noDrop, setNoDrop] = useState(false);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [ticketAmount, setTicketAmount] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [areTicketsLoading, setAreTicketsLoading] = useState(true);
  const [doKeyModal, setDoKeyModal] = useState(false);
  const [sellDropInfo, setSellDropInfo] = useState(null);

  const { selector } = useAuthWalletContext();

  const changeTicketAmount = (newAmount) => {
    setTicketAmount(newAmount);
  }

  // split up params into two parts, the accountID and the eventID'
  const eventURL = params.eventID.split(':');
  const accountId = eventURL[0];
  const eventId = eventURL[1];

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // verify
  const { isOpen: verifyIsOpen, onOpen: verifyOnOpen, onClose: verifyOnClose } = useDisclosure();

  const secretKey = window.location.hash.substring(1).trim().split('=', 2)[1];

  // example private key
  // const privateKeyExample =
  //   'ed25519:5KGpNrFRuiesHr6kMTinyEr9w33CDESdi5B4mpWJngaHY1S2kQU8mdy2J5Hr9o1p7yUWYFNrLEWfJsaix1R7tadA';
  // test getting the public key from the private key

  useEffect(() => {
    if (!keypomInstance || !eventId || !accountId) return;

    getKeyInformation();
  }, [secretKey, eventId]);

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

  const getKeyInformation = useCallback(async () => {
    if (secretKey == null) {
      return;
    }

    try {
      const publicKey: string = getPubFromSecret(secretKey);

      const keyinfo = await keypomInstance.getTicketKeyInformation({
        publicKey: String(publicKey),
      });

      console.log('keyinfo: ', keyinfo);

      // get drop info using the key info id

      var dropID = keyinfo.token_id.split(':')[0];

      console.log('dropID: ', dropID);

      // testing dropID = "1709145479199-Ground Ticket-14"

      const dropData = await keypomInstance.getTicketDropInformation({ dropID });

      console.log('dropData: ', dropData);

      // parse dropData's metadata to get eventId
      // const meta: EventDropMetadata = JSON.parse(dropData.metadata);

      var keyinfoEventId = meta.ticketInfo?.eventId;
      if (keyinfoEventId !== eventId) {
        console.log('Event ID mismatch', keyinfoEventId, eventId);
      }
      console.log('123keyinfoeventID: ', keyinfoEventId);

      console.log('123accountId: ', accountId);

      // testing keyinfoEventId = "17f270df-fcee-4682-8b4b-673916cc65a9"

      const drop = await keypomInstance.getEventInfo({ accountId, eventId:keyinfoEventId });

      console.log('drop: ', drop);
      const meta2 = drop; //.metadata;//EventDropMetadata = JSON.parse(drop.metadata);
      let dateString = '';
      if (meta2.eventInfo?.date) {
        dateString =
          typeof meta2.eventInfo?.date.date === 'string'
            ? meta2.eventInfo?.date.date
            : `${meta2.eventInfo?.date.date.from} to ${meta2.eventInfo?.date.date.to}`;
      }
      console.log('soolddriopeed: ', meta2);
      console.log('sooldmeta.ticketInfo: ', meta2.ticketInfo);
      console.log('sooldmeta.dokeymodal: ', doKeyModal);
      setSellDropInfo({
        name: meta2.name || 'Untitled',
        artwork: meta2.artwork || 'loading',
        questions: meta2.questions || [],
        location: meta2.location || 'loading',
        date: dateString,
        description: meta2.description || 'loading',
        ticketInfo: meta2.ticketInfo,
      });

      setDoKeyModal(true);
    } catch (error) {
      console.error('Error getting key information', error);
      toast({
        title: 'Sale request failure',
        description: `This item may not be put for sale at this time since ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [secretKey, keypomInstance]);

  // example: http://localhost:3000/gallery/benjiman.testnet:152c9ef5-13de-40f6-9ec2-cc39f5886f4e#secretKey=ed25519:AXSwjeNg8qS8sFPSCK2eYK7UoQ3Kyyqt9oeKiJRd8pUhhEirhL2qbrs7tLBYpoGE4Acn8JbFL7FVjgyT2aDJaJx

  console.log('secretKey: ' + secretKey);

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

  let res = '';
  if (event) {
    res = event.location.trim().replace(/ /g, '+');
  }

  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // purchase modal

  const incrementAmount = () => {
    changeTicketAmount((prevAmount) => {
      // Create a new array from the previous amount
      const newAmount = [...prevAmount];
      newAmount[cardArrayIndex]++;
      return newAmount;
    });
  };

  const decrementAmount = () => {
    if (amount[cardArrayIndex] <= 0) return;
    changeTicketAmount((prevAmount) => {
      // Create a new array from the previous amount
      const newAmount = [...prevAmount];
      newAmount[cardArrayIndex]--;
      return newAmount;
    });
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
    setDoKeyModal(false);
    setSellDropInfo(null);

    // Remove the secretKey parameter from the URL
    navigate('./');

    console.log('secretKegwgewey' + secretKey);
  }

  const SellTicket = (event) => {
    event.preventDefault();
    // sell the ticket with the secret key, give toast, and sell
    navigate('./');
    setDoKeyModal(false);
    setSellDropInfo(null);
    const sellsuccessful = Math.random();
    console.log('inpuit' + sellsuccessful + input);

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
    const ticketsForEvent: EventDrop[] = await keypomInstance.getTicketsForEventId({
      accountId,
      eventId,
    });

    const promises = ticketsForEvent.map(async (ticket) => {
      const meta: EventDropMetadata = JSON.parse(ticket.drop_config.metadata);
      const supply = await keypomInstance.getKeySupplyForTicket(ticket.drop_id);
      console.log('ofc meta', meta);
      return {
        id: ticket.drop_id,
        artwork: meta.artwork,
        name: meta.name,
        description: meta.description,
        salesValidThrough: meta.salesValidThrough,
        passValidThrough: meta.passValidThrough,
        maxTickets: meta.maxSupply,
        soldTickets: supply,
        priceNear: keypomInstance.yoctoToNear(meta.price),
      };
    });

    let tickets = await Promise.all(promises);

    // map tickets
    let ticketIndex = 0;
    tickets = tickets.map((ticket) => {
      let available = 'unlimited';
      if (ticket.maxTickets != undefined) {
        available = String(ticket.maxTickets - ticket.soldTickets);
      }
      let dateString = '';
      console.log('ticket.passValidThrough', ticket);
      if (ticket.passValidThrough) {
        dateString = formatDate(new Date(ticket.passValidThrough));
        // typeof ticket.passValidThrough === 'string'
        //   ? ticket.passValidThrough
        //   : `${ticket.date.from} to ${ticket.date.to}`;
      }
      // dateString = formatDate(dateString);
     
      ticketIndex++;
      return {
        ...ticket,
        price: ticket.priceNear,
        media: ticket.artwork,
        numTickets: available,
        dateString,
        location: '',
        description: ticket.description,
        ticketIndex: ticketIndex,
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
    if (ticketList.length > 0) {
      const initialAmount = ticketList.map(() => 1);
      console.log('initialAmount: ', initialAmount);
      setTicketAmount(initialAmount);
    }
  }, [ticketList]);

  useEffect(() => {
    if (eventId === '') navigate('/drops');
    if (!accountId) return;
    if (!eventId) return;

    const getEventData = async () => {
      // console.log('eventID: ' + eventId);
      try {
        const drop = await keypomInstance.getEventInfo({ accountId, eventId });

        console.log('dropofc: ', drop)
        // console.log('drop.metadataofc: ', drop.metadata)
        const meta = drop; //EventDropMetadata = JSON.parse(drop.metadata);
        let dateString = '';
        console.log('swaf1', meta.date)
        if (meta.date) {
          dateString =
            typeof meta.date.date === 'string'
              ? formatDate(new Date(meta.date.date))
              : `${formatDate(new Date(meta.date.date.from))} to ${formatDate(new Date(meta.date.date.to))}`;
        }
        console.log('swaf2', dateString)
        console.log('swaf3', meta)
        console.log('swaf4', formatDate(new Date(meta.date.date)))

        setEvent({
          name: meta.name || 'Untitled',
          artwork: meta.artwork || 'loading',
          questions: meta.questions || [],
          location: meta.location || 'loading',
          date: dateString,
          description: meta.description || 'loading',
          ticketInfo: meta.ticketInfo,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting event data', error);
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
        <Heading
          as="h2"
          color="black"
          my="5"
          size="2xl"
        >
          {event.name}
        </Heading>
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
      </Stack>

      <Heading as="h3" my="5" size="lg">
        Tickets
      </Heading>
      <SimpleGrid minChildWidth="250px" spacing={5}>
        {!areTicketsLoading
          ? ticketList.map((ticket) => (
              <TicketCard
                key={ticket.id}
                amount={ticketAmount[ticket.ticketIndex]}
                changeTicketAmount={
                  changeTicketAmount
                }
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
                cardArrayIndex={loadingdata.id}
                amount={ticketAmount[loadingdata.id]}
                event={loadingdata[0]}
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
      {doKeyModal && sellDropInfo != null && ( 
        <SellModal
        event={sellDropInfo}
        input={input}
        isOpen={doKeyModal && sellDropInfo != null}
        setInput={setInput}
        onClose={CloseSellModal}
        onSubmit={SellTicket}
      />}
      

      <VerifyModal event={event} isOpen={verifyIsOpen} onClose={verifyOnClose} />
    </Box>
  );
}
