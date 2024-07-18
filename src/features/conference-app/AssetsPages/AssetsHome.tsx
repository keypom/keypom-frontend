import {
  Box,
  Flex,
  Center,
  Skeleton,
  Text,
  VStack,
  HStack,
  Image,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { SendIcon } from '@/components/Icons/SendIcon';
import { ReceiveIcon } from '@/components/Icons/ReceiveIcon';
import { CameraIcon } from '@/components/Icons/CameraIcon';
import { conferenceFooterMenuIndexes, useConferenceContext } from '@/contexts/ConferenceContext';

import ProfileTransferModal from '../modals/ProfileTransferModal';
import ReceiveTokensModal from '../modals/ReceiveTokensModal';

export const formatTokensAvailable = (tokens: string) => {
  const [integerPart, decimalPart] = tokens.split('.');
  if (!decimalPart) {
    return tokens;
  }
  if (decimalPart.length <= 2) {
    return tokens;
  }
  if (decimalPart.slice(2).replace(/0+$/, '').length > 0) {
    return `${integerPart}.${decimalPart}`;
  }
  return `${integerPart}.${decimalPart.slice(0, 2)}`;
};

const AssetsHome = () => {
  const { tokensAvailable, isLoading, onSelectTab, ticker } = useConferenceContext();

  const sendDisclosure = useDisclosure();
  const receiveDisclosure = useDisclosure();

  const [isLargerThan700] = useMediaQuery('(min-height: 700px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');

  const handleCardClick = (tab: string) => {
    onSelectTab(conferenceFooterMenuIndexes.assets, tab);
  };

  const PageCard = ({
    title,
    imageUrl,
    tab,
    color,
    fontSize,
    locked = false,
  }: {
    title: string;
    imageUrl: string;
    tab: string;
    color: string;
    fontSize: string;
    locked: boolean;
  }) => {
    const cardStyle = {
      position: 'relative' as const,
      flex: '1',
      bg: 'gray.100',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
    };

    const imageContainerStyle = {
      flex: '1',
      width: '100%',
    };

    const lockIconStyle = {
      position: 'absolute' as const,
      top: '55%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'gray.500',
      w: '24px',
      h: '24px',
    };

    const overlayStyle = {
      position: 'absolute' as const,
      top: locked ? '5%' : '33.33%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      p: '2',
    };

    const comingSoonStyle = {
      position: 'absolute' as const,
      top: '60%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      p: '2',
    };

    const image = `/assets/demos/consensus/${imageUrl}`;

    return (
      <Box
        {...cardStyle}
        onClick={
          locked
            ? () => {
                console.log('Coming soon');
              }
            : handleCardClick.bind(null, tab)
        }
      >
        <Box {...imageContainerStyle}>
          <Image
            alt={title}
            borderRadius="md"
            filter={!locked ? 'none' : 'blur(4px)'}
            h="100%"
            objectFit="cover"
            src={image}
            w="100%"
          />

          {locked && <LockIcon {...lockIconStyle} />}
          <Box {...overlayStyle}>
            <Text
              bottom="2"
              color={color}
              fontFamily="heading"
              fontSize={fontSize}
              fontWeight="400"
              >
              {title}
            </Text>
          </Box>
          {locked && (
            <Box {...comingSoonStyle}>
              <Text
                bottom="2"
                color="white"
                fontFamily="heading"
                fontSize={isLargerThan900 ? 'xl' : isLargerThan700 ? 'lg' : 'md'}
                fontWeight="600"
              >
                Coming Soon
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  return (
    <Center h="78vh">
      <ProfileTransferModal
        isOpen={sendDisclosure.isOpen}
        title="Send Tokens"
        onClose={sendDisclosure.onClose}
      />
      <ReceiveTokensModal isOpen={receiveDisclosure.isOpen} onClose={receiveDisclosure.onClose} />
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        overflowY="auto"
        pt="14"
        spacing="4"
        w={{ base: '90vw', md: '90%', lg: '80%' }}
      >
        <IconBox
          bg={'border.consensus'}
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
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  h="full"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Text
                    color="event.h1"
                    fontFamily="heading"
                    fontSize={{ base: '2xl', md: '2xl' }}
                    fontWeight="600"
                    textAlign="center"
                  >
                    {formatTokensAvailable(tokensAvailable)} ${ticker}
                  </Text>
                  <HStack justify="space-evenly" mt={4} spacing={4} w="100%">
                    <VStack spacing="0">
                      <Box
                        bg="event.button.secondary.color"
                        borderRadius="0.75em"
                        p="2"
                        onClick={sendDisclosure.onOpen}
                      >
                        <SendIcon color="white" h={{ base: '20px', md: '24px' }} strokeWidth="1" />
                      </Box>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="400"
                        textAlign="center"
                      >
                        Send
                      </Text>
                    </VStack>
                    <VStack spacing="0">
                      <Box
                        bg="event.button.secondary.color"
                        borderRadius="0.75em"
                        p="2"
                        onClick={receiveDisclosure.onOpen}
                      >
                        <ReceiveIcon
                          color="white"
                          h={{ base: '20px', md: '24px' }}
                          strokeWidth="1"
                        />
                      </Box>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="400"
                        textAlign="center"
                      >
                        Receive
                      </Text>
                    </VStack>
                    <VStack spacing="0">
                      <Box
                        bg="event.button.secondary.color"
                        borderRadius="0.75em"
                        p="2"
                        onClick={() => {
                          onSelectTab(conferenceFooterMenuIndexes.scan);
                        }}
                      >
                        <CameraIcon
                          color="white"
                          h={{ base: '20px', md: '24px' }}
                          strokeWidth="1"
                        />
                      </Box>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="400"
                        textAlign="center"
                      >
                        Scan
                      </Text>
                    </VStack>
                  </HStack>
                </Flex>
              )}
            </BoxWithShape>

            <Flex
              flexDir="column"
              h="calc(78vh - 250px)"
              justifyContent="space-between"
              px="6"
              py="4"
              w="full"
            >
              <VStack h="full" justifyContent="space-between" overflowY="auto" spacing="2" w="full">
                <PageCard
                  color="white"
                  fontSize={isLargerThan900 ? '3xl' : isLargerThan700 ? '3xl' : 'xl'}
                  imageUrl="collectibles_2.png"
                  locked={false}
                  tab="collectibles"
                  title="Collectibles"
                />
                <HStack h="33%" w="100%">
                  <PageCard
                    color="white"
                    fontSize={isLargerThan900 ? '3xl' : isLargerThan700 ? '2xl' : 'xl'}
                    imageUrl="raffles.jpg"
                    locked={true}
                    tab="raffles"
                    title="Raffles"
                  />
                  <PageCard
                    color="white"
                    fontSize={isLargerThan900 ? '3xl' : isLargerThan700 ? '2xl' : 'xl'}
                    imageUrl="auctions.jpg"
                    locked={true}
                    tab="auctions"
                    title="Auctions"
                  />
                </HStack>
                <PageCard
                  color="event.h2"
                  fontSize={isLargerThan900 ? '3xl' : isLargerThan700 ? '3xl' : 'xl'}
                  imageUrl="scavengers_2.png"
                  locked={false}
                  tab="scavengers"
                  title="Scavenger Hunts"
                />
              </VStack>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AssetsHome;
