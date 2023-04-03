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
        <Text>Number of tickets: {ticket.numberOfTickets}</Text>
        {ticket.description && <Text>Description: {ticket.description}</Text>}
        <Text>
          Sales period: {ticket.salesStartDate} - {ticket.salesStartDate}
        </Text>
        <Text>Price: {ticket.nearPricePerTicket} NEAR</Text>
      </CardBody>
      {onRemoveClick && onEditClick && (
        <>
          <Divider />
          <CardFooter>
            <Stack direction="row" justify="flex-end" w="full">
              {/* <Button variant="secondary" onClick={onEditClick}>
            Edit - temporarily disable
          </Button> */}
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
