import { Box, Image, Text, Center, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';

export default function TicketQrCode() {

    const { ticketKey } = useParams<{ ticketKey: string }>();
    // console.log(useParams<{ ticketId: string }>());

  return <Box>
    {ticketKey ? (
        <VStack>
            <Text paddingTop="5rem" paddingBottom="1rem" fontWeight="500" size="xl">Your QR code ticket is below. Enjoy your event!</Text>
            <Center>
                <QRCode value={ticketKey} />
            </Center>
        </VStack>
    ) : (
        <Center>
            <Text variant="error" >Ticket is invalid.</Text>
        </Center>
    )}
   
  </Box>;
}