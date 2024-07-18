import { Box, Center, Heading, Spinner, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';
import { useNavigate } from 'react-router-dom';

import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  defaultEventInfo,
  defaultTicketInfo,
  defaultTicketInfoExtra,
} from '@/lib/eventsHelpers';

import TicketQRPage from './TicketQRPage';
import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';

export default function SpecialTicketPage() {
  const { secretKey } = useTicketClaimParams();
  const navigate = useNavigate();

  // State variables for managing the ticket and event information
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>(defaultEventInfo);
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>(defaultTicketInfo);
  const [ticketInfoExtra, setTicketInfoExtra] =
    useState<TicketMetadataExtra>(defaultTicketInfoExtra);

  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');

  const onScanned = () => {
    window.location.reload();
  };

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo = await keypomInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        const drop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        const ticketData = await keypomInstance.viewCall({
          contractId: "foo",
          methodName: 'get_ticket_data',
          args: { drop_id: keyInfo.drop_id },
        });

        const maxUses = drop.max_key_uses;
        const curStep = drop.max_key_uses - keyInfo.uses_remaining + 1;

        const ticketMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);
        const ticketExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });

        if ((maxUses !== 3 && maxUses !== 2) || !eventInfo) {
          console.error('Invalid ticket');
          console.log('maxUses', maxUses);
          console.log('curStep', curStep);
          console.log('eventInfo', eventInfo);
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        const eventId: string = ticketExtra.eventId;
        if (curStep !== 1 || maxUses === 2) {
          console.error("TODO")
        }

        setEventInfo(eventInfo);
        setEventId(eventId);
        setFunderId(drop.funder_id);

        // eslint-disable-next-line no-console
        console.log('eventInfo', eventInfo);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata', ticketMetadata);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata Extra', ticketExtra);

        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting event info: ', e);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    getEventInfo();
  }, [secretKey]);

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">FooBar</Heading>

          {/** Claim token component */}
          <IconBox
            icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
            w={{ base: '345px', md: '30rem' }}
          >
            <BoxWithShape
              bg="white"
              borderTopRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '12', md: '16' }}
              px={{ base: '6', md: '8' }}
              shapeSize="md"
              w="full "
            >
              Bar
            </BoxWithShape>
            <VStack
              bg="gray.50"
              borderBottomRadius="8xl"
              p="8"
              spacing={{ base: '4', md: '5' }}
              w="full"
            >
              
              Baz
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
}
