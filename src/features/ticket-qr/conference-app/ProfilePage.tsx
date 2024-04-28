import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';

interface ProfilePageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  accountId: string;
  tokensAvailable: string;
  secretKey: string;
}

export default function ProfilePage({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  accountId,
  tokensAvailable,
  secretKey,
}: ProfilePageProps) {
  return (
    <Center>
      <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            paddingBottom="0"
            textAlign="center"
          >
            {isLoading ? (
              'Loading ticket...'
            ) : (
              <VStack>
                <Heading
                  color={eventInfo?.qrPage?.title?.color}
                  fontFamily={eventInfo?.qrPage?.title?.fontFamily}
                  fontSize={{ base: '6xl', md: '8xl' }}
                  fontWeight="500"
                  textAlign="center"
                >
                  PROFILE
                </Heading>
              </VStack>
            )}
          </Heading>
        </Skeleton>

        <IconBox
          bg={eventInfo?.qrPage?.content?.border || 'border.box'}
          icon={
            <Skeleton isLoaded={!isLoading}>
              {eventInfo?.qrPage?.boxIcon?.image ? (
                <Image
                  height={{ base: '10', md: '12' }}
                  src={`${CLOUDFLARE_IPFS}/${eventInfo.qrPage.boxIcon.image}`}
                  width={{ base: '10', md: '12' }}
                />
              ) : (
                <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
              )}
            </Skeleton>
          }
          iconBg={eventInfo?.qrPage?.boxIcon?.bg || 'blue.100'}
          iconBorder={eventInfo?.qrPage?.boxIcon?.border || 'border.round'}
          maxW="345px"
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="90vh"
        >
          <Box h="full">
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '3', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Text
                    color="#844AFF"
                    fontFamily="denverBody"
                    fontWeight="600"
                    size={{ base: '2xl', md: '2xl' }}
                    textAlign="center"
                  >
                    {tokensAvailable} $PORK Available
                  </Text>
                  <Grid
                    gap={6} // Space between grid items
                    py={2} // Padding on the top and bottom
                    templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                    width="full" // Full width of the parent container
                  >
                    {/* Left column for earning methods */}
                    <Box>
                      <Text
                        color="black"
                        fontFamily="denverBody"
                        fontSize="lg"
                        fontWeight="500"
                        mb={0}
                        textAlign="left"
                      >
                        First Name
                      </Text>
                      <Text
                        color="black"
                        fontFamily="denverBody"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="left"
                      >
                        Benjamin
                      </Text>
                    </Box>

                    {/* Right column for spending methods */}
                    <Box>
                      <Text
                        color="black"
                        fontFamily="denverBody"
                        fontSize="lg"
                        fontWeight="500"
                        mb={0}
                        textAlign="right"
                      >
                        Last Name
                      </Text>
                      <Text
                        color="black"
                        fontFamily="denverBody"
                        fontSize="sm"
                        fontWeight="400"
                        textAlign="right"
                      >
                        Kurrek
                      </Text>
                    </Box>
                  </Grid>
                  <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                    <Image
                      alt={`Event image for ${eventInfo?.name}`}
                      borderRadius="12px"
                      height="140px"
                      mb="2"
                      objectFit="contain"
                      src={`${CLOUDFLARE_IPFS}/${ticketInfo?.media}`}
                    />
                  </Skeleton>
                  <HStack>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontSize="lg"
                      fontWeight="500"
                      mb={0}
                      textAlign="right"
                    >
                      Username:
                    </Text>
                    <Text
                      color="black"
                      fontFamily="denverBody"
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
            <Flex
              align="center"
              bg="gray.50"
              borderBottomRadius="8xl"
              flexDir="column"
              pb="2"
              pt="2"
              px="6"
            >
              <Text
                color="#844AFF"
                fontFamily="denverBody"
                fontWeight="600"
                size={{ base: 'xl', md: '2xl' }}
                textAlign="center"
              >
                Share Your Profile
              </Text>
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12px"
                mb={{ base: '2', md: '2' }}
                p="5"
              >
                <QRCode id="QRCode" size={180} value={accountId} />
              </Box>
              <Text
                color="black"
                fontFamily="denverBody"
                fontSize="sm"
                fontWeight="400"
                textAlign="right"
              >
                Show this to receive $PORK
              </Text>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
}
