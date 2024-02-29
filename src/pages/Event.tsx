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
} from '@chakra-ui/react';
import { NavLink, useLoaderData, useParams } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import { PurchaseModal } from '@/features/gallery/components/PurchaseModal';

export default function Event() {
  const events = useLoaderData().events;

  const params = useParams();
  const eventID = params.eventID;

  const testticket = {
    date: '2024-10-10',
    id: 1,
    img: 'https://via.placeholder.com/300',
    location: 'San Francisco',
    price: 10,
    title: 'Test Ticket',
    description: 'This is a test ticket descriptiopnm',
  };
  const tickets = [testticket, testticket];

  // check if the eventID is valid
  const event = events.find((event) => String(event.id) === eventID);

  const res = event.location.trim().replace(/ /g, '+');
  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!event) {
    return (
      <Box p="10">
        <Heading as="h1">Event not found</Heading>
        <Divider bg="black" my="5" />
        <Text>Sorry, the event you are looking for does not exist.</Text>
      </Box>
    );
  }

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
          top="50%"
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
        p="10"
      >
        <Box flex="1" textAlign="left">
          <Heading as="h3" my="5" size="lg">
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
          <Heading as="h3" my="5" size="lg">
            Location
          </Heading>

          <Text my="5">Event in {event.location}</Text>

          <a href={mapHref} rel="noopener noreferrer" target="_blank">
            Open in Google Maps <ExternalLinkIcon mx="2px" />
          </a>

          <Heading as="h3" my="5" size="lg">
            Date
          </Heading>
          <Text>Event on {event.date}</Text>

          <Heading as="h3" my="5" size="lg">
            Share Event
          </Heading>
          <Text>Copy the link to share this event with your friends</Text>
          <NavLink to={'/gallery/' + String(eventID)}>
            <Box
              alignItems="center"
              bg="white"
              borderRadius="50%" // Make it a circle
              color="black"
              display="flex" // Center the icon
              height="40px"
              justifyContent="center"
              p={2}
              width="40px"
              // onClick={() => window.open('./', '_blank')}
            >
              <ExternalLinkIcon mx="2px" />
            </Box>
          </NavLink>
        </Box>
      </HStack>

      <Heading as="h3" my="5" size="lg">
        Tickets
      </Heading>

      <SimpleGrid minChildWidth="300px" spacing={10}>
        {tickets?.map((ticket) => (
          <Card
            key={ticket.id}
            // bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            borderRadius={{ base: '1rem', md: '8xl' }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <CardHeader position="relative">
              <ChakraImage
                alt={ticket.title}
                borderRadius="md"
                height="300px"
                objectFit="cover"
                src={ticket.img}
                width="100%"
              />
              <Box
                // bg="white"
                // border="1px solid black"
                p={2}
                position="absolute"
                right="25"
                rounded="lg"
                top="10"
              >
                <Text my="2">{event.tickets} Tickets available</Text>
              </Box>
            </CardHeader>
            <CardBody color="black">
              <Heading as="h3" size="lg">
                {ticket.title}
              </Heading>
              <VStack align="start" spacing={2}>
                <Text my="2px">{ticket.date}</Text>
                <Text my="2px">{ticket.description}</Text>
              </VStack>
            </CardBody>
            <CardFooter>
              <Button colorScheme="green" onClick={onOpen}>
                Buy for {ticket.price} NEAR
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      <PurchaseModal event={event} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
