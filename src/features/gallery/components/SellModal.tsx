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
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { MIN_NEAR_SELL } from '@/constants/common';

import { type SellDropInfo } from '@/pages/Event';
import { useAppContext } from '@/contexts/AppContext';

interface SellModalProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => Promise<void>;
  event: SellDropInfo;
}

const disableButton = (nearInput: string, maxNearPrice: number, isError: boolean) => {
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
  const isError = input === '';
  const nearInput = parseFloat(input);
  console.log("Here")
  console.log(event.salesValidThrough)
  console.log(Date())
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

        <Form action="/" onSubmit={onSubmit}>
          <FormControl isInvalid={disableButton(input, event.maxNearPrice, isError)}>
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
              {!isError && nearPrice !== undefined?
               ` (~$${roundNumber(nearPrice*nearInput)} USD)`:""}
            </Text>
          </HStack>
            <Input type="number" value={input} onChange={handleInputChange} />
            {!isError ? (
              event.maxNearPrice >= nearInput && nearInput >= MIN_NEAR_SELL ?
              (
                <FormHelperText>
                  This ticket will be listed on the secondary market for {input} NEAR
                </FormHelperText>
              ) : event.maxNearPrice < nearInput ? (
                  <FormErrorMessage> Over max price of {roundNumber(event.maxNearPrice)} NEAR</FormErrorMessage>
                ) : (
                  <FormErrorMessage> Under min price of {roundNumber(MIN_NEAR_SELL)} NEAR</FormErrorMessage>
                )
            ) : (
              <FormErrorMessage> Must be a valid number </FormErrorMessage>
            )}
          </FormControl>

          <Box my="5"></Box>
          <Button isDisabled={disableButton(input, event.maxNearPrice, isError)} type="submit" w="100%">
            Put Ticket For Sale
          </Button>
        </Form>

        <ModalFooter>
          <Button variant={'secondary'} w="100%" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
