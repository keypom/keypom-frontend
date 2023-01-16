import { Button, Flex, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/common/components/AvatarImage';

interface QrDetailsProps {
  qrSrc: string;
  ticketName: string;
  onClick?: () => void;
}

export const QrDetails = ({ qrSrc, ticketName, onClick }: QrDetailsProps) => {
  return (
    <Flex align="center" flexDir="column" p={{ base: '6', md: '8' }} pt={{ base: '12', md: '16' }}>
      <AvatarImage
        altName="qr_code"
        border="1px solid"
        borderColor="gray.200"
        imageSrc={qrSrc}
        p="2"
      />
      <Text
        color="gray.800"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="500"
        lineHeight={{ base: '28px', md: '32px' }}
        mb="4"
        textAlign="center"
      >
        {ticketName}
      </Text>
      <Text
        color="gray.600"
        fontSize={{ base: 'sm', md: 'base' }}
        lineHeight={{ base: '20px', md: '24px' }}
        mb="6"
        textAlign="center"
      >
        A copy has been sent to your email. Save this QR code and show it at the event.{' '}
      </Text>
      <Button variant="outline" w="full" onClick={onClick}>
        Download QR code
      </Button>
    </Flex>
  );
};
