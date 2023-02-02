import { Flex, Hide, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';

interface GiftDetailsProps {
  imageSrc: string;
  giftName: string;
}

export const GiftDetails = ({ imageSrc, giftName }: GiftDetailsProps) => {
  return (
    <Flex align="center" flexDir="column">
      <Hide above="md">
        <Text color="gray.800" fontWeight="500" mb="8" size="lg">
          Attendance gifts
        </Text>
      </Hide>
      <AvatarImage altName={giftName} imageSrc={imageSrc} />
      <Text color="gray.800" fontWeight="500" size={{ base: 'md', md: '2xl' }}>
        {giftName}
      </Text>
    </Flex>
  );
};
