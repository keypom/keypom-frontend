import { Button, HStack } from '@chakra-ui/react';

interface TicketIncrementerProps {
  decrementAmount: () => void;
  incrementAmount: () => void;
  amount: number;
  maxAmount?: number;
}

export const TicketIncrementer = ({
  decrementAmount,
  incrementAmount,
  amount,
  maxAmount,
}: TicketIncrementerProps) => {
  return (
    <>
      <HStack mt="2">
        <Button
          isDisabled={amount <= 1}
          type="button"
          variant="secondary"
          w="7px"
          onClick={decrementAmount}
        >
          -
        </Button>
        <Button variant="secondary" w="7px">
          {amount}
        </Button>
        <Button
          isDisabled={maxAmount ? amount >= maxAmount : false}
          type="button"
          variant="secondary"
          w="7px"
          onClick={incrementAmount}
        >
          +
        </Button>
      </HStack>
    </>
  );
};
