import { Flex, Text, VStack } from '@chakra-ui/react';

import { AvatarImage } from '@/common/components/AvatarImage';

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
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="500"
          lineHeight={{ base: '28px', md: '32px' }}
        >
          {nftName}
        </Text>
        <Text
          color="gray.600"
          fontSize={{ base: 'sm', md: 'base' }}
          lineHeight={{ base: '20px', md: '24px' }}
        >
          {description}
        </Text>
      </VStack>
    </Flex>
  );
};
