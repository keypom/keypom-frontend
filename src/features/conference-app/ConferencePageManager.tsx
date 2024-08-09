import { useEffect, useState } from 'react';
import { Center, Spinner, VStack, Text } from '@chakra-ui/react';
import { getPubFromSecret } from '@keypom/core';

import InConferenceApp from '@/features/conference-app/InConferenceApp';
import { NotFound404 } from '@/components/NotFound404';
import eventHelperInstance from '@/lib/event';
import {
  type FunderEventMetadata,
  type EventDrop,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  defaultEventInfo,
  defaultDropInfo,
  defaultTicketInfo,
  defaultTicketInfoExtra,
} from '@/lib/eventsHelpers';
import { useConferenceClaimParams } from '@/hooks/useConferenceClaimParams';
import WelcomePage from '@/features/conference-app/WelcomePage';
import { ConferenceProvider } from '@/contexts/ConferenceContext';
import { TOKEN_FACTORY_CONTRACT } from '@/constants/common';

export default function ConferencePageManager() {
  const { secretKey } = useConferenceClaimParams();

  // State variables for managing the ticket and event information
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>(defaultEventInfo);
  const [dropInfo, setDropInfo] = useState<EventDrop>(defaultDropInfo);
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>(defaultTicketInfo);
  const [ticketInfoExtra, setTicketInfoExtra] =
    useState<TicketMetadataExtra>(defaultTicketInfoExtra);

  const [curKeyStep, setCurKeyStep] = useState<number>(1);
  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');
  const [ticker, setTicker] = useState<string>('');
  const [tokensToClaim, setTokensToClaim] = useState<string>('');

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo = await eventHelperInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        console.log('Key Info: ', keyInfo);
        const drop = await eventHelperInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        console.log('Drop Info: ', drop);
        setDropInfo(drop);
        const curKeyStep = drop.max_key_uses - keyInfo.uses_remaining + 1;
        setCurKeyStep(curKeyStep);

        const tokenInfo = await eventHelperInstance.viewCall({
          contractId: TOKEN_FACTORY_CONTRACT,
          methodName: 'ft_metadata',
          args: { drop_id: drop.drop_id },
        });
        const ticketInfo = await eventHelperInstance.viewCall({
          contractId: TOKEN_FACTORY_CONTRACT,
          methodName: 'get_ticket_data',
          args: { drop_id: drop.drop_id },
        });
        setTicker(tokenInfo.symbol);
        setTokensToClaim(eventHelperInstance.yoctoToNear(ticketInfo.starting_token_balance));

        const ticketMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);
        const ticketExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo = await eventHelperInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });

        if (!eventInfo) {
          console.log('Event info not set: ', eventInfo);
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        setEventInfo(eventInfo);
        setEventId(ticketExtra.eventId);
        setFunderId(drop.funder_id);

        console.log('eventInfo', eventInfo);
        console.log('Ticket Metadata', ticketMetadata);
        console.log('Ticket Metadata Extra', ticketExtra);

        setIsLoading(false);
      } catch (e) {
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

  if (isLoading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading ticket information...</Text>
        </VStack>
      </Center>
    );
  }

  const initialData = {
    dropInfo,
    eventId,
    eventInfo,
    funderId,
    isLoading,
    secretKey,
    ticker,
    ticketInfo,
    ticketInfoExtra,
  };

  switch (curKeyStep) {
    case 2:
      return (
        <WelcomePage
          eventInfo={eventInfo}
          isLoading={isLoading}
          secretKey={secretKey}
          ticker={ticker}
          ticketInfo={ticketInfo}
          tokensToClaim={tokensToClaim}
        />
      );
    case 3:
      return (
        <ConferenceProvider initialData={initialData}>
          <InConferenceApp />
        </ConferenceProvider>
      );
    default:
      return (
        <NotFound404 header="Invalid ticket" subheader="Please contact the event organizers" />
      );
  }
}
