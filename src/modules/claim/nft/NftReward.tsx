import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react';

interface NftRewardProps {
  artworkSrc: string;
  nftName: string;
  description: string;
}

export const NftReward = ({ artworkSrc, nftName, description }: NftRewardProps) => {
  return (
    <Flex align="center" flexDir="column">
      <Box
        borderRadius={{ base: '5xl', md: '6xl' }}
        h={{ base: '7.5rem', md: '11.25rem' }}
        mb={{ base: '6', md: '10' }}
        position="relative"
        w={{ base: '7.5rem', md: '11.25rem' }}
      >
        <Image
          alt="NFT image"
          borderRadius={{ base: '5xl', md: '6xl' }}
          objectFit="cover"
          src={artworkSrc}
        />
      </Box>
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
