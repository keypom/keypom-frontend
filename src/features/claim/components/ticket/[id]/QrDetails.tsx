import { Box, Button, Flex, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

interface QrDetailsProps {
  qrValue: string;
  ticketName: string;
  onClick?: () => void;
}

export const QrDetails = ({ qrValue, ticketName, onClick }: QrDetailsProps) => {
  return (
    <Flex align="center" flexDir="column" p={{ base: '6', md: '8' }} pt={{ base: '12', md: '16' }}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="12px"
        mb={{ base: '6', md: '10' }}
        p="5"
      >
        <QRCode size={120} value={qrValue} />
      </Box>
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
