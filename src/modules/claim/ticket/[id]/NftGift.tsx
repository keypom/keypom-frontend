import { Hide, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/common/components/AvatarImage';

interface NftGiftProps {
  imageSrc: string;
  giftName: string;
}

export const NftGift = ({ imageSrc, giftName }: NftGiftProps) => {
  return (
    <>
      <AvatarImage altName={giftName} imageSrc={imageSrc} />
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
