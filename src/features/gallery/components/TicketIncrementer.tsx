import { Button, HStack } from '@chakra-ui/react';

interface TicketIncrementerProps {
  decrementAmount: () => void;
  incrementAmount: () => void;
  amount: number;
}

export const TicketIncrementer = ({
  decrementAmount,
  incrementAmount,
  amount,
}: TicketIncrementerProps) => {
  return (
    <>
      <HStack mt="2">
        <Button type="button" variant="secondary" w="7px" onClick={decrementAmount}>
          -
        </Button>
        <Button variant="secondary" w="7px">
          {amount}
        </Button>
        <Button type="button" variant="secondary" w="7px" onClick={incrementAmount}>
          +
        </Button>
      </HStack>
    </>
  );
};
