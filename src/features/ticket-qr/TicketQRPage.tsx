import { Box, Center, Flex, Heading, Hide, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { QrDetails } from '@/features/claim/components/ticket/QrDetails';
import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import { type FunderEventMetadata, type EventDropMetadata } from '@/lib/eventsHelpers';

export default function TicketQRPage() {
  const { dropId, secretKey } = useTicketClaimParams();

  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [ticketName, setTicketName] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    const getEventInfo = async () => {
      setIsLoading(true);
      const pubKey = getPubFromSecret(secretKey);
      const keyInfo: { drop_id: string } = await keypomInstance.viewCall({
        methodName: 'get_key_information',
        args: { key: pubKey },
      });
      const drop: { drop_id: string; funder_id: string; drop_config: { metadata: string } } =
        await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
      const ticketMetadata: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      const eventInfo: FunderEventMetadata = await keypomInstance.getEventInfo({
        accountId: drop.funder_id,
        eventId: ticketMetadata.eventId,
      });
      console.log('eventInfo', eventInfo);
      console.log('ticketMetadata', ticketMetadata);
      setTicketName(ticketMetadata.name);
      setEventImage(eventInfo.artwork);
      setEventName(eventInfo.name);
      setIsLoading(false);
    };
    try {
      getEventInfo();
    } catch (e) {
      console.error('Error getting event info: ', e);

      setIsValid(false);
    }
  }, []);

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  return (
    <Center>
      <VStack
        gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}
        paddingBottom="20"
        paddingTop="20"
      >
        <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="500" textAlign="center">
          {ticketName}
        </Heading>

        <IconBox
          icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
          maxW={{ base: '345px', md: '30rem' }}
          minW={{ base: 'inherit', md: '345px' }}
          p="0"
          pb="0"
        >
          <Box>
            <BoxWithShape bg="white" borderTopRadius="8xl" w="full">
              <QrDetails eventName={eventName} qrValue={secretKey} ticketName={ticketName} />
            </BoxWithShape>
            <Flex
              align="center"
              bg="gray.50"
              borderBottomRadius="8xl"
              flexDir="column"
              px="6"
              py="8"
            >
              <Image
                alt={`Event image for ${ticketName}`}
                borderRadius="12px"
                objectFit="contain"
                src={eventImage}
              />
              <Hide above="md">
                <Text
                  color="gray.600"
                  fontWeight="600"
                  mb="2"
                  size={{ base: 'sm', md: 'md' }}
                  textAlign="center"
                >
                  {eventName}
                </Text>
              </Hide>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
}
