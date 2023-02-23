import { Flex, Text, VStack } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';

interface NftRewardProps {
  artworkSrc: string;
  nftName: string;
  description: string;
}

export const NftReward = ({ artworkSrc, nftName, description }: NftRewardProps) => {
  return (
    <Flex align="center" flexDir="column">
      <AvatarImage altName={nftName} imageSrc={artworkSrc} />
      <VStack spacing="4">
        <Text
          color="gray.800"
          fontWeight="500"
          maxH="300px"
          overflowY="scroll"
          size={{ base: 'xl', md: '2xl' }}
        >
          {nftName}
        </Text>
        <Text color="gray.600" maxH="300px" overflowY="scroll" size={{ base: 'sm', md: 'base' }}>
          {description}
        </Text>
      </VStack>
    </Flex>
  );
};
