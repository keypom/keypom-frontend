/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';

import { EnterPasswordModal } from '../components/EnterPasswordModal';
import { ResultModal } from '../components/ResultModal';

export const gas = '100000000000000';
const SCANNER_PASSWORD_KEY = 'scanner_password';

interface TicketResult {
  secretKey: string;
  contractId: string;
}

// To stop concurrent scan result handling
let scanningResultInProgress = false;

const Scanner = () => {
  const {
    isOpen: isPasswordModalOpen,
    onOpen: onPasswordModalOpen,
    onClose: onPasswordModalClose,
  } = useDisclosure();
  const {
    isOpen: isResultModalOpen,
    onOpen: onResultModalOpen,
    onClose: onResultModalClose,
  } = useDisclosure();
  const [password, setPassword] = useState<string | null>('');
  const [isClaimRetry, setIsClaimRetry] = useState<boolean>(false);
  const [ticketRes, setTicketRes] = useState<TicketResult | null>(null);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [isTxSuccess, setIsTxSuccess] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [resultModalErrorText, setResultModalErrorText] = useState('');

  const getSecretKeyAndContractId = (qrText: string): TicketResult | null => {
    try {
      return JSON.parse(qrText);
    } catch (err) {
      setResultModalErrorText('QR code is invalid. It should contain secret key and contract Id.');
    }

    return null;
  };

  const handleTicketClaim = async (secretKey: string) => {
    try {
      await keypomInstance.claimTicket(secretKey, password as string);
      console.log('claim is valid');
      setIsTxLoading(false);
      setIsTxSuccess(true);
      onResultModalOpen();
      scanningResultInProgress = false;
    } catch (err) {
      if (
        err.message === 'Ticket has already been claimed' ||
        err.message === 'RVSP first to enter'
      ) {
        setResultModalErrorText(err.message);
        setIsTxLoading(false);
        scanningResultInProgress = false;
        return;
      }

      setIsClaimRetry(true);
      setPasswordErrorText(err.message);
      onPasswordModalOpen();
      onResultModalClose();
      setIsTxLoading(true);
      scanningResultInProgress = false;
    }
  };

  const handleScanResult = async (result, error) => {
    if (scanningResultInProgress) {
      return;
    }

    scanningResultInProgress = true;
    if (result === undefined) {
      scanningResultInProgress = false;
      return;
    }

    setResultModalErrorText('');
    setPasswordErrorText('');
    setIsClaimRetry(false);
    setIsTxSuccess(false);
    setIsTxLoading(true);
    onResultModalOpen();

    if (result?.text === '') {
      setResultModalErrorText('QR code is invalid');
      scanningResultInProgress = false;
      return;
    }

    if (password === undefined || password === null || password === '') {
      setResultModalErrorText('Password is empty');
      scanningResultInProgress = false;
      return;
    }

    if (error !== undefined) {
      console.error(error);
      setResultModalErrorText('Error parsing QR code');
      scanningResultInProgress = false;
      return;
    }

    const ticketRes = getSecretKeyAndContractId(result.text);
    if (ticketRes === null) {
      console.error('Error parsing QR code');
      setResultModalErrorText('Error parsing QR code');
      scanningResultInProgress = false;
      return;
    }

    const { contractId, secretKey } = ticketRes;
    setTicketRes(ticketRes);

    try {
      await keypomInstance.checkTicketRemainingUses(contractId, secretKey);
    } catch (err) {
      setResultModalErrorText(err.message);
      setIsTxLoading(false);
      scanningResultInProgress = false;
      return;
    }

    await handleTicketClaim(secretKey);
  };

  // When modal OK button is clicked, saves password to localStorage and if retrying a claim, retries a claim
  const handlePasswordSave = async () => {
    localStorage.setItem(SCANNER_PASSWORD_KEY, password ?? '');
    onPasswordModalClose();

    if (isClaimRetry) {
      onResultModalOpen();
      await handleTicketClaim(ticketRes?.secretKey as string);
      onPasswordModalClose();
    }
  };

  // When modal Cancel button is clicked, reuse the password from local storage
  const handlePasswordCancel = () => {
    setPassword(localStorage.getItem(SCANNER_PASSWORD_KEY));
    onPasswordModalClose();
  };

  useEffect(() => {
    onPasswordModalOpen();
  }, []);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Scanner</Heading>
          {/** keypom scanner placeholder */}
          {password !== '' && (
            <Center h={{ base: '280px', md: '440px' }} w={{ base: '280px', md: '440px' }}>
              <QrReader
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%' }}
                scanDelay={2000}
                ViewFinder={() => <ViewFinder />}
                onResult={handleScanResult}
              />
            </Center>
          )}
        </VStack>
      </Center>

      <EnterPasswordModal
        handleCancelClick={handlePasswordCancel}
        handleOkClick={handlePasswordSave}
        isOpen={isPasswordModalOpen}
        modalErrorText={passwordErrorText}
        passwordOnChange={(val) => {
          setPassword(val);
        }}
        onClose={onPasswordModalClose}
      />

      <ResultModal
        errorText={resultModalErrorText}
        isLoading={isTxLoading}
        isOpen={isResultModalOpen}
        isSuccess={isTxSuccess}
        onClose={onResultModalClose}
      />
    </Box>
  );
};

export default Scanner;
