import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
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
  selector: string;
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
}: PurchaseModalProps) => {
  // email input
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };


  const [questionValues, setQuestionValues] = useState({});

  const focusedInputRef = useRef(null);

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
        we have some questions for you
        {event.questions.map((question, index) => {
          const isError = question.required && !questionValues[index]; // isError is true if the question is required and the input is empty

          return (
            <FormControl key={index} isInvalid={isError}>
              <Text color="black" mt="4" textAlign="left">
                {question.question}
              </Text>
              <Input
                key={index}
                defaultValue={questionValues[index] || ''}
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

  const isFree = ticket.price === 0;
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
            <FormControl isInvalid={isError}>
              <Text color="black" mt="4" textAlign="left">
                Email
              </Text>
              <Input mt="2" type="email" value={email} onChange={handleInputChange} />
              {!isError ? (
                <FormHelperText>
                  No account will be created, ensure your email is correct
                </FormHelperText>
              ) : (
                <FormErrorMessage> Email is required. </FormErrorMessage>
              )}
            </FormControl>
            {isFree ? (
                <Button
                isDisabled={isAnyError}
                mt="4"
                w="100%"
                onClick={() => {
                  onSubmit(questionValues, "free");
                }}
              >
                Checkout for free
              </Button>
              ) : (
                <HStack mt="4" justifyContent="space-between">
                  {selector.isSignedIn() ? (
                  <Button
                    isDisabled={isAnyError}
                    w="40%"
                    onClick={() => {
                      onSubmit(questionValues, "near");
                    }}
                  >
                    Buy with NEAR
                  </Button>
                  ) : (
                  <></>
                    )}
                  <Button
                    isDisabled={isAnyError}
                    w={selector.isSignedIn() ? "40%" : "100%"}
                    onClick={() => {
                      onSubmit(questionValues, "stripe");
                    }}
                  >
                    Buy with Stripe
                  </Button>
                </Hstack>
              )}
{!selector.isSignedIn() ? (
                    <Text
                    mt="2"
                    w="100%"
                    >
                    Sign in to buy with NEAR
                    </Text>
                  ) : (
                    <></>
                  )}
            
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
