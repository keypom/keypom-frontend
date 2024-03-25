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
import { useCallback, useEffect, useState } from 'react';
import { type WalletSelector } from '@near-wallet-selector/core';

import { type EventInterface } from '@/pages/Event';
import { EMAIL_QUESTION } from '@/features/create-drop/components/ticket/helpers';
import { PURCHASED_LOCAL_STORAGE_PREFIX } from '@/constants/common';

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
}: PurchaseModalProps) => {
  const [showErrors, setShowErrors] = useState(false);
  const [email, setEmail] = useState('');
  const [questionResponses, setQuestionResponses] = useState({});
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [loading, setLoading] = useState(false);
  const [numPurchased, setNumPurchased] = useState(0);

  useEffect(() => {
    setCurrentTicket(ticket);

    if (ticket) {
      const key = `${PURCHASED_LOCAL_STORAGE_PREFIX as string}_${ticket.id as string}`;
      const purchased = localStorage.getItem(key);
      if (purchased) {
        setNumPurchased(parseInt(purchased));
      }
    }
    // Logic to handle updated ticket or ticketAmount
  }, [ticket, amount]); // Depend on ticket and ticketAmount

  const preOnSubmit = (type) => {
    if (email === '') {
      setShowErrors(true);
      return;
    }

    for (const question of event.questions) {
      if (
        question.required &&
        (questionResponses[question.question] === '' ||
          questionResponses[question.question] === undefined)
      ) {
        setShowErrors(true);
        return;
      }
    }

    setShowErrors(false); // Reset error state before validation
    setLoading(true);
    // You may want to transform questionValues into the desired format for onSubmit
    onSubmit(email, questionResponses, type, currentTicket.isSecondary);
  };

  // Use the useEffect hook to set the focus when the questionValues state changes
  // useEffect(() => {}, [questionValues]);

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
  };
  const incrementAmount = () => {
    if (availableTickets <= 0) return;

    if (amount >= availableTickets) return;

    if (currentTicket.numTickets !== 'unlimited' && amount >= currentTicket.numTickets) return;
    setAmount(amount + 1);
  };

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setQuestionResponses((prev) => ({ ...prev, [EMAIL_QUESTION]: e.target.value }));
  }, []);

  const handleQuestionChange = useCallback((questionText, answer) => {
    setQuestionResponses((prev) => ({ ...prev, [questionText]: answer }));
  }, []);

  // purchase button version
  const stripeRegistered = stripeEnabledEvent;
  const signedIn = Boolean(selector ? selector.isSignedIn() : true);
  const hasQuestions = event.questions && event.questions.length > 1;
  const modalSize = hasQuestions ? '6xl' : '3xl';
  const modalPadding = { base: hasQuestions ? '0' : '8', md: hasQuestions ? '2' : '16' };
  const modalHeight = { base: '95vh', md: 'auto' };

  let PurchaseButton = <></>;
  if (loading) {
    PurchaseButton = (
      <Button isLoading loadingText="Processing" w="100%">
        Processing
      </Button>
    );
  } else if (currentTicket?.price && parseInt(currentTicket.price) === 0) {
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
        <Text>Sign in to purchase with NEAR</Text>
        <Button
          w="100%"
          onClick={() => {
            preOnSubmit('stripe');
          }}
        >
          Checkout with Stripe
        </Button>
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

  if (currentTicket == null || currentTicket === undefined) return null;
  let showLimit = true;
  const availableTickets = currentTicket.maxTickets - currentTicket.soldTickets;
  if (currentTicket.limitPerUser > availableTickets) {
    showLimit = false;
  }
  if (currentTicket.limitPerUser == null || currentTicket.limitPerUser === undefined) {
    showLimit = false;
  }
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
                  h="280px"
                  objectFit="contain"
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
                  <HStack justifyContent="space-between" pt="4" textAlign="left">
                    <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                      Admission Date
                    </Text>
                    <Text color="gray.500" fontSize="lg">
                      {currentTicket.dateString}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between" py={4}>
                    <VStack align="left" spacing="0" textAlign="left" w="full">
                      <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                        Ticket Amount
                      </Text>
                      {showLimit && (
                        <Text color="gray.400" fontSize="sm" fontWeight="400">
                          {`Limit of ${currentTicket.limitPerUser as string} per customer${
                            numPurchased > 0 ? ` (${numPurchased} owned)` : ''
                          }`}
                        </Text>
                      )}
                    </VStack>
                    {availableTickets > 1 ? (
                      <TicketIncrementer
                        amount={amount}
                        decrementAmount={decrementAmount}
                        incrementAmount={incrementAmount}
                        maxAmount={Math.min(
                          currentTicket.limitPerUser - numPurchased,
                          availableTickets,
                        )}
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
                <Heading as="h3" fontSize="2xl" fontWeight="bold">
                  Organizer Questions
                </Heading>
                {event.questions
                  .slice(0, 4)
                  .filter((question) => question.question !== EMAIL_QUESTION)
                  .map((question, index) => {
                    const questionKey = question.question;

                    const error =
                      question.required &&
                      (questionResponses[questionKey] === '' ||
                        questionResponses[questionKey] === undefined);

                    return (
                      <FormControl key={index} isInvalid={error && showErrors} mt={0} w="100%">
                        <FormLabel
                          color="gray.700"
                          fontSize="md"
                          fontWeight="medium"
                          htmlFor={`question_${index}`}
                        >
                          {questionKey}{' '}
                          {question.required && <span style={{ color: 'red' }}>*</span>}
                        </FormLabel>
                        <Input
                          _hover={{ borderColor: 'gray.400' }}
                          bg="gray.50"
                          borderColor="gray.300"
                          focusBorderColor="blue.500"
                          id={`question_${index}`}
                          maxLength={50}
                          size="md"
                          type="text"
                          value={questionResponses[questionKey]}
                          w="100%"
                          onChange={(e) => {
                            handleQuestionChange(questionKey, e.target.value);
                          }}
                          // No onChange or value prop needed, as we're accessing the input value directly through the ref
                        />
                      </FormControl>
                    );
                  })}
                {/* Email and Purchase Section */}
                <FormControl isInvalid={email === '' && showErrors} mb="4">
                  <FormLabel color="gray.700" fontSize="md" fontWeight="medium" htmlFor="email">
                    Email
                  </FormLabel>
                  <Input
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
                    value={email}
                    onChange={handleEmailChange}
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
                      {currentTicket.dateString}
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
                        maxAmount={availableTickets}
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
              <FormControl isInvalid={email === '' && showErrors}>
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
                  onChange={handleEmailChange}
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
