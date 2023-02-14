/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

import { ViewFinder } from '@/components/ViewFinder';
import { TextInput } from '@/components/TextInput';
import keypomInstance from '@/lib/keypom';

export const gas = '100000000000000';
const SCANNER_PASSWORD_KEY = 'scanner_password';

interface TicketResult {
  secretKey: string;
  contractId: string;
}

const Scanner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [valid, setValid] = useState<string | boolean | null>(null);
  const [password, setPassword] = useState<string | null>('');
  const [isClaimRetry, setIsClaimRetry] = useState<boolean>(false);
  const [ticketRes, setTicketRes] = useState<TicketResult | null>(null);
  const [modalErrorText, setModalErrorText] = useState('');

  const getSecretKeyAndContractId = (qrText: string): TicketResult | null => {
    try {
      return JSON.parse(qrText);
    } catch (err) {
      setValid('QR code is invalid. It should contain secret key and contract Id.');
    }

    return null;
  };

  const handleScanResult = async (result, error) => {
    if (result === undefined || result?.text === '') {
      setValid('QR code is invalid.');
      return;
    }

    if (password === undefined || password === null || password === '') {
      setValid('Password is empty');
    }

    if (error !== undefined) {
      console.error(error);
    }

    const ticketRes = getSecretKeyAndContractId(result.text);
    if (ticketRes === null) return;

    const { contractId, secretKey } = ticketRes;
    setTicketRes(ticketRes);

    try {
      await keypomInstance.checkTicketRemainingUses(contractId, secretKey);
      setValid(true);
    } catch (err) {
      setValid(err.message);
    }

    try {
      await keypomInstance.claimTicket(secretKey, password as string);
    } catch (err) {
      if (err.message === 'Ticket should have remaining 1 use') {
        setValid(err.message);
        return;
      }

      setIsClaimRetry(true);
      setModalErrorText(err.message);
      onOpen();
    }
  };

  const handleClaimRetry = async () => {
    try {
      await keypomInstance.claimTicket(ticketRes?.secretKey as string, password as string);
      setValid(true);
      setModalErrorText('');
      setIsClaimRetry(false);
    } catch (err) {
      if (err.message === 'Ticket should have remaining 1 use') {
        setValid(err.message);
        return;
      }

      setModalErrorText(err.message);
      onOpen();
    }
  };

  // When modal OK button is clicked, saves password to localStorage and if retrying a claim, retries a claim
  const handlePasswordSave = async () => {
    localStorage.setItem(SCANNER_PASSWORD_KEY, password ?? '');

    if (isClaimRetry) {
      await handleClaimRetry();
      onClose();
      return;
    }

    onClose();
  };

  // When modal Cancel button is clicked, reuse the password from local storage
  const handlePasswordCancel = () => {
    setPassword(localStorage.getItem(SCANNER_PASSWORD_KEY));
    onClose();
  };

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Scanner</Heading>
          {/** keypom scanner placeholder */}
          {valid === null && (
            <Center h={{ base: '280px', md: '440px' }} w={{ base: '280px', md: '440px' }}>
              <QrReader
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%' }}
                ViewFinder={() => <ViewFinder />}
                onResult={handleScanResult}
              />
            </Center>
          )}
          <Center>
            {valid === null && <Badge colorScheme="yellow">Scan Ticket</Badge>}
            {valid === true && <Badge colorScheme="green">Valid Ticket</Badge>}
            {valid === false && <Badge colorScheme="red">Invalid Ticket</Badge>}
            {typeof valid === 'string' && <Badge colorScheme="red">{valid}</Badge>}
          </Center>
        </VStack>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            {modalErrorText !== '' && <Text variant="error">{modalErrorText}</Text>}
            <TextInput
              label="Enter password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handlePasswordSave}>
              Ok
            </Button>
            <Button variant="ghost" onClick={handlePasswordCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Scanner;
