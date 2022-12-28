import { HStack } from '@chakra-ui/react';

import { Text } from '../Typography';

export const CostDisplay = ({ totalCost, balanceAmount, symbol }) => {
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
