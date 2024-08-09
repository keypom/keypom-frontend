import {
  Modal,
  ModalOverlay,
  InputGroup,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Box,
  Grid,
  GridItem,
  Spinner,
  FormControl,
  Input,
  FormErrorMessage,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { accountExists } from '@keypom/core';

import keypomInstance from '@/lib/keypom';
import { DeleteTextIcon } from '@/components/Icons/DeleteTextIcon';
import { conferenceFooterMenuIndexes, useConferenceContext } from '@/contexts/ConferenceContext';
import { CameraIcon } from '@/components/Icons/CameraIcon';

import { formatTokensAvailable } from '../AssetsPages/AssetsHome';

interface ProfileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialSendTo?: string;
}

const ProfileTransferModal = ({
  isOpen,
  onClose,
  title,
  initialSendTo = '',
}: ProfileTransferModalProps) => {
  const {
    eventInfo,
    accountId: curAccountId,
    secretKey,
    onSelectTab,
    factoryAccount,
    ticker,
    setTriggerRefetch,
  } = useConferenceContext();

  const [sendTo, setSendTo] = useState(initialSendTo);
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [tokensAvailable, setTokensAvailable] = useState('0');
  const [isValidAccount, setIsValidAccount] = useState(true);
  const [isOversend, setIsOversend] = useState(false);
  const [isInvalidNumber, setIsInvalidNumber] = useState(false);
  const toast = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchBalance = async () => {
    const balance = await keypomInstance.viewCall({
      contractId: factoryAccount,
      methodName: 'ft_balance_of',
      args: { account_id: curAccountId },
    });
    setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
  };

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur(); // Remove focus from the input when modal opens
        }
      }, 100); // Delay to ensure modal is fully open
    }
  }, [isOpen]);

  const handleChangeUsername = (event) => {
    setIsValidAccount(true);
    const { value } = event.target;
    setSendTo(value.toLowerCase());
  };

  const closeModal = () => {
    setAmount('');
    setIsSending(false);
    setIsValidAccount(true);
    setIsOversend(false);
    setIsInvalidNumber(false);
    onClose();
  };

  const checkInvalidNumber = () => {
    if (!amount || amount === undefined || amount.length === 0 || parseFloat(amount) <= 0) {
      setIsInvalidNumber(true);
      return true;
    }
    setIsInvalidNumber(false);
    return false;
  };

  const handleConfirm = async () => {
    const accountId = `${sendTo}.${factoryAccount}`;
    const validAccount = await checkAccountValidity(accountId);
    if (!validAccount) {
      setIsValidAccount(false);
      setIsSending(false);
      return;
    }

    if (parseFloat(amount) > parseFloat(tokensAvailable)) {
      setIsOversend(true);
      setIsSending(false);
      return;
    }

    if (checkInvalidNumber()) {
      setIsSending(false);
      return;
    }

    try {
      setIsSending(true);
      await keypomInstance.sendConferenceTokens({
        secretKey,
        accountId: curAccountId,
        sendTo: accountId,
        amount: keypomInstance.nearToYocto(amount)!,
        factoryAccount,
      });
      toast({
        title: 'Transfer successful',
        description: `Successfully transferred ${amount} tokens to ${sendTo.split('.')[0]}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTriggerRefetch((prev) => prev + 1); // Trigger a refetch after successful transfer
    } catch (error) {
      toast({
        title: 'Transfer failed',
        description: 'An error occurred during the transfer. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
      closeModal();
    }
  };

  const checkAccountValidity = async (account: string) => {
    if (!account) {
      return false;
    }
    return await accountExists(account);
  };

  useEffect(() => {
    if (amount && parseFloat(amount) <= parseFloat(tokensAvailable)) {
      setIsOversend(false);
    }
    setIsInvalidNumber(false);
  }, [amount, tokensAvailable]);

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  const handleKeypadClick = (value: string) => {
    setAmount((prev) => {
      if (value === 'backspace') {
        const [integerPart, decimalPart] = prev.split('.');
        if (decimalPart === undefined || decimalPart.length === 0) {
          return integerPart.slice(0, -1);
        }
        if (decimalPart.length === 1) {
          return integerPart;
        }
        return prev.slice(0, -1);
      }
      if (value === '.' && prev.includes('.')) {
        return prev;
      }
      const newAmount = prev + value;
      if (newAmount.includes('.') && newAmount.split('.')[1].length > 4) {
        return prev;
      }
      return newAmount;
    });
  };

  const formatAmount = (amount: string) => {
    if (!amount) return '0.00';
    const [integerPart, decimalPart] = amount.split('.');
    if (decimalPart === undefined) return integerPart;
    if (integerPart.length === 0 && decimalPart.length === 0) return '0.00';
    if (decimalPart.length === 0) return parseFloat(amount).toFixed(1);
    if (decimalPart.length <= 4) return parseFloat(amount).toFixed(decimalPart.length);
    return parseFloat(amount).toFixed(4);
  };

  const checkUsernameAvailable = async () => {
    if (!sendTo) {
      return false;
    }
    const accountId = `${sendTo}.${factoryAccount}`;
    console.log('Checking username', accountId);
    const doesExist = await accountExists(accountId);
    console.log('Does exist', doesExist);
    if (!doesExist || accountId === curAccountId) {
      setIsValidAccount(false);
      return false;
    }
    return true;
  };

  // Function to make the phone vibrate
  const vibratePhone = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100); // vibrates for 100ms
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent
        bg={modalBackground}
        mx={3}
        p={modalPadding}
        position="relative"
        textAlign="center"
      >
        <Box filter={isSending ? 'blur(3px)' : 'none'} transition="filter 0.2s">
          <ModalHeader pb={2} pt={6}>
            <VStack pb="2" spacing="1">
              <Text
                color="event.h1"
                fontFamily="heading"
                fontSize="3xl"
                fontWeight="600"
                textAlign="center"
              >
                {title}
              </Text>
              <Text fontFamily="heading" fontSize="sm" fontWeight="400" textAlign="center" w="full">
                Available Balance: {formatTokensAvailable(tokensAvailable)} ${ticker}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <VStack pb="4" spacing="1" w="full">
              <Text
                color="event.h2"
                fontFamily="heading"
                fontSize="md"
                fontWeight="500"
                textAlign="center"
              >
                {sendTo ? `Sending to:` : 'Enter username or scan profile QR code'}
              </Text>
              <FormControl isInvalid={!isValidAccount} mb="5">
                <InputGroup>
                  <Input
                    ref={inputRef}
                    autoComplete="off"
                    backgroundColor="white"
                    border="1px solid"
                    borderColor={!isValidAccount ? 'red.500' : 'event.h3'}
                    borderRadius="12px"
                    color="black"
                    fontFamily="heading"
                    fontSize={{ base: '16px', md: 'md' }} // Ensure a base font size of 16px to prevent zooming
                    fontWeight="400"
                    height={{ base: '38px', md: '48px' }}
                    id="username"
                    placeholder="Username"
                    px="6"
                    sx={{
                      '::placeholder': {
                        color: 'black', // Placeholder text color
                      },
                    }}
                    value={sendTo}
                    onBlur={checkUsernameAvailable}
                    onChange={(event) => {
                      handleChangeUsername(event);
                      vibratePhone();
                    }}
                  />
                  <InputRightElement height="100%" width="3rem">
                    <Box
                      alignItems="center"
                      display="flex"
                      height="100%"
                      justifyContent="center"
                      onClick={() => {
                        onSelectTab(conferenceFooterMenuIndexes.scan);
                      }}
                    >
                      <CameraIcon color="black" h="18px" strokeWidth="2" w="28px" />
                    </Box>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {!isValidAccount && sendTo === curAccountId.split('.')[0]
                    ? 'Cannot send to yourself'
                    : `User '${sendTo}' does not exist.`}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack spacing={8}>
              <VStack spacing="1">
                <Text color="event.h2" fontFamily="heading" fontSize="5xl" fontWeight="500">
                  {formatAmount(amount)}
                </Text>
                {isOversend && <Text color="red.500">Insufficient balance.</Text>}
                {isInvalidNumber && <Text color="red.500">Invalid number.</Text>}
              </VStack>
              <Grid gap={3} templateColumns="repeat(3, 1fr)" w="full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(
                  (num, idx) => (
                    <GridItem key={idx}>
                      {num === 'backspace' ? (
                        <Button
                          _active={{ bg: 'gray.300' }}
                          _focus={{ boxShadow: 'none', bg: 'white' }}
                          _hover={{ bg: 'gray.100' }}
                          bg="white"
                          color="black"
                          h="12"
                          size="lg"
                          transition="background-color 0.1s ease"
                          w="full"
                          onClick={() => {
                            handleKeypadClick(num);
                          }}
                        >
                          <DeleteTextIcon boxSize="1.5em" />
                        </Button>
                      ) : (
                        <Button
                          _active={{ bg: 'gray.300' }}
                          _focus={{ boxShadow: 'none', bg: 'white' }}
                          _hover={{ bg: 'gray.100' }}
                          bg="white"
                          border="2px solid transparent"
                          borderColor={num === '.' ? 'white' : 'gray.100'}
                          borderRadius="0.75em"
                          color="event.h2"
                          fontFamily="heading"
                          fontSize="xl"
                          fontWeight="500"
                          h="12"
                          size="lg"
                          transition="background-color 0.1s ease"
                          w="full"
                          onClick={() => {
                            handleKeypadClick(num);
                          }}
                        >
                          {num}
                        </Button>
                      )}
                    </GridItem>
                  ),
                )}
              </Grid>
            </VStack>
          </ModalBody>
          <ModalFooter flexDirection="column" pb={6} pt={0}>
            <VStack spacing="3" w="full">
              <Button
                backgroundColor="event.button.primary.bg"
                color="event.button.primary.color"
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="500"
                h="48px"
                sx={{
                  _hover: {
                    backgroundColor: 'event.button.primary.hover',
                  },
                }}
                isDisabled={isSending || sendTo.length === 0}
                variant="outline"
                w="full"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                backgroundColor="gray.800"
                color="event.button.primary.color"
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="500"
                h="48px"
                sx={{
                  _hover: {
                    backgroundColor: 'event.button.primary.hover',
                  },
                }}
                isDisabled={isSending}
                variant="outline"
                w="full"
                onClick={closeModal}
              >
                Close
              </Button>
            </VStack>
          </ModalFooter>
        </Box>
        {isSending && (
          <Box
            alignItems="center"
            borderRadius="md"
            bottom="0"
            display="flex"
            justifyContent="center"
            left="0"
            position="absolute"
            right="0"
            top="0"
            zIndex="1"
          >
            <Spinner
              color="blue.500"
              emptyColor="gray.200"
              size="xl"
              speed="0.65s"
              thickness="4px"
            />
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileTransferModal;
