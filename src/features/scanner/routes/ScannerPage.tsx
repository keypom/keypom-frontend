/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

import { ViewFinder } from '@/components/ViewFinder';
import keypomInstance from '@/lib/keypom';
import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
import { get, set } from '@/utils/localStorage';

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
  const { setAppModal } = useAppContext();
  const {
    isOpen: isResultModalOpen,
    onOpen: onResultModalOpen,
    onClose: onResultModalClose,
  } = useDisclosure();
  const [isClaimRetry, setIsClaimRetry] = useState<boolean>(false);
  const [ticketRes, setTicketRes] = useState<TicketResult | null>(null);
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [isTxSuccess, setIsTxSuccess] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [txError, setTxError] = useState('');

  const getSecretKeyAndContractId = (qrText: string): TicketResult | null => {
    try {
      return JSON.parse(qrText);
    } catch (err) {
      setTxError('QR code is invalid. It should contain secret key and contract Id.');
    }

    return null;
  };

  const handleTicketClaim = async (secretKey: string, password: string) => {
    try {
      await keypomInstance.claimTicket(secretKey, password);
      // we already closed the modal
    } catch (err) {
      if (
        err.message === 'Ticket has already been claimed' ||
        err.message === 'RVSP first to enter'
      ) {
        setTxError(err.message);
        setIsTxLoading(false);
        return;
      }
      setIsClaimRetry(true);
      setIsTxLoading(false);
      onResultModalClose();
      setPasswordErrorText(err.message);
      onPasswordModalOpen();
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

    setIsTxLoading(true);
    setTxError('');
    setPasswordErrorText('');
    setIsClaimRetry(false);
    setIsTxSuccess(false);
    onResultModalOpen();

    if (result && result?.text === '') {
      setTxError('QR code is invalid');
      scanningResultInProgress = false;
      return;
    }

    if (error !== undefined) {
      console.error(error);
      setIsTxLoading(false);
      setTxError('Error parsing QR code');
      scanningResultInProgress = false;
      return;
    }

    const ticketRes = getSecretKeyAndContractId(result.text);
    if (ticketRes === null) {
      console.error('Error parsing QR code');
      setIsTxLoading(false);
      scanningResultInProgress = false;
      return;
    }

    const { contractId, secretKey } = ticketRes;
    setTicketRes(ticketRes);

    try {
      console.log(contractId, secretKey);
      const remainingUses = await keypomInstance.checkTicketRemainingUses(contractId, secretKey);

      switch (remainingUses) {
        case 0:
        case 1:
          throw new Error('Ticket has already been claimed');
        case 3:
          throw new Error('RVSP first to enter');
        default:
      }
    } catch (err) {
      console.error(err);
      setTxError(err.message);
      setIsTxLoading(false);
      return;
    }

    const password = get(SCANNER_PASSWORD_KEY);

    setIsTxSuccess(true);
    setIsTxLoading(false);
    onResultModalOpen();

    // we don't await it, because it takes to long...
    handleTicketClaim(secretKey, password)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        setAppModal({
          isOpen: true,
          header: 'ERROR Scanning Previous Ticket!',
          message: `Please try scanning the ticket again, otherwise the person will not be able to claim their gift until they are scanned successfully!`,
          options: [
            {
              label: 'Ok',
            },
          ],
        });
      })
      .finally(() => {
        scanningResultInProgress = false;
      });
    // yaaaa we can scan more tickets and everything looks super fast!
  };

  const openResultModal = () => {
    let message = '';
    const options: AppModalOptions[] = [];
    if (isTxSuccess) {
      message = 'Ticket is valid!';
      options.push({
        label: 'Ok',
        func: () => {
          scanningResultInProgress = false;
          console.log('tx acknowledged');
        },
      });
    }
    if (txError) {
      message = txError;
      options.push({
        label: 'Ok',
        func: () => {
          scanningResultInProgress = false;
          console.log('error acknowledged');
        },
      });
    }

    setAppModal({
      isOpen: true,
      isLoading: isTxLoading,
      isError: Boolean(txError),
      isSuccess: isTxSuccess,
      message,
      options,
    });
  };

  const handlePasswordSaveClick = (password: string) => {
    set(SCANNER_PASSWORD_KEY, password ?? '');
    onPasswordModalClose();
    if (isClaimRetry) {
      // eslint-disable-next-line
      handleScanResult({ text: JSON.stringify(ticketRes) }, undefined);
    }
  };

  const openPasswordWarning = () => {
    setAppModal({
      isOpen: true,
      header: 'No password has been set!',
      message: `You won't be able to scan tickets without setting a password. Click ok to continue.`,
      options: [
        {
          lazy: true,
          label: 'Ok',
          func: openPasswordModal,
        },
      ],
    });
  };

  const openPasswordModal = () => {
    setAppModal({
      isOpen: true,
      header: 'Enter your password',
      message: passwordErrorText || '',
      inputs: [
        {
          placeholder: 'Password',
          valueKey: 'password',
        },
      ],
      options: [
        {
          lazy: true,
          label: 'Cancel',
          func: () => {
            const cachedPassword = get(SCANNER_PASSWORD_KEY);
            if (!!cachedPassword && cachedPassword.length > 0) return;
            openPasswordWarning();
          },
        },
        {
          lazy: true,
          label: 'Ok',
          func: ({ password }) => {
            if (password?.length > 0) {
              handlePasswordSaveClick(password.trim());
              return;
            }
            openPasswordWarning();
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (isPasswordModalOpen) {
      openPasswordModal();
    }
  }, [isPasswordModalOpen, passwordErrorText]);

  useEffect(() => {
    if (isResultModalOpen) {
      openResultModal();
    }
  }, [isTxLoading, isTxSuccess, isResultModalOpen, txError]);

  useEffect(() => {
    onPasswordModalOpen();
  }, []);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Scanner</Heading>
          {/** keypom scanner placeholder */}
          <Center h={{ base: '280px', md: '440px' }} w={{ base: '280px', md: '440px' }}>
            <QrReader
              constraints={{ facingMode: 'environment' }}
              containerStyle={{ width: '100%', height: '100%' }}
              scanDelay={1000}
              ViewFinder={() => <ViewFinder />}
              onResult={handleScanResult}
            />
          </Center>
          {/* )} */}

          <Button
            mt={4}
            onClick={() => {
              setAppModal({
                isOpen: true,
                header: 'Your scanner password is:',
                message: get(SCANNER_PASSWORD_KEY),
                options: [
                  {
                    label: 'Ok',
                  },
                ],
              });
            }}
          >
            What's my password?
          </Button>

          <Button
            mt={4}
            onClick={() => {
              openPasswordModal();
            }}
          >
            Enter password
          </Button>

          {/* <Button
            mt={4}
            onClick={() => {
              set(SCANNER_PASSWORD_KEY, '')
            }}
          >
            Clear password
          </Button> */}
        </VStack>
      </Center>
    </Box>
  );
};

export default Scanner;
