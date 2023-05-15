import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

import { type ITicketData } from '@/types/common';
import { FormControl } from '@/components/FormControl';

interface TicketCardProps {
  ticket: ITicketData;
  id: string;
  onRemoveClick?: () => void;
  onEditClick?: () => void;
}

export const TicketCard = ({ ticket, id, onRemoveClick, onEditClick }: TicketCardProps) => {
  return (
    <Card
      key={id}
      // border="2px solid black"
      // borderRadius="8xl"
      minH="200px"
      my="4"
      p="4"
      textAlign="left"
      w="full"
    >
      <CardHeader>
        <Heading size="sm">{ticket.name}</Heading>
      </CardHeader>
      <CardBody>
        <FormControl label="Number of tickets">
          <Text>{ticket.numberOfTickets}</Text>
        </FormControl>

        {ticket.description && (
          <FormControl label="Description">
            <Text>{ticket.description}</Text>
          </FormControl>
        )}
        <FormControl label="Date range">
          <Text>
            {new Date(ticket.salesStartDate).toLocaleString()} -{' '}
            {new Date(ticket.salesEndDate).toLocaleString()}
          </Text>
        </FormControl>
        <FormControl label="Price">
          <Text>{ticket.nearPricePerTicket} NEAR</Text>
        </FormControl>
      </CardBody>
      {onRemoveClick && onEditClick && (
        <>
          <Divider />
          <CardFooter>
            <Stack direction="row" justify="flex-end" w="full">
              <Button variant="secondary" onClick={onEditClick}>
                Edit
              </Button>
              <Button colorScheme="red" ml="3" variant="outline" onClick={onRemoveClick}>
                Remove
              </Button>
            </Stack>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
