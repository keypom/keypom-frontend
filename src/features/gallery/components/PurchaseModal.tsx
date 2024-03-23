import {
  VStack,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Heading,
  Image,
  FormLabel,
  StackDivider,
  Box,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { type WalletSelector } from '@near-wallet-selector/core';

import { type EventInterface } from '@/pages/Event';

import { TicketIncrementer } from './TicketIncrementer';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onSubmit: (questionValues: object, paymentMethod: string, isSecondary: boolean) => void;
  setEmail: (email: string) => void;
  email: string;
  event: EventInterface;
  amount: number;
  setAmount: (amount: number) => void;
  selector: WalletSelector;
  stripeEnabledEvent: boolean;
  stripeAccountId: string;
}

export const PurchaseModal = ({
  isOpen,
  onClose,
  ticket,
  event,
  onSubmit,
  setEmail,
  email,
  amount,
  setAmount,
  selector,
  stripeEnabledEvent,
  stripeAccountId,
}: PurchaseModalProps) => {
  // email input
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const [questionValues, setQuestionValues] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // const focusedInputRef = useRef(null);

  const preOnSubmit = (questions, type, anyError) => {
    if (anyError) {
      setShowErrors(true);
      return;
    }
    onSubmit(questions, type, ticket.isSecondary);
  };

  const handleQuestionInputChange = (index, e) => {
    const newValue = e.target.value;

    // Store the currently focused input field
    const focusedInputRef = useRef<HTMLInputElement>(null);
    setQuestionValues((prevValues) => {
      // Create a new object with the previous values
      const newValues = { ...prevValues };
      // Update the value for the current index
      newValues[event.questions[index].question] = newValue;
      // Return the new object
      return newValues;
    });

    if (focusedInputRef?.current != null && focusedInputRef?.current !== undefined) {
      focusedInputRef.current.focus();
    }
  };

  // Use the useEffect hook to set the focus when the questionValues state changes
  // useEffect(() => {}, [questionValues]);

  const isError = email === '';
  if (ticket == null || ticket === undefined) return null;
  const availableTickets = ticket.maxTickets - ticket.soldTickets;

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
  };
  const incrementAmount = () => {
    const availableTickets = ticket.maxTickets - ticket.soldTickets;
    if (availableTickets <= 0) return;

    if (amount >= availableTickets) return;

    if (ticket.numTickets !== 'unlimited' && amount >= ticket.numTickets) return;
    setAmount(amount + 1);
  };

  // const inputRefs = event.questions.map(() => createRef());

  // const ChangeEnterFix = (index, e) => {
  //   // Check if the key pressed was Enter
  //   if (e.key === 'Enter') {
  //     e.preventDefault(); // Prevent the default action (form submission)

  //     // If there's a next input field, focus it
  //     if (inputRefs[index + 1]) {
  //       inputRefs[index + 1].current.focus();
  //     }
  //   }
  // };

  const EventQuestions = ({ maxToShow = 4 }) => (
    <>
      <Heading fontSize="3xl">Organizer Questions</Heading>
      {event.questions.slice(0, maxToShow).map((question, index) => {
        const error = question.required && !Object.values({})[index];
        return (
          <FormControl key={index} isInvalid={error && showErrors} mt={0}>
            <FormLabel
              color="gray.700"
              fontSize="md"
              fontWeight="medium"
              htmlFor={`question_${index}`}
            >
              {question.question} {question.required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <Input
              _hover={{ borderColor: 'gray.400' }}
              bg="gray.50"
              borderColor="gray.300"
              defaultValue=""
              focusBorderColor="blue.500"
              id={`question_${index}`}
              maxLength={50}
              size="md"
              type="text"
              onBlur={(e) => {
                handleQuestionInputChange(index, e);
              }}
            />
            {error && showErrors && (
              <FormErrorMessage>{question.question} is required.</FormErrorMessage>
            )}
          </FormControl>
        );
      })}
    </>
  );

  let isAnyError = isError;
  // if there are any errors, the button is disabled
  // so increment the amount of tickets and check for errors again
  for (let i = 0; i < event.questions.length; i++) {
    if (event.questions[i].required && !Object.values(questionValues)[i]) {
      isAnyError = true;
      break;
    }
  }

  // purchase button version
  const stripeRegistered = stripeEnabledEvent;
  const signedIn = Boolean(selector ? selector.isSignedIn() : true);
  const isFree = ticket.price === 0 || ticket.price === '0';

  let PurchaseButton = <></>;

  if (isFree) {
    // purchaseType = 3;
    PurchaseButton = (
      <Button
        w="100%"
        onClick={() => {
          preOnSubmit(questionValues, 'free', isAnyError);
        }}
      >
        Get Free Ticket
      </Button>
    );
  } else if (stripeRegistered && signedIn) {
    // purchaseType = 2;
    PurchaseButton = (
      <>
        <Button
          w="100%"
          onClick={() => {
            preOnSubmit(questionValues, 'stripe', isAnyError);
          }}
        >
          Checkout with Stripe
        </Button>
        <Text my="2"> ──────── OR ──────── </Text>
        <Button
          w="100%"
          onClick={() => {
            preOnSubmit(questionValues, 'near', isAnyError);
          }}
        >
          Purchase with NEAR
        </Button>
      </>
    );
  } else if (stripeRegistered) {
    // purchaseType = 1;
    PurchaseButton = (
      <>
        <Button
          w="100%"
          onClick={() => {
            preOnSubmit(questionValues, 'stripe', isAnyError);
          }}
        >
          Checkout with Stripe
        </Button>
        <Text my="2"> ──────── OR ──────── </Text>
        <Text>Sign in to purchase with NEAR</Text>
      </>
    );
  } else if (signedIn) {
    // purchaseType = 5;
    PurchaseButton = (
      <>
        <Button
          w="100%"
          onClick={() => {
            preOnSubmit(questionValues, 'near', isAnyError);
          }}
        >
          Purchase with NEAR
        </Button>
      </>
    );
  } else {
    // purchaseType = 4;
    PurchaseButton = (
      <>
        <Text>Sign in to purchase with NEAR</Text>
      </>
    );
  }

  const hasQuestions = event.questions && event.questions.length > 0;
  const modalSize = hasQuestions ? '6xl' : '3xl';

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size={modalSize}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="95vh" overflow="hidden">
        <ModalCloseButton size="lg" />
        {hasQuestions ? (
          <VStack spacing={0}>
            <HStack divider={<StackDivider borderColor="gray.200" />} spacing={0} w="full">
              <VStack
                align="stretch"
                borderColor="gray.200"
                borderRight={{ base: 'none', md: '1px' }}
                divider={<StackDivider borderColor="gray.200" />}
                maxW={{ base: 'full', md: '50%' }}
                p="6"
                spacing="6"
                w="full"
              >
                <Image
                  alt={`Event image for ${event.name}`}
                  borderRadius="md"
                  h="auto"
                  objectFit="cover"
                  src={event.artwork}
                  w="full"
                />
                <VStack align="stretch" spacing="4">
                  <Heading as="h3" fontSize="2xl" fontWeight="bold">
                    {event.name}
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    {event.description}
                  </Text>
                  <HStack justifyContent="space-between" pt="4">
                    <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                      Admission Date
                    </Text>
                    <Text color="gray.500" fontSize="lg">
                      {ticket.dateString}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                      Ticket Amount
                    </Text>
                    {availableTickets > 1 ? (
                      <TicketIncrementer
                        amount={amount}
                        decrementAmount={decrementAmount}
                        incrementAmount={incrementAmount}
                      />
                    ) : (
                      <Text color="gray.500" fontSize="lg">
                        Sold Out
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </VStack>
              <VStack align="stretch" maxW="md" p="6" spacing="6" w="full">
                {/* Right side: Dynamic Event Questions */}
                <EventQuestions />
                {/* Email and Purchase Section */}
                <FormControl isInvalid={isError && showErrors} mb="4">
                  <FormLabel fontSize="lg" fontWeight="medium" htmlFor="email">
                    Email
                  </FormLabel>
                  <Input
                    _focus={{ borderColor: 'blue.500' }}
                    _hover={{ borderColor: 'gray.400' }}
                    bg="gray.50"
                    borderColor="gray.300"
                    fontSize="md"
                    id="email"
                    maxLength={500}
                    placeholder="Enter your email"
                    size="lg"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </HStack>
            <Box p="6" w="full">
              <VStack spacing="4">{PurchaseButton}</VStack>
            </Box>
          </VStack>
        ) : (
          <>
            <VStack w="full">
              <VStack
                align="stretch"
                borderColor="gray.200"
                divider={<StackDivider borderColor="gray.200" />}
                spacing="6"
                w="full"
              >
                <Image
                  alt={`Event image for ${event.name}`}
                  borderRadius="md"
                  maxH="250px"
                  objectFit="cover"
                  src={event.artwork}
                  w="full"
                />
                <VStack align="stretch" spacing="4">
                  <Heading as="h3" fontSize="2xl" fontWeight="bold">
                    {event.name}
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    {event.description}
                  </Text>
                  <HStack justifyContent="space-between" pt="4">
                    <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                      Admission Date
                    </Text>
                    <Text color="gray.500" fontSize="lg">
                      {ticket.dateString}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                      Ticket Amount
                    </Text>
                    {availableTickets > 1 ? (
                      <TicketIncrementer
                        amount={amount}
                        decrementAmount={decrementAmount}
                        incrementAmount={incrementAmount}
                      />
                    ) : (
                      <Text color="gray.500" fontSize="lg">
                        Sold Out
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
            <VStack align="stretch" paddingTop="6" spacing="6" w="full">
              {/* Email and Purchase Section */}
              <FormControl isInvalid={isError && showErrors}>
                <FormLabel fontSize="lg" fontWeight="medium" htmlFor="email">
                  Email
                </FormLabel>
                <Input
                  _focus={{ borderColor: 'blue.500' }}
                  _hover={{ borderColor: 'gray.400' }}
                  bg="gray.50"
                  borderColor="gray.300"
                  fontSize="md"
                  id="email"
                  maxLength={500}
                  placeholder="Enter your email"
                  size="lg"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
            <Box paddingTop="6" w="full">
              <VStack spacing="4">{PurchaseButton}</VStack>
            </Box>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
