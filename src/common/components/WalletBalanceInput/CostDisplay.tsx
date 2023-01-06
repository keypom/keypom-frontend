import { HStack, Text } from '@chakra-ui/react';

interface CostDisplayProps {
  totalCost: number | string;
  balanceAmount: number | string;
  symbol: string;
}

export const CostDisplay = ({ totalCost, balanceAmount, symbol }: CostDisplayProps) => {
  return (
    <HStack mt="1.5" spacing="auto">
      <Text color="gray.400" fontSize="sm">
        Total cost: {totalCost} {symbol}
      </Text>
      <Text color="gray.400" fontSize="sm">
        Balance: {balanceAmount} {symbol}
      </Text>
    </HStack>
  );
};
