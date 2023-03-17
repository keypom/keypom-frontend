import { Box, Button, Flex, Heading, Show, SimpleGrid, Text } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { IconBox } from '@/components/IconBox';

import { TicketCard } from './TicketCard';

interface EventCardProps {
  eventName: string;
  ticketArray: any[];
}

export const EventCard = ({ eventName, ticketArray = [] }: EventCardProps) => {
  const eventId = `event-${eventName}`;

  const { handleSubmit, control, watch } = useForm({
    // TODO: populate with relevant drops (compared to the EVENT_NAME)
    defaultValues: {
      [eventId]: ticketArray.map((ticket) => ({
        ticketId: `${ticket.eventId}`,
        ticketName: `${ticket.dropName}`,
        value: 0,
      })),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: eventId,
  });

  const handleOnSubmit = async () => {
    console.log(eventId, watch());
  };

  useEffect(() => {
    console.log(watch());
  }, [watch('test')]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <IconBox
        borderRadius={{ base: '1rem', md: '8xl' }}
        overflow="hidden"
        p="0"
        pb="0"
        position="relative"
        w="full"
      >
        <Show above="md">
          <Box
            bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            bottom="-123px"
            filter="blur(100px)"
            h="793px"
            overflow="hidden"
            position="absolute"
            right="-123px"
            transform="rotate(30deg)"
            w="606px"
            zIndex="1"
          />
        </Show>
        <Flex
          flexDir="column"
          position="relative"
          px={{ base: '8', md: '16' }}
          py={{ base: '8', md: 'auto' }}
          zIndex="2"
        >
          <Flex
            flex={{ base: 'auto', md: '1' }}
            flexDir="column"
            justify="center"
            mb="8"
            overflow="hidden"
            position="relative"
            textAlign="left"
          >
            <Heading>{eventName}</Heading>
            <Text>09:00 - 21:00</Text>
          </Flex>
          <SimpleGrid columns={3} mb="4" spacingX="40px" spacingY="40px">
            {fields.map((item, index) => {
              const FIELD_NAME = `${eventId}.${index}.value` as const;
              return (
                <Controller
                  key={item.id}
                  control={control}
                  name={FIELD_NAME}
                  render={({ field, fieldState }) => (
                    <TicketCard
                      field={field}
                      fieldState={fieldState}
                      name={FIELD_NAME}
                      ticketName={item.ticketName}
                    />
                  )}
                />
              );
            })}
          </SimpleGrid>
          <Flex justify="flex-end">
            <Button type="submit" w="120px">
              Buy
            </Button>
          </Flex>
        </Flex>
      </IconBox>
    </form>
  );
};
