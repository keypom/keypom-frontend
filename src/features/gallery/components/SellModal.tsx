import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  HStack,
  useToast,
  VStack,
  StackDivider,
  Image,
  Heading,
  Button,
  Input,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';

import { MIN_NEAR_SELL } from '@/constants/common';
import { type ResaleTicketInfo, type EventInterface } from '@/pages/Event';
import { useAppContext } from '@/contexts/AppContext';
import {
  validateDateAndTime,
  validateEndDateAndTime,
  validateStartDateAndTime,
} from '@/features/scanner/components/helpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';
import { FormControl } from '@/components/FormControl';

interface SellModalProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => Promise<void>;
  saleInfo: ResaleTicketInfo;
  event: EventInterface;
}

const disableSellButton = (nearInput: string, maxNearPrice: number, isError: boolean) => {
  const nearInputNum = parseFloat(nearInput);
  return (
    isError || isNaN(nearInputNum) || nearInputNum > maxNearPrice || nearInputNum < MIN_NEAR_SELL
  );
};

const roundNumber = (num: number) => {
  return num.toFixed(2);
};

export const SellModal = ({
  input,
  setInput,
  isOpen,
  onClose,
  onSubmit,
  saleInfo,
  event,
}: SellModalProps) => {
  const { nearPrice } = useAppContext();
  // price input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && parseFloat(inputValue) > saleInfo.maxNearPrice) {
      setInput(saleInfo.maxNearPrice.toString()); // Clamp to max price
    } else if (!isNaN(inputValue) && parseFloat(inputValue) < MIN_NEAR_SELL) {
      setInput(MIN_NEAR_SELL.toString()); // Clamp to min price
    } else {
      setInput(inputValue);
    }
  };

  console.log('saleInfo', saleInfo);
  console.log('event', event);

  // Check if the ticket is valid to sell.
  const ticketSellStartDateValid = validateStartDateAndTime(saleInfo.salesValidThrough);
  const ticketSellEndDateValid = validateEndDateAndTime(saleInfo.salesValidThrough);
  const ticketSellDateValid = validateDateAndTime(saleInfo.salesValidThrough);

  const isSellError = input === '' || !ticketSellDateValid;
  const nearInput = parseFloat(input);

  const [isTicketValidToastOpen, setIsTicketValidToastOpen] = useState(false);
  const ticketSellNotValidToast = useToast();

  const showToast = () => {
    if (!isTicketValidToastOpen) {
      setIsTicketValidToastOpen(true);
      ticketSellNotValidToast({
        title: ticketSellStartDateValid
          ? 'Ticket sell date has not started.'
          : 'Ticket sell date has passed.',
        description: `Tickets be can sold during: ${dateAndTimeToText(
          saleInfo.salesValidThrough,
        )}.`,
        status: 'error',
        duration: null,
        isClosable: true,
        onCloseComplete: () => {
          setIsTicketValidToastOpen(false);
        },
      });
    }
  };

  // Display not valid
  if (!ticketSellDateValid) {
    showToast();
  }

  const modalSize = '3xl';
  const modalPadding = { base: '8', md: '16' };
  const modalHeight = { base: '95vh', md: 'auto' };

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size={modalSize}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH={modalHeight} overflow="hidden" overflowY="auto" p={modalPadding}>
        <ModalCloseButton size="lg" />
        <VStack w="full">
          <VStack
            align="stretch"
            borderColor="gray.200"
            divider={<StackDivider borderColor="gray.200" />}
            spacing="6"
            w="full"
          >
            <Image
              alt={`Event image for ${saleInfo.name}`}
              borderRadius="md"
              maxH="250px"
              objectFit="cover"
              src={saleInfo.artwork}
              w="full"
            />
            <VStack align="stretch" spacing="4">
              <Heading as="h3" fontSize="2xl" fontWeight="bold">
                {saleInfo.name}
              </Heading>
              <Text color="gray.600" fontSize="md">
                {saleInfo.description}
              </Text>
              <HStack justifyContent="space-between" pt="4">
                <Text color="gray.800" fontSize="lg" fontWeight="semibold">
                  Admission Date
                </Text>
                <Text color="gray.500" fontSize="lg">
                  {dateAndTimeToText(saleInfo.salesValidThrough)}
                </Text>
              </HStack>
              {ticketSellDateValid && (
                <>
                  <FormControl
                    isInvalid={disableSellButton(input, saleInfo.maxNearPrice, isSellError)}
                  >
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
                        {!isSellError && nearPrice !== undefined
                          ? ` (~$${roundNumber(nearPrice * nearInput)} USD)`
                          : ''}
                      </Text>
                    </HStack>
                    <Input type="number" value={input} onChange={handleInputChange} />
                    {!isSellError ? (
                      saleInfo.maxNearPrice >= nearInput && nearInput >= MIN_NEAR_SELL ? (
                        <FormLabel color="gray.400" fontSize="sm" lineHeight="normal" marginTop="2">
                          You will receive $NEAR, not USD when sold.
                        </FormLabel>
                      ) : saleInfo.maxNearPrice < nearInput ? (
                        <FormErrorMessage>
                          {' '}
                          Over max price of {roundNumber(saleInfo.maxNearPrice)} NEAR.
                        </FormErrorMessage>
                      ) : (
                        <FormErrorMessage>
                          {' '}
                          Under min price of {roundNumber(MIN_NEAR_SELL)} NEAR.
                        </FormErrorMessage>
                      )
                    ) : (
                      <FormErrorMessage> Must be a valid number </FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    isDisabled={disableSellButton(input, saleInfo.maxNearPrice, isSellError)}
                    type="submit"
                    w="100%"
                    onClick={onSubmit}
                  >
                    Put Ticket For Sale
                  </Button>
                </>
              )}
              {!ticketSellStartDateValid && (
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
              {!ticketSellEndDateValid && (
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
            </VStack>
          </VStack>
        </VStack>
        <Box paddingTop="6" w="full">
          <Button variant={'secondary'} w="100%" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};
