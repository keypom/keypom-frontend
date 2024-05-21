import { type BoxProps, SimpleGrid, Box, Text } from '@chakra-ui/react';

import { type EventInterface } from '@/pages/Event';
import { type DataItem } from '@/components/Table/types';

import { TicketCard } from './TicketCard';

// props validation
interface GalleryGridProps extends BoxProps {
  loading?: boolean;
  data: EventInterface[];
}

export const GalleryGrid = ({ loading = false, data = [], ...props }: GalleryGridProps) => {
  const loadingdata: DataItem[] = [];

  // append 10 loading cards
  for (let i = 0; i < 10; i++) {
    const loadingCard = {
      id: i,
      name: 'Loading',
      type: 'Type 1',
      media: 'https://via.placeholder.com/300',
      claimed: 100,
    };
    loadingdata.push(loadingCard);
  }

  const temp = loading ? [...loadingdata] : [...data];

  return (
    <>
      <Box h="full" mt="5" p="0px" pb="0px" w="full">
        {(temp === undefined || temp.length === 0) && (
          <Box textAlign="center" w="full">
            <Text color="black.800" fontSize="xl" fontWeight="medium" mt="10">
              No events found with current filters
            </Text>
          </Box>
        )}
        <SimpleGrid minChildWidth="340px" spacing={5}>
          {temp?.map((event) => (
            <TicketCard key={event.id} event={event} loading={loading} surroundingNavLink={true} />
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};
