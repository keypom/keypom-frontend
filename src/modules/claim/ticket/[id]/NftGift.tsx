import { Box, Hide, Image, Text } from '@chakra-ui/react';

interface NftGiftProps {
  imageSrc: string;
  giftName: string;
}

export const NftGift = ({ imageSrc, giftName }: NftGiftProps) => {
  return (
    <>
      <Box
        borderRadius={{ base: '5xl', md: '6xl' }}
        h={{ base: '7.5rem', md: '11.25rem' }}
        mb="5"
        position="relative"
        w={{ base: '7.5rem', md: '11.25rem' }}
      >
        <Image
          alt={`${giftName}_image`}
          borderRadius={{ base: '5xl', md: '6xl' }}
          objectFit="cover"
          src={imageSrc}
        />
      </Box>
      <Hide above="md">
        <Text
          color="gray.600"
          fontSize={{ base: 'sm', md: 'base' }}
          fontWeight="600"
          lineHeight={{ base: '20px', md: '24px' }}
          mb="2"
          textAlign="center"
        >
          {giftName}
        </Text>
      </Hide>
    </>
  );
};
