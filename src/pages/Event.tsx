import {
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Image as ChakraImage,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { NavLink, useLoaderData, useParams } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { PurchaseModal } from '@/features/gallery/components/PurchaseModal';

import myData from '../data/db.json';
import { useLocation } from 'react-router-dom';
import { SellModal } from '@/features/gallery/components/SellModal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { VerifyModal } from '@/features/gallery/components/VerifyModal';
import { TicketCard } from '@/features/gallery/components/TicketCard';

export default function Event() {
  const params = useParams();
  const eventID = params.eventID;
  const navigate = useNavigate();

  const toast = useToast();

  const events = useLoaderData().events;

  // check if the eventID is valid
  const event = events.find((event) => String(event.id) === eventID);

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // verify
  const { isOpen: verifyIsOpen, onOpen: verifyOnOpen, onClose: verifyOnClose } = useDisclosure();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let secretKey = query.get('secretKey');

  //example: http://localhost:3000/gallery/1?secretKey=itsasecret

  console.log('secretKey' + secretKey);
  let doKeyModal = false;
  if (secretKey == null) {
    //uhh
    doKeyModal = false;
  } else if (secretKey === 'itsasecret') {
    //do something
    let doKeyModal = true;
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
    //sell the ticket with the secret key, give toast, and sell
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

  if (!event) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
      </Box>
    );
  }

  const loadingdata = [];

  //append 10 loading cards
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

  //purchase modal
  const [email, setEmail] = useState('');
  const [ticketAmount, setTicketAmount] = useState(1);

  const incrementAmount = () => {
    setTicketAmount(ticketAmount + 1);
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
    //sell the ticket with the secret key, give toast, and sell
    navigate('./');

    const buySuccessful = Math.random();
    console.log('email' + email);
    console.log('ticketAmount' + ticketAmount);
    console.log('event' + event);
    if (buySuccessful <= 0.5) {
      toast({
        title: 'Purchase successful PLACEHOLDER',
        description: `The item has been bought for ${event.price} NEAR`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Purchase failed PLACEHOLDER',
        description: 'The item has not purchased',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="10">
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

      <HStack
        align="start"
        // bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
        borderRadius={{ base: '1rem', md: '8xl' }}
        justifyContent="space-between"
        p="0"
      >
        <Box flex="2" textAlign="left" mr="20">
          <Heading as="h3" my="5" size="sm">
            Event Details
          </Heading>
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
          <Button variant="primary" onClick={verifyOnOpen}>
            Verify Ticket
          </Button>

          <Heading as="h3" mt="5" mb="2" size="sm">
            Location
          </Heading>

          <Text>{event.location}</Text>

          <a href={mapHref} rel="noopener noreferrer" target="_blank">
            Open in Google Maps <ExternalLinkIcon mx="2px" />
          </a>

          <Heading as="h3" mt="5" mb="2" size="sm">
            Date
          </Heading>
          <Text>{event.date}</Text>
        </Box>
      </HStack>

      <Heading as="h3" my="5" size="lg">
        Tickets
      </Heading>
      <SimpleGrid minChildWidth="250px" spacing={5}>
        {loadingdata?.map((ticket) => (
          <Box>
            <TicketCard
              surroundingNavLink={false}
              loading={false}
              key={ticket.id}
              event={loadingdata[0]}
              amount={ticketAmount}
              incrementAmount={incrementAmount}
              decrementAmount={decrementAmount}
              onSubmit={OpenPurchaseModal}
            />
          </Box>
        ))}
      </SimpleGrid>

      <PurchaseModal
        setEmail={setEmail}
        setTicketAmount={setTicketAmount}
        onSubmit={PurchaseTicket}
        event={event}
        isOpen={isOpen}
        onClose={ClosePurchaseModal}
        email={email}
        ticketAmount={ticketAmount}
      />
      <SellModal
        input={input}
        setInput={setInput}
        event={event}
        isOpen={doKeyModal}
        onSubmit={SellTicket}
        onClose={CloseSellModal}
      />

      <VerifyModal event={event} isOpen={verifyIsOpen} onClose={verifyOnClose} />
    </Box>
  );
}

export const eventsLoader = async () => {
  // const res = await fetch("http://localhost:3000/events");

  return myData;
};
