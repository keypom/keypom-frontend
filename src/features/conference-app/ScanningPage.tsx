import {
  Box,
  Center,
  Flex,
  Grid,
  IconButton,
  Image,
  Skeleton,
  Text,
  useToast,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import { useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { RepeatIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { ViewFinder } from '@/components/ViewFinder';
import { LoadingOverlay } from '@/features/scanner/components/LoadingOverlay';
import keypomInstance from '@/lib/keypom';
import { useConferenceContext } from '@/contexts/ConferenceContext';

import ScavengerModal from './modals/ScavengerModal';
import MerchModal from './modals/MerchModal';
import ProfileTransferModal from './modals/ProfileTransferModal';
import { claimEventDrop } from './helpers';
import NFTModal from './modals/NFTModal';
import TokenModal from './modals/TokenModal';

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  isProcessing: boolean;
}

export default function ScanningPage() {
  const { eventInfo, factoryAccount, isLoading, setTriggerRefetch, accountId, secretKey } =
    useConferenceContext();

  const toast = useToast();

  const [facingMode, setFacingMode] = useState('environment'); // default to rear camera
  const [isScanning, setIsScanning] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false); // New state to manage cooldown
  const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
  const [statusMessage, setStatusMessage] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalProps, setModalProps] = useState<any>({});

  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    isProcessing: false,
  });

  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 1000 milliseconds (1 second)
    }, 1000);
  };

  useEffect(() => {
    stateRef.current.isScanning = isScanning;
    stateRef.current.isOnCooldown = isOnCooldown;
    // Update other state variables in stateRef.current as needed
  }, [isScanning, isOnCooldown]);

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

  const handleScanResult = async (result: any) => {
    if (result && !stateRef.current.isScanning && !stateRef.current.isOnCooldown) {
      setIsScanning(true);
      setScanStatus(undefined);

      try {
        const qrData = result.getText();
        console.log('QR Data: ', qrData);

        const qrDataSplit = qrData.split(':');
        const type = qrDataSplit[0];
        const data = qrDataSplit[1];

        if (!type || !data) {
          throw new Error('QR data format is incorrect');
        }

        switch (type) {
          case 'token':
          case 'nft': {
            if (!accountId) {
              throw new Error('Account ID is not set');
            }

            const { alreadyClaimed, isScavenger, numFound, numRequired, name, image, amount } =
              await claimEventDrop({
                factoryAccount,
                qrDataSplit,
                accountId,
                setScanStatus,
                setStatusMessage,
                secretKey,
              });

            if (alreadyClaimed) {
              return;
            }

            const tokenAmount = amount ? keypomInstance.yoctoToNear(amount) : undefined;

            if (isScavenger) {
              setModalType('scavenger');
              setModalProps({ numFound, numRequired, tokenAmount, image, name, eventInfo });
            } else if (amount) {
              setModalType('token');
              setModalProps({ tokenAmount, dropName: name, tokenImage: image, eventInfo });
            } else {
              setModalType('nft');
              setModalProps({ name, image, eventInfo });
            }
            break;
          }
          case 'food':
            setModalType('merch');
            setModalProps({
              title: 'Food Purchase',
              subtitle: `You are purchasing food`,
              body: `How much $NCON would you like to transfer to the vendor?`,
            });
            break;
          case 'merch':
            setModalType('merch');
            setModalProps({
              title: 'Merch Purchase',
              subtitle: `You are purchasing merchandise`,
              body: `How much $NCON would you like to transfer to the vendor?`,
            });
            break;
          case 'raffle':
            setModalType('raffle');
            setModalProps({
              title: 'Raffle Entry',
              subtitle: `Enter the raffle for a chance to win`,
              body: `How many tickets would you like to purchase?`,
            });
            break;
          case 'profile': {
            const sendTo = data;
            if (sendTo === accountId) {
              toast({
                title: 'Invalid QR',
                description: 'Cannot send tokens to yourself',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
              break;
            }

            setModalType('profileTransfer');
            setModalProps({
              title: 'Transfer Tokens',
              curAccountId: accountId,
              initialSendTo: sendTo.split('.')[0],
            });
            break;
          }

          case 'sponsor':
            setModalType('sponsor');
            setModalProps({
              title: 'Sponsor Quiz',
              subtitle: `Answer the quiz to earn rewards`,
              body: `Fill in the details to earn an NFT!`,
              questions: [
                'Question 1: What is NEAR?',
                'Question 2: What is the latest NEAR feature?',
                'Question 3: What is NEARCON?',
              ],
            });
            break;
          default:
            console.error('Unhandled QR data type:', type);
            throw new Error('Invalid QR data type');
        }

        setModalOpen(true);
      } catch (error) {
        console.error('Scan failed', error);
        setScanStatus('error');
        setStatusMessage('Error scanning item');
      } finally {
        setIsScanning(false);
        enableCooldown();
      }
    }
  };

  const [isHeightGreaterThan600] = useMediaQuery('(min-height: 600px)');
  const [isHeightGreaterThan700] = useMediaQuery('(min-height: 700px)');
  const [isHeightGreaterThan800] = useMediaQuery('(min-height: 800px)');
  const [isHeightGreaterThan900] = useMediaQuery('(min-height: 900px)');

  const fontSize = isHeightGreaterThan900
    ? '3xl'
    : isHeightGreaterThan800
    ? '2xl'
    : isHeightGreaterThan700
    ? 'xl'
    : isHeightGreaterThan600
    ? 'lg'
    : 'md';

  return (
    <>
      {modalOpen && modalType === 'scavenger' && (
        <ScavengerModal
          eventInfo={eventInfo}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          {...modalProps}
        />
      )}
      {modalOpen && modalType === 'nft' && (
        <NFTModal
          eventInfo={eventInfo}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          {...modalProps}
        />
      )}
      {modalOpen && modalType === 'token' && (
        <TokenModal
          eventInfo={eventInfo}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          {...modalProps}
        />
      )}
      {modalOpen && modalType === 'merch' && (
        <MerchModal
          eventInfo={eventInfo}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          {...modalProps}
        />
      )}
      {modalOpen && modalType === 'profileTransfer' && (
        <ProfileTransferModal
          isOpen={modalOpen}
          onClose={() => {
            setTriggerRefetch((prev: number) => prev + 1);
            setModalOpen(false);
          }}
          {...modalProps}
        />
      )}
      <Center h="78vh">
        <VStack
          gap={{ base: '16px', md: '24px', lg: '32px' }}
          overflowY="auto"
          pt="14"
          spacing="4"
          w={{ base: '90vw', md: '90%', lg: '80%' }}
        >
        <IconBox
            bg='border.box'
            h="full"
            icon={
              <Skeleton isLoaded={!isLoading}>
                <Image
                  borderRadius="full"
                  height={{ base: '14', md: '12' }}
                  src={`/assets/demos/consensus/consensus_logo.png`}
                  width={{ base: '20', md: '12' }}
                />
              </Skeleton>
            }
            iconBg={'event.iconBg'}
            iconBorder={'event.iconBorder'}
            minW={{ base: '90vw', md: '345px' }}
            p="0"
            pb="0"
            w="full"
          >
            <Box>
              <BoxWithShape bg="white" borderTopRadius="8xl" h="full" showNotch={false} w="full">
                {isLoading || !accountId ? (
                  <Flex align="center" h="200px" justify="center" w="full">
                    <ClipLoader color="event.title" size={50} />
                  </Flex>
                ) : (
                  <Flex
                    align="center"
                    flexDir="column"
                    pb={{ base: '2', md: '5' }}
                    pt={{ base: '10', md: '16' }}
                    px={{ base: '10', md: '8' }}
                  >
                    <VStack position="relative" w="100%">
                      <IconButton
                        aria-label="Flip Camera"
                        icon={<RepeatIcon />}
                        position="absolute"
                        right="40px"
                        top="10px"
                        zIndex="2"
                        onClick={() => {
                          setFacingMode((prevMode) =>
                            prevMode === 'environment' ? 'user' : 'environment',
                          );
                        }}
                      />
                      {facingMode === 'environment' && (
                        <QrReader
                          key="environmentQR"
                          constraints={{ facingMode: 'environment' }}
                          containerStyle={{
                            width: '80%',
                            height: '80%',
                            borderRadius: '24px',
                          }}
                          scanDelay={1000}
                          ViewFinder={() => (
                            <ViewFinder style={{ border: '20px solid rgba(0, 0, 0, 0.3)' }} />
                          )}
                          onResult={handleScanResult}
                        />
                      )}
                      {facingMode === 'user' && (
                        <QrReader
                          key="userQR"
                          constraints={{ facingMode: 'user' }}
                          containerStyle={{
                            width: '80%',
                            height: '80%',
                            borderRadius: '24px',
                          }}
                          scanDelay={1000}
                          ViewFinder={() => (
                            <ViewFinder style={{ border: '20px solid rgba(0, 0, 0, 0.3)' }} />
                          )}
                          onResult={handleScanResult}
                        />
                      )}
                      {/* Overlay Component */}
                      <LoadingOverlay isVisible={isOnCooldown || isScanning} status={scanStatus} />
                    </VStack>
                  </Flex>
                )}
              </BoxWithShape>
              <Flex
                flexDir="column"
                h="calc(78vh - 50vh)"
                justifyContent="space-between"
                px="6"
                py="4"
                w="full"
              >
                <VStack
                  h="full"
                  justifyContent="space-between"
                  overflowY="auto"
                  spacing="2"
                  w="full"
                >
                  <Text
                    color='event.h1'
                    fontFamily="heading"
                    fontSize={fontSize}
                    fontWeight="600"
                    textAlign="center"
                  >
                    Scan to participate
                  </Text>
                  {/* Start of the grid for Spork Details */}
                  <Grid
                    gap={6} // Space between grid items
                    py={4} // Padding on the top and bottom
                    templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                    width="full" // Full width of the parent container
                  >
                    {/* Left column for earning methods */}
                    <Box>
                    <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight="500"
                        mb={0}
                        textAlign="left"
                      >
                        Earn By:
                      </Text>
                      <VStack align="stretch" spacing={1} textAlign="left">
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Attending Talks
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Visiting Booths
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Scavenger Hunts
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Sponsor Quizzes
                        </Text>
                      </VStack>
                    </Box>

                    {/* Right column for spending methods */}
                    <Box>
                      <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight="500"
                        mb={0}
                        textAlign="left"
                      >
                        Spend On:
                      </Text>
                      <VStack align="stretch" spacing={1} textAlign="right">
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Food
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Merch
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          Raffles
                        </Text>
                        <Text
                          color="event.h3"
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="400"
                          textAlign="left"
                        >
                          NFTs
                        </Text>
                      </VStack>
                    </Box>
                  </Grid>
                </VStack>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </>
  );
}
