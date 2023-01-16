import { Flex, Hide, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/common/components/AvatarImage';

interface GiftDetailsProps {
  imageSrc: string;
  giftName: string;
}

export const GiftDetails = ({ imageSrc, giftName }: GiftDetailsProps) => {
  return (
    <Flex align="center" flexDir="column">
      <Hide above="md">
        <Text color="gray.800" fontSize="lg" fontWeight="500" lineHeight="28px" mb="8">
          Attendance gifts
        </Text>
      </Hide>
      <AvatarImage altName={giftName} imageSrc={imageSrc} />
      <Text
        color="gray.800"
        fontSize={{ base: 'base', md: '2xl' }}
        fontWeight="500"
        lineHeight={{ base: '28px', md: '32px' }}
      >
        {giftName}
      </Text>
    </Flex>
  );
};
