import { VStack } from '@chakra-ui/react';

import { DropBox } from '@/components/DropBox';
import { type TokenAsset } from '@/features/claim/routes/TokenClaimPage';

interface TokenGiftProps {
  tokenList: TokenAsset[];
}

export const TokenGift = ({ tokenList }: TokenGiftProps) => {
  return (
    <VStack mb="5" w="full">
      {tokenList.map(({ icon, value, symbol }, index) => (
        <DropBox key={index} icon={icon} symbol={symbol} value={value} />
      ))}
    </VStack>
  );
};
