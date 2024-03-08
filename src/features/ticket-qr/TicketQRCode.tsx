import { Box, Image, Text, Center, VStack } from '@chakra-ui/react';
import { imageSync } from 'qr-image';
import { useParams } from 'react-router-dom';

export default function TicketQrCode() {

    function getQRCodeBase64(ticketKey: string): string {
        var qrImagePng = imageSync(ticketKey, { type: 'png' });
        // Convert the QR code image to base64
        return "data:image/png;base64," + qrImagePng.toString('base64');
    }

    const { ticketKey } = useParams<{ ticketKey: string }>();
    // console.log(useParams<{ ticketId: string }>());

  return <Box>
    {ticketKey ? (
        <VStack>
            <Text paddingTop="5rem" paddingBottom="1rem" fontWeight="500" size="xl">Your QR code ticket is below. Enjoy your event!</Text>
            <Center>
                <Image alt="keypom-logo" src={getQRCodeBase64(ticketKey)} w={{ base: '150px', md: '300px' }} />
            </Center>
        </VStack>
    ) : (
        <Center>
            <Text variant="error" >Ticket is invalid.</Text>
        </Center>
    )}
   
  </Box>;
}