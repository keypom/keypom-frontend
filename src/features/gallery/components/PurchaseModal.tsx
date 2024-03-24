import {
  VStack,
  Button,
  FormControl,
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
import { createRef, useEffect, useRef, useState } from 'react';
import { type WalletSelector } from '@near-wallet-selector/core';

import { type EventInterface } from '@/pages/Event';

import { TicketIncrementer } from './TicketIncrementer';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onSubmit: (
    email: string,
    questionValues: object,
    paymentMethod: string,
    isSecondary: boolean,
  ) => void;
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
  amount,
  setAmount,
  selector,
  stripeEnabledEvent,
  stripeAccountId,
}: PurchaseModalProps) => {
  const [showErrors, setShowErrors] = useState(false);

  const emailInputRef = useRef<string>();
  // Initialize questionInputRefs with the correct length and fill it with refs
  const questionInputRefs = useRef({});

  useEffect(() => {
    // Dynamically create a ref for each question and store it in the questionInputRefs object
    event.questions.forEach((question, index) => {
      if (!questionInputRefs.current[question.question]) {
        questionInputRefs.current[question.question] = createRef();
      }
    });
  }, [event.questions]);

  const preOnSubmit = (type) => {
    const emailValue = emailInputRef.current?.value || '';
    console.log('emailValue', emailValue);
    if (emailValue === '') {
      setShowErrors(true);
      return;
    }

    // Create an object that maps each question to its answer
    const questionValues = {};
    for (let i = 0; i < event.questions.length; i++) {
      const required = event.questions[i].required;

      if (questionInputRefs.current[event.questions[i].question].current !== null) {
        const curAnswer = questionInputRefs.current[event.questions[i].question].current.value;
        if (required && !curAnswer) {
          setShowErrors(true); // Assume we show errors if email is empty
          return;
        }

        questionValues[event.questions[i].question] = curAnswer;
      } else if (required) {
        setShowErrors(true); // Assume we show errors if email is empty
        return;
      }
    }

    setShowErrors(false); // Reset error state before validation

    // You may want to transform questionValues into the desired format for onSubmit
    onSubmit(emailValue, questionValues, type, ticket.isSecondary);
  };

  // Use the useEffect hook to set the focus when the questionValues state changes
  // useEffect(() => {}, [questionValues]);

  const availableTickets = ticket?.maxTicket || 0 - ticket?.soldTickets || 0;

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

  const EventQuestions = ({ maxToShow = 4 }: { maxToShow?: number }) => (
    <>
      <Heading as="h3" fontSize="2xl" fontWeight="bold">
        Organizer Questions
      </Heading>
      {event.questions.slice(0, maxToShow).map((question, index) => {
        // Ensure refs array has a ref object for each question

        const questionKey = question.question; // Use a unique identifier for each question
        if (questionInputRefs.current[questionKey].current === null) {
          questionInputRefs.current[questionKey] = createRef();
        }

        const error =
          question.required &&
          (questionInputRefs.current[questionKey].current?.value === '' ||
            questionInputRefs.current[questionKey].current === null);
        return (
          <FormControl key={index} isInvalid={error && showErrors} mt={0} w="100%">
            <FormLabel
              color="gray.700"
              fontSize="md"
              fontWeight="medium"
              htmlFor={`question_${index}`}
            >
              {questionKey} {question.required && <span style={{ color: 'red' }}>*</span>}
            </FormLabel>
            <Input
              ref={questionInputRefs.current[questionKey]}
              _hover={{ borderColor: 'gray.400' }}
              bg="gray.50"
              borderColor="gray.300"
              focusBorderColor="blue.500"
              id={`question_${index}`}
              maxLength={50}
              size="md"
              type="text"
              w="100%"
              // No onChange or value prop needed, as we're accessing the input value directly through the ref
            />
          </FormControl>
        );
      })}
    </>
  );

  // purchase button version
  const stripeRegistered = stripeEnabledEvent;
  const signedIn = Boolean(selector ? selector.isSignedIn() : true);
  const isFree = parseFloat(ticket?.price || '0') === 0;
  const hasQuestions = event.questions && event.questions.length > 1;
  const modalSize = hasQuestions ? '6xl' : '3xl';
  const modalPadding = { base: hasQuestions ? '0' : '8', md: hasQuestions ? '2' : '16' };
  const modalHeight = { base: '95vh', md: 'auto' };

  let PurchaseButton = <></>;

  if (isFree) {
    // purchaseType = 3;
    PurchaseButton = (
      <Button
        w="100%"
        onClick={() => {
          preOnSubmit('free');
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
            preOnSubmit('stripe');
          }}
        >
          Checkout with Stripe
        </Button>
        <Button
          variant="secondary"
          w="100%"
          onClick={() => {
            preOnSubmit('near');
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
            preOnSubmit('stripe');
          }}
        >
          Checkout with Stripe
        </Button>
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
            preOnSubmit('near');
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

  if (ticket == null || ticket === undefined) return null;
  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size={{ base: hasQuestions ? 'full' : modalSize, md: modalSize }}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH={modalHeight} overflow="hidden" overflowY="auto" p={modalPadding}>
        <ModalCloseButton size="lg" />
        {hasQuestions ? (
          <VStack alignItems="stretch" direction={{ base: 'column', md: 'row' }} spacing={0}>
            <HStack
              divider={<StackDivider borderColor="gray.300" />}
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="center"
              spacing={0}
              w="full"
            >
              <VStack
                align="stretch"
                borderColor="gray.200"
                direction={{ base: 'column', md: 'row' }}
                divider={<StackDivider borderColor="gray.300" />}
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
              <VStack align="stretch" p="6" spacing="6" w="full">
                {/* Right side: Dynamic Event Questions */}
                <EventQuestions />
                {/* Email and Purchase Section */}
                <FormControl isInvalid={emailInputRef.current?.value === '' && showErrors} mb="4">
                  <FormLabel color="gray.700" fontSize="md" fontWeight="medium" htmlFor="email">
                    Email
                  </FormLabel>
                  <Input
                    ref={emailInputRef} // Correctly set the ref here
                    _focus={{ borderColor: 'blue.500' }}
                    _hover={{ borderColor: 'gray.400' }}
                    bg="gray.50"
                    borderColor="gray.300"
                    borderRadius="6xl"
                    fontSize="md"
                    id="email"
                    maxLength={500}
                    placeholder="Enter your email"
                    size="lg"
                    type="email"
                  />
                </FormControl>
              </VStack>
            </HStack>
            <Box p="6" w="full">
              <VStack mx="auto" spacing="4" w="full">
                {/* PurchaseButton with adjusted maxW to match the HStack's content width */}
                {PurchaseButton}
              </VStack>
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
                  ref={emailInputRef} // Correctly set the ref here
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
