import {
  Box,
  Center,
  Flex,
  Grid,
  HStack,
  Image,
  Skeleton,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { useConferenceContext } from '@/contexts/ConferenceContext';

import { formatTokensAvailable } from './AssetsPages/AssetsHome';

export default function ProfilePage() {
  const { eventInfo, ticketInfo, isLoading, ticker, accountId, tokensAvailable } =
    useConferenceContext();

  const [isHeightGreaterThan600] = useMediaQuery('(min-height: 600px)');
  const [isHeightGreaterThan700] = useMediaQuery('(min-height: 700px)');
  const [isHeightGreaterThan800] = useMediaQuery('(min-height: 800px)');
  const [isHeightGreaterThan900] = useMediaQuery('(min-height: 900px)');
  const qrSize = isHeightGreaterThan900
    ? 190
    : isHeightGreaterThan800
    ? 170
    : isHeightGreaterThan700
    ? 150
    : isHeightGreaterThan600
    ? 120
    : 100;
  const imageSize = isHeightGreaterThan900
    ? '170px'
    : isHeightGreaterThan800
    ? '120px'
    : isHeightGreaterThan700
    ? '100px'
    : isHeightGreaterThan600
    ? '80px'
    : '50px';

  return (
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
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Text
                    color='event.h1'
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="600"
                    textAlign="center"
                  >
                    {formatTokensAvailable(tokensAvailable)} ${ticker}
                  </Text>
                  <Grid
                    gap={6} // Space between grid items
                    py={isHeightGreaterThan800 ? '4' : '2'} // Padding on the top and bottom
                    templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                    width="full" // Full width of the parent container
                  >
                    {/* Left column for first name */}
                    <Box>
                      <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight="500"
                        mb={0}
                        textAlign="left"
                      >
                        First Name
                      </Text>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="left"
                      >
                        N/A
                      </Text>
                    </Box>

                    {/* Right column for last name */}
                    <Box>
                      <Text
                        color="event.h2"
                        fontFamily="heading"
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight="400"
                        mb={0}
                        textAlign="right"
                      >
                        Last Name
                      </Text>
                      <Text
                        color="event.h3"
                        fontFamily="heading"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="right"
                      >
                        N/A
                      </Text>
                    </Box>
                  </Grid>
                  <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                    <Image
                      alt={`Event image for ${eventInfo.name}`}
                      borderRadius="8px"
                      height={imageSize}
                      mb="2"
                      objectFit="contain"
                      src={`/assets/demos/consensus/${ticketInfo.media}`}
                    />
                  </Skeleton>
                  <HStack>
                    <Text
                      color="event.h2"
                      fontFamily="heading"
                      fontSize={{
                        "base": "lg",
                        "md": "2xl"
                    }}
                      fontWeight="400"
                      mb={0}
                      textAlign="right"
                    >
                      Username:
                    </Text>
                    <Text
                      color="event.h3"
                      fontFamily="heading"
                      fontSize="sm"
                      fontWeight="400"
                      textAlign="right"
                    >
                      {accountId.split('.')[0]}
                    </Text>
                  </HStack>
                </Flex>
              )}
            </BoxWithShape>

            <Flex flexDir="column" justifyContent="space-between" px="6" py="4" w="full">
              <VStack h="full" justifyContent="space-between" overflowY="auto" spacing="2" w="full">
                <Text
                  color="event.h1"
                  fontFamily="heading"
                  fontSize={{
                    "base": "lg",
                    "md": "2xl"
                }}
                  fontWeight="600"
                  size={{ base: '2xl', md: '2xl' }}
                  textAlign="center"
                >
                  Share Your Profile
                </Text>
                <Box border="1px solid" borderColor="gray.200" borderRadius="12px" p="3">
                  <QRCode id="QRCode" size={qrSize} value={`profile:${accountId}`} />
                </Box>
                <Text
                  color="event.h3"
                  fontFamily="heading"
                  fontSize="md"
                  fontWeight="400"
                  textAlign="center"
                >
                  Show this to receive ${ticker}
                </Text>
              </VStack>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
}
