import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
  Image as ChakraImage,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Form, NavLink, useLoaderData, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ExternalLinkIcon } from '@chakra-ui/icons';

// props validation
Event.propTypes = {
  isSecondary: PropTypes.bool,
};

export default function Event(props) {
  const isSecondary = props.isSecondary || false;
  const events = useLoaderData().events;

  const params = useParams();
  const eventID = params.eventID;

  // check if the eventID is valid
  const event = events.find((event) => String(event.id) === eventID);

  // modal information
  const { isOpen, onOpen, onClose } = useDisclosure();
  const res = event.location.trim().replace(/ /g, '+');
  const mapHref = 'https://www.google.com/maps/search/' + String(res);

  // email input
  const [input, setInput] = useState('');
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const isError = input === '';

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
      {isSecondary ? <Text> Secondary event ticket</Text> : <Text> Primary event listing</Text>}

      <Heading as="h2" my="5" size="2xl">
        {event.title}
      </Heading>
      <Divider bg="black" my="5" />
      {/* <Text>Details about the Event:</Text>
      <Text>Event ID: {eventID}</Text> */}
      <Box position="relative">
        <ChakraImage alt={event.title} src={'../' + String(event.img)} />
        <Button
          colorScheme="green"
          m="5"
          maxWidth="300"
          position="absolute"
          right="0"
          top="0"
          variant="solid"
          onClick={onOpen}
        >
          Buy Now for ${event.price}
        </Button>
      </Box>

      {!isSecondary ? <Text my="5">{event.tickets} Tickets available</Text> : <> </>}

      <HStack align="start" justifyContent="space-between">
        <Box textAlign="left">
          <Heading as="h3" my="5" size="lg">
            Description
          </Heading>
          <Text> {event.description} </Text>

          <Heading as="h3" my="5" size="lg">
            Date
          </Heading>
          <Text>Event on {event.date}</Text>
        </Box>
        <Box textAlign="left">
          <Heading as="h3" my="5" size="lg">
            Event Location
          </Heading>

          <Text my="5">Event in {event.location}</Text>

          <a href={mapHref} my="5" rel="noopener noreferrer" target="_blank">
            Open in Google Maps <ExternalLinkIcon mx="2px" />
          </a>

          <Heading as="h3" my="5" size="lg">
            Share Event
          </Heading>
          <Text>Copy the link to share this event with your friends</Text>
          <NavLink to={'/gallery/' + eventID}>
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

      <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Purchase Modal </ModalHeader>
          <Text>Event on {event.date}</Text>
          <Text>Event in {event.location}</Text>
          <ModalCloseButton />
          <Form action="/" method="post">
            {!isSecondary ? (
              <>
                <ModalBody>Select number of tickets</ModalBody>
                <FormLabel>Ticket Amount</FormLabel>
                <NumberInput max={50} min={1}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </>
            ) : (
              <> </>
            )}

            <FormControl isInvalid={isError}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={input} onChange={handleInputChange} />
              {!isError ? (
                <FormHelperText>
                  No account will be created, ensure your email is correct
                </FormHelperText>
              ) : (
                <FormErrorMessage> Email is required. </FormErrorMessage>
              )}
            </FormControl>

            <Button colorScheme="green" type="submit">
              Proceed to checkout
            </Button>
          </Form>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
