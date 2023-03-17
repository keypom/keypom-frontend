import { Box, useBoolean, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import keypomInstance from '@/lib/keypom';

import { EventCard } from '../components/EventCard';
import { EventHeader } from '../components/EventHeader';

const EventPage = () => {
  const { accountId = '' } = useParams();

  const [loading, setLoading] = useBoolean(true);
  const [data, setData] = useState<any[]>([]);

  // TODO: get all drops and categorized based on the events
  const handleGetDrops = useCallback(async () => {
    const drops = await keypomInstance.getDrops({ accountId, start: 0, limit: 99 });

    const filteredDrops = drops.filter((drop) => {
      const { eventId } = keypomInstance.getDropMetadata(drop.metadata);
      return !!eventId;
    });

    const events = {};
    filteredDrops.forEach((drop) => {
      const { eventId, eventName, dropName, wallets } = keypomInstance.getDropMetadata(
        drop.metadata,
      );

      if (events[eventId] === undefined) events[eventId] = [];
      events[eventId].push({
        eventId,
        eventName,
        dropName,
        wallets,
        ...drop,
      });
    });

    const dataArray = [];
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
      <>{JSON.stringify(data)}</>
      {!loading && (
        <VStack maxW="995px" mx="auto" spacing="6">
          {data.map((event) => (
            <EventCard key={event[0].eventId} eventName={event[0].eventName} ticketArray={event} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default EventPage;
