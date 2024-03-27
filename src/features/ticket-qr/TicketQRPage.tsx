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
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { QrDetails } from '@/features/claim/components/ticket/QrDetails';
import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type EventDrop,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
} from '@/lib/eventsHelpers';

import { dateAndTimeToText } from '../drop-manager/utils/parseDates';

export default function TicketQRPage() {
  const { secretKey } = useTicketClaimParams();

  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>();
  const [ticketInfoExtra, setTicketInfoExtra] = useState<TicketMetadataExtra>();

  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo: { drop_id: string } = await keypomInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        const drop: EventDrop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        const ticketMetadata: TicketInfoMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);

        const ticketExtra: TicketMetadataExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo: FunderEventMetadata | null = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });
        if (!eventInfo) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        setEventInfo(eventInfo);
        setEventId(ticketExtra.eventId);
        setFunderId(drop.funder_id);
        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting event info: ', e);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    getEventInfo();
  }, []);

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  const ticketDetails = () => {
    return (
      <VStack spacing="0">
        <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="500" textAlign="center">
          {ticketInfo?.title}
        </Heading>
        <Heading fontSize={{ base: 'xs', md: 'xs' }} fontWeight="500" textAlign="center">
          {ticketInfoExtra && dateAndTimeToText(ticketInfoExtra?.passValidThrough)}
        </Heading>
      </VStack>
    );
  };

  return (
    <VStack py="10">
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
              color="gray.500"
              fontFamily="body"
              fontSize={['sm', 'md']} // smaller font on small screens, adjust as needed
              fontWeight="500"
              pb={8}
            >
              {eventInfo?.location || 'Online'}
            </Text>
          </GridItem>

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
            icon={
              <Skeleton isLoaded={!isLoading}>
                <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
              </Skeleton>
            }
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
                    eventName={eventInfo!.name}
                    funderId={funderId}
                    qrValue={secretKey}
                    ticketInfoExtra={ticketInfoExtra}
                    ticketName={ticketInfo!.title}
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
                    objectFit="contain"
                    src={eventInfo?.artwork}
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
