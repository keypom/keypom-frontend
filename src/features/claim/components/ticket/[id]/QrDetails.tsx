import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

import { AvatarImage } from '@/components/AvatarImage';

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
        fontWeight="500"
        mb="4"
        size={{ base: 'xl', md: '2xl' }}
        textAlign="center"
      >
        {ticketName}
      </Text>
      <Text color="gray.600" mb="6" size={{ base: 'sm', md: 'md' }} textAlign="center">
        A copy has been sent to your email. Save this QR code and show it at the event.{' '}
      </Text>
      <Button variant="outline" w="full" onClick={onClick}>
        Download QR code
      </Button>
    </Flex>
  );
};
