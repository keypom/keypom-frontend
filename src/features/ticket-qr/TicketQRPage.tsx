import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { QrDetails } from '@/features/ticket-qr/components/QrDetails';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

import { dateAndTimeToText } from '../drop-manager/utils/parseDates';

interface TicketQRPageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
  onScanned: () => void;
}

export default function TicketQRPage({
  eventInfo,
  ticketInfoExtra,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  secretKey,
  onScanned,
}: TicketQRPageProps) {
  // Effect to check for QR scan and reload if necessary
  useEffect(() => {
    const checkForQRScanned = async () => {
      const pubKey = getPubFromSecret(secretKey);
      const keyInfo: { drop_id: string; uses_remaining: number } = await keypomInstance.viewCall({
        methodName: 'get_key_information',
        args: { key: pubKey },
      });
      console.log('keyInfo', keyInfo);

      if (keyInfo.uses_remaining !== 3) {
        onScanned();
      }
    };

    // Set up an interval to call checkForQRScanned every 3 seconds
    const intervalId = setInterval(checkForQRScanned, 3000);

    // Clean up interval on component unmount or dependency change
    return () => {
      clearInterval(intervalId);
    };
  }, [secretKey]);

  const ticketDetails = () => (
    <VStack spacing="0">
      <Heading
        color="event.title"
        fontFamily="title"
        fontSize="2xl"
        fontWeight="500"
        textAlign="center"
      >
        {ticketInfo?.title}
      </Heading>
      <Heading fontSize={{ base: 'xs', md: 'xs' }} fontWeight="500" textAlign="center">
          {ticketInfoExtra && dateAndTimeToText(ticketInfoExtra?.passValidThrough)}
        </Heading>
    </VStack>
  );

  return (
    <VStack
      backgroundImage={`assets/demos/consensus/background.png`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="10"
      width="100vw"
    >
      <Box alignItems="center" display="flex" flexDirection="column" px={4} width="100%">
        <Heading mb={8} textAlign="center">
          You're attending {eventInfo?.name}!
        </Heading>

        <Grid
          alignItems="start"
          gap={[4, null, 12]} // smaller gap on smaller screens, adjust as needed
          justifyContent={{ base: 'start', md: 'space-between' }} // stack on base, space-between on md and up
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} // 1 column on small screens, 2 columns on medium and up
          width="55%"
        >
          <GridItem>
              <Heading fontFamily="body" fontSize={['md', 'xl']} fontWeight="600">
                Location
              </Heading>
              <Text
                color="event.h1"
                fontFamily="heading"
                fontSize={['sm', 'md']} // smaller font on small screens, adjust as needed
                fontWeight="500"
                pb={8}
              >
                {eventInfo?.location || 'Online'}
              </Text>
            </GridItem>

            <GridItem justifySelf={{ md: 'end' }} textAlign={{ base: 'left', md: 'right' }}>
              <Heading
                color='event.h1'
                fontFamily="heading"
                fontSize={['md', 'xl']}
                fontWeight="600"
              >
                Event Date
              </Heading>
              <Text
                color="event.h2"
                fontFamily="heading"
                fontSize={['sm', 'md']} // smaller font on small screens, adjust as needed
                fontWeight="500"
                pb={8}
              >
                {eventInfo?.date && dateAndTimeToText(eventInfo?.date)}
              </Text>
            </GridItem>
        </Grid>
      </Box>

      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }} paddingBottom="20">
          <Skeleton fadeDuration={1} isLoaded={!isLoading}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="500"
              paddingBottom="4"
              textAlign="center"
            >
              {isLoading ? 'Loading ticket...' : ticketDetails()}
            </Heading>
          </Skeleton>

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
              <BoxWithShape bg="white" borderTopRadius="8xl" w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <QrDetails
                    eventId={eventId}
                    eventInfo={eventInfo!}
                    funderId={funderId}
                    qrValue={secretKey}
                    ticketInfo={ticketInfo!}
                    ticketInfoExtra={ticketInfoExtra}
                  />
                )}
              </BoxWithShape>
              <Flex
                align="center"
                bg="gray.50"
                borderBottomRadius="8xl"
                flexDir="column"
                px="6"
                py="8"
              >
                <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                  <Image
                    alt={`Event image for ${eventInfo?.name}`}
                    borderRadius="12px"
                    height="300px"
                    objectFit="contain"
                    src={`${CLOUDFLARE_IPFS}/${ticketInfo?.media}`}
                  />
                </Skeleton>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </VStack>
  );
}
