import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
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
import { QrDetails } from '@/features/claim/components/ticket/QrDetails';
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
  maxKeyUses?: number;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
}

export default function TicketQRPage({
  eventInfo,
  ticketInfoExtra,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  maxKeyUses,
  secretKey,
}: TicketQRPageProps) {
  // Inside your component
  useEffect(() => {
    if (!maxKeyUses) return;

    const checkForQRScanned = async () => {
      const pubKey = getPubFromSecret(secretKey);
      const keyInfo: { drop_id: string; uses_remaining: number } = await keypomInstance.viewCall({
        methodName: 'get_key_information',
        args: { key: pubKey },
      });
      const curUse = maxKeyUses - keyInfo.uses_remaining + 1;
      if (curUse !== 1) {
        window.location.reload();
      }
    };

    // Set up an interval to call recoverAccount every 3 seconds
    const intervalId = setInterval(() => {
      checkForQRScanned();
    }, 3000);

    // Clean up function to clear the interval when the component unmounts
    // or when the dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [maxKeyUses]); // Dependencies array. recoverAccount will re-run if dropInfo changes.

  const ticketDetails = () => {
    return (
      <VStack spacing="0">
        <Heading
          color={eventInfo?.qrPage?.title?.color}
          fontFamily={eventInfo?.qrPage?.title?.fontFamily}
          fontSize={eventInfo?.qrPage?.title?.fontSize || { base: '2xl', md: '3xl' }}
          fontWeight="500"
          textAlign="center"
        >
          {ticketInfo?.title}
        </Heading>
        {!eventInfo?.qrPage?.dateUnderQR && (
          <Heading fontSize={{ base: 'xs', md: 'xs' }} fontWeight="500" textAlign="center">
            {ticketInfoExtra && dateAndTimeToText(ticketInfoExtra?.passValidThrough)}
          </Heading>
        )}
      </VStack>
    );
  };

  return (
    <VStack
      backgroundImage={
        eventInfo?.qrPage?.background && `${CLOUDFLARE_IPFS}/${eventInfo.qrPage.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="10"
      width="100vw"
    >
      <Box alignItems="center" display="flex" flexDirection="column" px={4} width="100%">
        {(eventInfo?.qrPage?.showTitle || false) && (
          <Heading mb={8} textAlign="center">
            You're attending {eventInfo?.name}!
          </Heading>
        )}

        <Grid
          alignItems="start"
          gap={[4, null, 12]} // smaller gap on smaller screens, adjust as needed
          justifyContent={{ base: 'start', md: 'space-between' }} // stack on base, space-between on md and up
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} // 1 column on small screens, 2 columns on medium and up
          width="55%"
        >
          {(eventInfo?.qrPage?.showLocation || false) && (
            <GridItem>
              <Heading fontFamily="body" fontSize={['md', 'xl']} fontWeight="600">
                Location
              </Heading>
              <Text
                color="gray.500"
                fontFamily="body"
                fontSize={['sm', 'md']} // smaller font on small screens, adjust as needed
                fontWeight="500"
                pb={8}
              >
                {eventInfo?.location || 'Online'}
              </Text>
            </GridItem>
          )}

          {(eventInfo?.qrPage?.showDate || false) && (
            <GridItem justifySelf={{ md: 'end' }} textAlign={{ base: 'left', md: 'right' }}>
              <Heading fontFamily="body" fontSize={['md', 'xl']} fontWeight="600">
                Event Date
              </Heading>
              <Text
                color="gray.500"
                fontFamily="body"
                fontSize={['sm', 'md']} // smaller font on small screens, adjust as needed
                fontWeight="500"
                pb={8}
              >
                {eventInfo?.date && dateAndTimeToText(eventInfo?.date)}
              </Text>
            </GridItem>
          )}
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
            maxW={{ base: '345px', md: '30rem' }}
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
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
                <Hide above="md">
                  <Skeleton isLoaded={!isLoading} mt="4">
                    <Text
                      color="gray.600"
                      fontWeight="600"
                      mb="2"
                      size={{ base: 'sm', md: 'md' }}
                      textAlign="center"
                    >
                      {eventInfo?.name}
                    </Text>
                  </Skeleton>
                </Hide>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </VStack>
  );
}
