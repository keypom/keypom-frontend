import { Box, VStack, HStack, Image, Text, Grid, GridItem } from '@chakra-ui/react';
import { RepeatClockIcon, TimeIcon } from '@chakra-ui/icons';

import { LocationPinIcon } from '@/components/Icons/LocationPinIcon';
import { useConferenceContext } from '@/contexts/ConferenceContext';
import { type AgendaItem } from '@/features/conference-app/AgendaPage';

import { CalendarIcon } from '../Icons/CalendarIcon';

interface AgendaItemCardProps {
  item: AgendaItem;
  key: number;
}

const AgendaItemCard: React.FC<AgendaItemCardProps> = ({ item, key }: AgendaItemCardProps) => {
  const { eventInfo } = useConferenceContext();

  return (
    <VStack
      key={key}
      align="left"
      bg={item.color}
      borderRadius="md"
      boxShadow="md"
      flex="1"
      mt="4"
      px="4"
      py="4"
      spacing="0"
      w="100%"
    >
      <VStack align="left" mb="1" mt={1} spacing={0}>
        <HStack alignItems="center">
          <CalendarIcon h="15px" w="15px" />
          <Text
            isTruncated
            color="event.h3"
                        fontFamily="heading"
            fontSize="sm"
            fontWeight="400"
            h="20px"
            mb={0}
            textAlign="left"
          >
            {item.date}
          </Text>
        </HStack>
        <HStack alignItems="center">
          <TimeIcon h="15px" w="15px" />
          <Text
            isTruncated
            color="event.h3"
            fontFamily="heading"
            fontSize="sm"
            fontWeight="400"
            h="20px"
            mb={0}
            textAlign="left"
          >
            {item.time}
          </Text>
        </HStack>
        <HStack alignItems="center">
          <RepeatClockIcon h="15px" w="15px" />
          <Text
            isTruncated
            color="event.h3"
            fontFamily="heading"
            fontSize="sm"
            fontWeight="400"
            h="20px"
            mb={0}
            textAlign="left"
          >
            {item.duration}
          </Text>
        </HStack>
      </VStack>
      <VStack align="left" mt={0} spacing={2}>
        <Text
          color="gray.600"
          fontFamily="heading"
          fontSize="lg"
          fontWeight="400"
          mb={0}
          textAlign="left"
        >
          {item.title}
        </Text>
        <HStack alignItems="center">
          <LocationPinIcon h="15px" w="15px" />
          <Text
            isTruncated
            color="event.h3"
                        fontFamily="heading"
            fontSize="sm"
            fontWeight="400"
            h="20px"
            mb={0}
            textAlign="left"
          >
            {item.location}
          </Text>
        </HStack>
      </VStack>

      {item.speakers && (
        <Box overflowX="auto">
          <Grid gap={4} mb="3" mt={4} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
            {item.speakers.map((speaker, idx) => (
              <GridItem key={idx}>
                <HStack minWidth="200px" spacing={3}>
                  <Image
                    alt={speaker.name}
                    borderRadius="full"
                    boxSize="50px"
                    src={speaker.image}
                  />
                  <VStack align="start" h="60px" spacing={0} verticalAlign="middle">
                    <Text
                      isTruncated
                      color="gray.600"
                      fontFamily="heading"
                      fontSize="sm"
                      fontWeight="600"
                      h="20px"
                    >
                      {speaker.name}
                    </Text>
                    <Text
                      isTruncated
                      color="event.h3"
                      fontFamily="heading"
                      fontSize="xs"
                      fontWeight="400"
                      h="20px"
                    >
                      {speaker.title && `${speaker.title}`}
                    </Text>
                    <Text
                      isTruncated
                      color="gray.600"
                      fontFamily="heading"
                      fontSize="sm"
                      fontWeight="600"
                      h="20px"
                    >
                      {speaker.company && `${speaker.company}`}
                    </Text>
                  </VStack>
                </HStack>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}

      {item.track && (
        <Box
          alignSelf="left"
          bg="event.button.primary.bg"
          borderRadius="md"
          mt={1}
          px="2"
          py="0.5"
          w="max-content"
        >
          <Text
            color="white"
            fontFamily="heading"
            fontSize="sm"
            fontWeight="600"
            h="20px"
            mb={0}
            textAlign="left"
          >
            {item.track}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default AgendaItemCard;
