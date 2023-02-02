import React from 'react';
import { VStack } from '@chakra-ui/react';

import { DropBox } from '@/components/DropBox';

interface TokenGiftProps {
  tokenList: Array<{ coin: string; value: number }>;
}

export const TokenGift = ({ tokenList }: TokenGiftProps) => {
  return (
    <VStack mb="5" w="full">
      {tokenList.map(({ coin, value }, index) => (
        <DropBox key={index} coin={coin} value={value} />
      ))}
    </VStack>
  );
};
