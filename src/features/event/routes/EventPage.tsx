import { Box, useBoolean, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';

import { EventCard } from '../components/EventCard';
import { EventHeader } from '../components/EventHeader';
import { type EventCardMetadata } from '../types/common';

const EventPage = () => {
  const { accountId = '' } = useParams();

  const [loading, setLoading] = useBoolean(true);
  const [data, setData] = useState<EventCardMetadata[]>([]);

  const handleGetDrops = useCallback(async () => {
    const drops = await keypomInstance.getDrops({ accountId, start: 0, limit: 99 });

    const filteredDrops = drops.filter((drop) => {
      const { eventId } = keypomInstance.getDropMetadata(drop.metadata);
      return !!eventId;
    });

    const events: Record<string, EventCardMetadata> = {};
    filteredDrops.forEach((drop) => {
      const { eventId, eventName, dropName, wallets, description } = keypomInstance.getDropMetadata(
        drop.metadata,
      );

      if (events[eventId] === undefined) events[eventId] = [];
      events[eventId].push({
        eventId,
        eventName,
        dropName,
        wallets,
        description,
        ...drop,
      });
    });

    const dataArray: EventCardMetadata[] = [];
    for (const eventData in events) {
      dataArray.push(events[eventData]);
    }
    setData(dataArray);

    setLoading.off();
  }, []);

  useEffect(() => {
    handleGetDrops();
  }, [accountId]);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <EventHeader headerText="My Events" />
      {!loading && (
        <VStack maxW="1200px" mx="auto" spacing="6">
          {data.map((event) => (
            <EventCard key={event[0].eventId} ticketArray={event} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default EventPage;
