import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { useRef, useState } from 'react';

import { TicketIncrementer } from './TicketIncrementer';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onSubmit: (questionValues: any, paymentMethod: string) => void;
  setEmail: (email: string) => void;
  email: string;
  setTicketAmount: (ticketAmount: number) => void;
  initialAmount: number;
  event: any;
  amount: number;
  setAmount: (amount: number) => void;
  selector: any;
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

  const focusedInputRef = useRef(null);

  const preOnSubmit = (questions, type, anyError) => {
    if (anyError) {
      setShowErrors(true);
      return;
    }
    onSubmit(questions, type);
  };

  const handleQuestionInputChange = (index, e) => {
    const newValue = e.target.value;
    console.log('123123e', e);

    // Store the currently focused input field
    focusedInputRef.current = e.target;
    setQuestionValues((prevValues) => {
      // Create a new object with the previous values
      const newValues = { ...prevValues };
      // Update the value for the current index
      newValues[index] = newValue;
      // Return the new object
      return newValues;
    });

    if (focusedInputRef.current) {
      focusedInputRef.current.focus();
    }
  };

  // Use the useEffect hook to set the focus when the questionValues state changes
  // useEffect(() => {}, [questionValues]);

  const isError = email === '';
  if (!ticket) return null;
  const availableTickets = ticket.maxTickets - ticket.soldTickets;

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
  };
  const incrementAmount = (e) => {
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

  console.log('waaticket', ticket);
  console.log('waatiasdaasdcket', amount);
  console.log('waaevent', event);
  const EventQuestions = () => {
    return (
      <>
        {event.questions.map((question, index) => {
          const isError = question.required && !questionValues[index]; // isError is true if the question is required and the input is empty

          return (
            <FormControl key={index} isInvalid={isError && showErrors}>
              <Text color="black" mt="4" textAlign="left">
                {question.question}
              </Text>
              <Input
                key={index}
                defaultValue={questionValues[index] || ''}
                maxLength={50}
                mt="2"
                type="text"
                onBlur={(e) => {
                  handleQuestionInputChange(index, e);
                }}
                // onKeyDown={(e) => {
                //   ChangeEnterFix(index, e);
                // }}
              />
            </FormControl>
          );
        })}
      </>
    );
  };

  let isAnyError = isError;
  // if there are any errors, the button is disabled
  // so increment the amount of tickets and check for errors again
  for (let i = 0; i < event.questions.length; i++) {
    if (event.questions[i].required && !questionValues[i]) {
      isAnyError = true;
      break;
    }
  }

  // purchase button version
  const stripeRegistered = stripeEnabledEvent;
  console.log('selecto123r', selector);
  const signedIn = selector.isSignedIn();
  const isFree = ticket.price === 0 || ticket.price === '0';

  const PurchaseButton = <></>;

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
            preOnSubmit(questionValues, 'stripe', isAnyError);
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
            preOnSubmit(questionValues, 'stripe', isAnyError);
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

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="8">
        <Box maxH="90vh" overflowY="auto" p="0">
          <ModalCloseButton />
          <Text
            as="h2"
            color="black.800"
            fontSize="xl"
            fontWeight="medium"
            mt="8px"
            textAlign="left"
          >
            {ticket.name}
          </Text>
          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            mt="8px"
            textAlign="left"
          >
            Description
          </Text>
          <Text textAlign="left">{ticket.description}</Text>
          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            mt="8px"
            textAlign="left"
          >
            Admission Date
          </Text>
          <Text textAlign="left">{ticket.dateString}</Text>
          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            mt="8px"
            textAlign="left"
          >
            Location
          </Text>
          <Text textAlign="left">{ticket.location}</Text>
          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            mt="8px"
            textAlign="left"
          >
            Ticket Amount
          </Text>
          <Form>
            {availableTickets > 1 ? (
              <TicketIncrementer
                amount={amount}
                decrementAmount={decrementAmount}
                incrementAmount={incrementAmount}
              />
            ) : (
              <> </>
            )}
            {/* slot in all event questions here */}
            <EventQuestions />
            <FormControl isInvalid={isError && showErrors}>
              <Text color="black" mt="4" textAlign="left">
                Email
              </Text>
              <Input
                maxLength={500}
                mt="2"
                type="email"
                value={email}
                onChange={handleInputChange}
              />
              {!(isError && showErrors) ? (
                <FormHelperText my="2">
                  No account will be created, ensure your email is correct
                </FormHelperText>
              ) : (
                <FormErrorMessage my="2"> Email is required. </FormErrorMessage>
              )}
            </FormControl>
            {PurchaseButton}
          </Form>
          <ModalFooter>
            <Button variant={'secondary'} w="100%" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};
