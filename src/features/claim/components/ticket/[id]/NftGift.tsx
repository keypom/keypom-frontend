import { Hide, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';

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
          fontWeight="600"
          mb="2"
          size={{ base: 'sm', md: 'md' }}
          textAlign="center"
        >
          {giftName}
        </Text>
      </Hide>
    </>
  );
};
