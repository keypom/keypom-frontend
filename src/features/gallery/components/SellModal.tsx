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
  HStack,
  useToast,
  FormLabel,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { MIN_NEAR_SELL } from '@/constants/common';

import { type SellDropInfo } from '@/pages/Event';
import { useAppContext } from '@/contexts/AppContext';
import { validateDateAndTime, validateEndDateAndTime, validateStartDateAndTime } from '@/features/scanner/components/helpers';
import { useState } from 'react';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

interface SellModalProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => Promise<void>;
  event: SellDropInfo;
}

const disableSellButton = (nearInput: string, maxNearPrice: number, isError: boolean) => {
  let nearInputNum = parseFloat(nearInput);
  return isError || isNaN(nearInputNum) || nearInputNum > maxNearPrice || nearInputNum < MIN_NEAR_SELL
}

const roundNumber = (num: number) => {
  return num.toFixed(2);
};

export const SellModal = ({
  input,
  setInput,
  isOpen,
  onClose,
  onSubmit,
  event,
}: SellModalProps) => {
  const { nearPrice } = useAppContext();
  // price input
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Check if the ticket is valid to sell.
  const ticketSellStartDateValid = false && validateStartDateAndTime(event.salesValidThrough);
  const ticketSellEndDateValid = validateEndDateAndTime(event.salesValidThrough);
  const ticketSellDateValid = false && validateDateAndTime(event.salesValidThrough);

  const isSellError = (input === '' || !ticketSellDateValid);
  const nearInput = parseFloat(input);

  const [isTicketValidToastOpen, setIsTicketValidToastOpen] = useState(false);
  const ticketSellNotValidToast = useToast();

  const showToast = () => {
    if (!isTicketValidToastOpen) {
      setIsTicketValidToastOpen(true);
      ticketSellNotValidToast({
        title: ticketSellStartDateValid ? "Ticket sell date has not started." : "Ticket sell date has passed.",
        description: `Tickets be can sold during: ${dateAndTimeToText(event.salesValidThrough)}.`,
        status: 'error',
        duration: null,
        isClosable: true,
        onCloseComplete: () => setIsTicketValidToastOpen(false),
      });
    }
  };

  // Display not valid 
  if (!ticketSellDateValid){
    showToast();
  }

  // console.log(Date())
  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent p="8">
        <ModalCloseButton />
        <Text as="h2" color="black.800" fontSize="xl" fontWeight="medium" my="4px" textAlign="left">
          {event.name}
        </Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Description
        </Text>
        <Text textAlign="left">{event.description}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Date
        </Text>
        <Text textAlign="left">{event.date}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Location
        </Text>
        <Text textAlign="left">{event.location}</Text>
        {ticketSellDateValid && (<Form action="/" onSubmit={onSubmit}>
          <FormControl isInvalid={disableSellButton(input, event.maxNearPrice, isSellError)}>
          <HStack>
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="medium"
              my="4px"
              textAlign="left"
            >
              Price in NEAR
            </Text>
            <Text
              as="h2"
              color="gray.400"
              fontSize="l"
              fontWeight="normal"
              my="4px"
              textAlign="left"
            >
              {!isSellError && nearPrice !== undefined?
               ` (~$${roundNumber(nearPrice*nearInput)} USD)`:""}
            </Text>
          </HStack>
            <Input type="number" value={input} onChange={handleInputChange} />
            {!isSellError ? (
              event.maxNearPrice >= nearInput && nearInput >= MIN_NEAR_SELL ?
              (
                  <FormLabel marginTop="2" color="red.400" fontSize="sm" lineHeight="normal">
                    You will receive $NEAR, not USD when sold.
                  </FormLabel>
              ) : event.maxNearPrice < nearInput ? (
                  <FormErrorMessage> Over max price of {roundNumber(event.maxNearPrice)} NEAR.</FormErrorMessage>
                ) : (
                  <FormErrorMessage> Under min price of {roundNumber(MIN_NEAR_SELL)} NEAR.</FormErrorMessage>
                )
            ) : (
              <FormErrorMessage> Must be a valid number </FormErrorMessage>
            )}
            
          </FormControl>

          <Box my="5"></Box>
          <Button isDisabled={disableSellButton(input, event.maxNearPrice, isSellError)} type="submit" w="100%">
            Put Ticket For Sale
          </Button>
        </Form>)}
        { !ticketSellStartDateValid && (
          <Text
          as="h2"
          color="red.400"
          fontSize="l"
          fontWeight="bold"
          my="4px"
          textAlign="left"
        >
          Ticket sell date has not started.
        </Text>
        )}
        { !ticketSellEndDateValid && (
          <Text
          as="h2"
          color="red.400"
          fontSize="l"
          fontWeight="bold"
          my="4px"
          textAlign="left"
        >
          Ticket sell date has passed.
        </Text>
        )}

        <ModalFooter>
          <Button variant={'secondary'} w="100%" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
