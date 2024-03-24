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
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { type OnResultFunction, QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';
import { useTicketScanningParams } from '@/hooks/useTicketScanningParams';
import { NotFound404 } from '@/components/NotFound404';
import { ViewFinder } from '@/components/ViewFinder';
import {
  type FunderEventMetadata,
  type EventDrop,
  type TicketMetadataExtra,
  type DateAndTimeInfo,
} from '@/lib/eventsHelpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

import { getDropFromSecretKey, validateDrop } from '../components/helpers';
import { LoadingOverlay } from '../components/LoadingOverlay';

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  ticketsToScan: string[];
  allTicketOptions: EventDrop[];
  ticktToVerify: string;
  isProcessing: boolean;
}

const Scanner = () => {
  const { funderId, eventId } = useTicketScanningParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [facingMode, setFacingMode] = useState('user'); // default to rear camera
  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [ticketOptions, setTicketOptions] = useState<
    Array<{ dropId: string; name: string; validThrough: DateAndTimeInfo }>
  >([{ dropId: '', name: 'All Tickets', validThrough: { startDate: 0 } }]);
  const [isErr, setIsErr] = useState(false);
  const [ticketToVerify, setTicketToVerify] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false); // New state to manage cooldown

  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    ticketsToScan: [],
    allTicketOptions: [],
    ticktToVerify: '',
    isProcessing: false,
  });

  const [allTicketOptions, setAllTicketOptions] = useState<EventDrop[]>();

  const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
  const [statusMessage, setStatusMessage] = useState('');

  const [ticketsToScan, setTicketsToScan] = useState<string[]>([]);

  useEffect(() => {
    if (eventId === '' || funderId === '') navigate('/drops');
    if (!eventId || !funderId) return;

    const getEventData = async () => {
      try {
        const eventInfo: FunderEventMetadata | null = await keypomInstance.getEventInfo({
          accountId: funderId,
          eventId,
        });
        if (eventInfo == null || Object.keys(eventInfo).length === 0) {
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
        setAllTicketOptions(ticketsReturned);

        const ticketOptions: Array<{
          dropId: string;
          name: string;
          validThrough: DateAndTimeInfo;
        }> = [{ dropId: '', name: 'All Tickets', validThrough: { startDate: 0 } }];
        ticketsReturned.forEach((ticket) => {
          const extra: TicketMetadataExtra = JSON.parse(
            ticket.drop_config.nft_keys_config.token_metadata.extra,
          );
          ticketOptions.push({
            dropId: ticket.drop_id,
            name: ticket.drop_config.nft_keys_config.token_metadata.title,
            validThrough: extra.passValidThrough,
          });
        });
        setTicketOptions(ticketOptions);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error getting event tickets:', e);
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
        setScanStatus(undefined);
      }, 5000);
    }
  }, [scanStatus, statusMessage, toast]);

  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 3000 milliseconds (3 seconds)
    }, 1000);
  };

  useEffect(() => {
    stateRef.current.isScanning = isScanning;
    stateRef.current.ticketsToScan = ticketsToScan;
    stateRef.current.isOnCooldown = isOnCooldown;
    stateRef.current.allTicketOptions = allTicketOptions || [];
    stateRef.current.ticktToVerify = ticketToVerify;
    // Update other state variables in stateRef.current as needed
  }, [isScanning, ticketsToScan, isOnCooldown, allTicketOptions, ticketToVerify]);

  useEffect(() => {
    // Process tickets in batches but only if not currently processing
    if (!stateRef.current.isProcessing && stateRef.current.ticketsToScan.length > 0) {
      processBatchOfTickets();
    }
  }, [ticketsToScan]);

  const handleScanResult: OnResultFunction = async (result) => {
    if (result && !stateRef.current.isScanning && !stateRef.current.isOnCooldown) {
      setIsScanning(true); // Start scanning
      setScanStatus(undefined); // Reset the status message
      try {
        const secretKey = result.getText();
        const dropInfo = await getDropFromSecretKey(secretKey);
        if (dropInfo) {
          const { drop, usesRemaining } = dropInfo;
          // Check if the ticket has already been scanned
          if (stateRef.current.ticketsToScan.includes(secretKey)) {
            // This now correctly checks against the most up-to-date ticketsToScan
            setScanStatus('error');
            setStatusMessage('Ticket already scanned.');
            return;
          }

          if (usesRemaining !== 2) {
            setScanStatus('error');
            setStatusMessage('Ticket has already been used.');
            return;
          }

          // Suppose you have a function to validate the ticket
          const { status, message } = validateDrop({
            drop,
            allTicketOptions: stateRef.current.allTicketOptions,
            ticketToVerify: stateRef.current.ticktToVerify,
          });

          // If the ticket is valid, update the state to include the new ticket
          if (status === 'success') {
            // Update both the ref and the state to enqueue the ticket
            const updatedTickets = [...stateRef.current.ticketsToScan, secretKey];
            stateRef.current.ticketsToScan = updatedTickets;
            setTicketsToScan(updatedTickets);
          }
          setScanStatus(status);
          setStatusMessage(message);
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
        enableCooldown(); // Enable cooldown to prevent multiple scans
      }
    }
  };

  const processBatchOfTickets = async () => {
    stateRef.current.isProcessing = true;
    // Take up to 10 tickets to process
    const ticketsToProcess = stateRef.current.ticketsToScan.slice(0, 10);

    await Promise.all(
      ticketsToProcess.map(async (ticket) => {
        try {
          // Placeholder for your actual ticket processing logic
          await keypomInstance.onEventTicketScanned(ticket);
          // Process successful, remove from the ref queue
          stateRef.current.ticketsToScan = stateRef.current.ticketsToScan.filter(
            (t) => t !== ticket,
          );
        } catch (error) {
          console.error('Error processing ticket:', ticket, error);
          // Decide how to handle errors, e.g., retry later, log, etc.
        }
      }),
    );

    // Update the ticketsToScan state to trigger re-render if needed
    setTicketsToScan([...stateRef.current.ticketsToScan]);
    stateRef.current.isProcessing = false;

    // Check if more tickets are in the queue and continue processing
    if (stateRef.current.ticketsToScan.length > 0) {
      processBatchOfTickets();
    }
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

  if (!allTicketOptions || !eventInfo) {
    return (
      <Center h="100vh">
        {' '}
        {/* Adjust the height as needed */}
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box marginTop="6" mb={{ base: '5', md: '14' }} minH="100%" minW="100%">
      <Center>
        <VStack spacing="0" w="100%">
          <VStack marginBottom="6" spacing="4">
            <Heading textAlign="center">Scanning Tickets For {eventInfo?.name}</Heading>
            <VStack spacing="1">
              <Heading fontFamily="body" fontSize="lg" textAlign="center">
                Currently Scanning For{' '}
                {ticketOptions.find((option) => option.dropId === ticketToVerify)?.name}
              </Heading>
              {ticketToVerify !== '' && (
                <Heading
                  fontFamily="body"
                  fontSize="md"
                  fontWeight="400"
                  textAlign="center"
                  textColor="gray.500"
                >
                  Valid Through:{' '}
                  {dateAndTimeToText(
                    ticketOptions.find((option) => option.dropId === ticketToVerify)!.validThrough,
                  )}
                </Heading>
              )}
            </VStack>
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
                    <Text>Select Ticket Type To Scan</Text>
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
              overflow="hidden"
              position="relative" // Ensure this container is positioned relatively
              spacing={4}
              w="full"
            >
              <QrReader
                constraints={{ facingMode }}
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                }}
                scanDelay={1000}
                ViewFinder={() => <ViewFinder />}
                onResult={handleScanResult}
              />
              {/* Overlay Component */}
              <LoadingOverlay isVisible={isOnCooldown || isScanning} status={scanStatus} />
            </VStack>
          </Center>
          {ticketsToScan.length > 0 ? (
            <Text color="gray.500">
              Processing {ticketsToScan.length} tickets in the background...
            </Text>
          ) : (
            <Text color="gray.500">Waiting for QR code...</Text>
          )}
          <Center maxW="500px" mt="4" w="full">
            <Button
              w="full"
              onClick={() => {
                setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
              }}
            >
              Flip Camera
            </Button>
          </Center>
        </VStack>
      </Center>
    </Box>
  );
};

export default Scanner;
