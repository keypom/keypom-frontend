import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
} from '@chakra-ui/react';
import { useState } from 'react';
import { Form, useLoaderData, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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
      {isSecondary ? (
        <Heading as="h1"> Secondary event ticket</Heading>
      ) : (
        <Heading as="h1"> Primary event listing</Heading>
      )}
      <ChakraImage alt={'tewwtweoiht'} src={'/assets/alcohol.webp'} />
      <ChakraImage alt={'tewwtweoiht2'} src={'/assets/image-not-found.webp'} />

      <Divider bg="black" my="5" />
      <Text>Details about the Event:</Text>
      <Text>Event ID: {eventID}</Text>
      <Card key={event.id} bg="white">
        <CardHeader>
          <ChakraImage alt={event.title} src={'../' + String(event.img)} />
        </CardHeader>

        <CardBody color="black">
          <Heading as="h2" size="sm">
            {event.title}
          </Heading>
          <Text color="green">${event.price}</Text>
          <Text>Event on {event.date}</Text>
          {!isSecondary ? <Text>{event.tickets} Tickets available</Text> : <> </>}
          <Text> {event.description} </Text>
        </CardBody>

        <CardFooter>
          <Text>Event in {event.location}</Text>
        </CardFooter>

        <Button colorScheme="green" variant="solid" onClick={onOpen}>
          Buy Now!
        </Button>
      </Card>
      <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Purchase Modal </ModalHeader>
          <Text>Event on {event.date}</Text>
          <Text>Event in {event.location}</Text>
          <ModalCloseButton />
          <Form action="/test" method="post">
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
