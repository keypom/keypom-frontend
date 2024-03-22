/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { type OnResultFunction, QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { getPubFromSecret } from 'keypom-js';

import keypomInstance from '@/lib/keypom';
import { type FunderEventMetadata, type EventDrop } from '@/lib/eventsHelpers';
import { useTicketScanningParams } from '@/hooks/useTicketScanningParams';
import { NotFound404 } from '@/components/NotFound404';
import { ViewFinder } from '@/components/ViewFinder';

const Scanner = () => {
  const { funderId, eventId } = useTicketScanningParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [facingMode, setFacingMode] = useState('user'); // default to rear camera
  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [ticketOptions, setTicketOptions] = useState<Array<{ dropId: string; name: string }>>([
    { dropId: '', name: 'All Tickets' },
  ]);
  const [isErr, setIsErr] = useState(false);
  const [ticketToVerify, setTicketToVerify] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (eventId === '' || funderId === '') navigate('/drops');
    if (!eventId || !funderId) return;

    const getEventData = async () => {
      try {
        const eventInfo: FunderEventMetadata = await keypomInstance.getEventInfo({
          accountId: funderId,
          eventId,
        });
        if (Object.keys(eventInfo).length === 0) {
          setIsErr(true);
          return;
        }
        setEventInfo(eventInfo);
      } catch (e) {
        console.error(e);
        setIsErr(true);
      }
    };

    getEventData();
  }, [eventId, funderId]);

  useEffect(() => {
    if (eventId === '' || funderId === '') navigate('/drops');
    if (!eventId || !funderId) return;

    const getEventTickets = async () => {
      try {
        const ticketsReturned: EventDrop[] = await keypomInstance.getTicketsForEventId({
          accountId: funderId,
          eventId,
        });
        const ticketOptions: Array<{ dropId: string; name: string }> = [
          { dropId: '', name: 'All Tickets' },
        ];
        ticketsReturned.forEach((ticket) => {
          ticketOptions.push({
            dropId: ticket.drop_id,
            name: ticket.drop_config.nft_keys_config.token_metadata.title,
          });
        });
        setTicketOptions(ticketOptions);
      } catch (e) {
        console.error(e);
        setIsErr(true);
      }
    };

    getEventTickets();
  }, [eventId, funderId]);

  useEffect(() => {
    if (scanStatus) {
      toast({
        title: scanStatus === 'success' ? 'Success' : 'Error',
        description: statusMessage,
        status: scanStatus,
        duration: 5000,
        isClosable: true,
      });
      // Reset the status after showing the message
      setTimeout(() => {
        setScanStatus(null);
      }, 5000);
    }
  }, [scanStatus, statusMessage, toast]);

  const getDropFromSecretKey = async (secretKey: string): Promise<EventDrop | null> => {
    try {
      const pubKey = getPubFromSecret(secretKey);
      const keyInfo: { drop_id: string } = await keypomInstance.viewCall({
        methodName: 'get_key_information',
        args: { key: pubKey },
      });
      const drop: EventDrop = await keypomInstance.viewCall({
        methodName: 'get_drop_information',
        args: { drop_id: keyInfo.drop_id },
      });
      return drop;
    } catch (e) {
      return null;
    }
  };

  const validateTicket = (drop: EventDrop): boolean => {
    return true;
  };

  const handleScanResult: OnResultFunction = async (result) => {
    if (result && !isScanning) {
      setIsScanning(true); // Start scanning
      try {
        const secretKey = result.text;
        const drop = await getDropFromSecretKey(secretKey as string);
        if (drop) {
          // Suppose you have a function to validate the ticket
          if (validateTicket(drop)) {
            setScanStatus('success');
            setStatusMessage('Ticket is valid and scanned successfully!');
          } else {
            setScanStatus('error');
            setStatusMessage('Invalid ticket. Please try again.');
          }
        } else {
          setScanStatus('error');
          setStatusMessage('No ticket information found.');
        }
      } catch (error) {
        console.error('Scan failed', error);
        setScanStatus('error');
        setStatusMessage('Error scanning the ticket. Please try again.');
      } finally {
        setIsScanning(false); // End scanning regardless of success or error
      }
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Event Not Found"
        subheader="Please check the URL and try again."
      />
    );
  }

  // You could define a function to get the selected ticket name for display
  const getSelectedTicketName = () => {
    return `Select Ticket To Scan`;
  };

  return (
    <Box marginTop="6" mb={{ base: '5', md: '14' }} minH="100%" minW="100%">
      <Center>
        <VStack spacing="0" w="100%">
          <VStack spacing="4">
            <Heading textAlign="center">Scanning Tickets For {eventInfo?.name}</Heading>
            <Heading fontFamily="body" fontSize="lg" marginBottom="6" textAlign="center">
              Currently Scanning For{' '}
              {ticketOptions.find((option) => option.dropId === ticketToVerify)?.name}
            </Heading>
          </VStack>

          {/* Dropdown for selecting ticket types */}
          <Menu matchWidth>
            {({ isOpen }) => (
              <Box maxW="500px" w="full">
                <MenuButton
                  as={Button}
                  bg="border.box" // Replace 'border.box' with your color code or variable
                  border="2px solid transparent"
                  borderRadius="6xl"
                  isActive={isOpen}
                  isDisabled={isScanning}
                  px="6"
                  py="3"
                  w="100%"
                >
                  <Center>
                    {/* You can customize this part as needed */}
                    <Text>{getSelectedTicketName()}</Text>
                  </Center>
                </MenuButton>
                <MenuList
                  borderRadius="md" // Rounded corners for the dropdown
                  boxShadow="xl" // Larger shadow for the dropdown
                  py="0" // Remove default padding
                  zIndex={2} // Ensure it's above other content
                >
                  {ticketOptions.map((option) => (
                    <MenuItem
                      key={option.dropId}
                      onClick={() => {
                        setTicketToVerify(option.dropId);
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Box>
            )}
          </Menu>
          <Center marginBottom="1" marginTop="6" w="100%">
            <VStack
              alignItems="center"
              borderColor="gray.200"
              borderRadius="24px"
              borderWidth="2px"
              h="100%"
              maxHeight="500px"
              maxW="500px"
              overflow="hidden" // This will ensure that all children also get the border radius applied
              spacing={4}
              w="full"
            >
              <QrReader
                constraints={{ facingMode }}
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px', // Apply the same border radius here
                }}
                scanDelay={1000}
                ViewFinder={() => <ViewFinder />}
                onResult={handleScanResult}
              />
              {/* Ensure that your ViewFinder component does not override the borderRadius. */}
            </VStack>
          </Center>
          {isScanning ? (
            <Text color="gray.500">Scanning in progress...</Text>
          ) : (
            <Text color="gray.500">Waiting for QR code...</Text>
          )}
          <Center maxW="500px" mt="4" w="full">
            <Button w="full" onClick={toggleFacingMode}>
              Flip Camera
            </Button>
          </Center>
        </VStack>
      </Center>
    </Box>
  );
};

export default Scanner;
