import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

import { type TicketMetadataExtra } from '@/lib/eventsHelpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

interface QrDetailsProps {
  qrValue: string;
  ticketName: string;
  eventName: string;
  eventId: string;
  funderId: string;
  ticketInfoExtra?: TicketMetadataExtra;
}

export const QrDetails = ({
  qrValue,
  ticketName,
  eventName,
  eventId,
  funderId,
  ticketInfoExtra,
}: QrDetailsProps) => {
  const navigate = useNavigate();
  const handleDownloadQrCode = () => {
    const svg = document.getElementById('QRCode');

    if (svg === null) {
      console.error('QR code is not found on document.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      console.error('ctx is null');
      return;
    }

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${ticketName}_Keypom_Ticket_QR_CODE`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Flex align="center" flexDir="column" p={{ base: '6', md: '8' }} pt={{ base: '12', md: '16' }}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="12px"
        mb={{ base: '6', md: '10' }}
        p="5"
      >
        <QRCode id="QRCode" size={240} value={qrValue} />
      </Box>
      <Text color="gray.800" fontWeight="500" mb="1" size="xl" textAlign="center">
        {eventName}
      </Text>

      <Text color="gray.600" mb="6" size={{ base: 'sm', md: 'sm' }} textAlign="center">
        Save this QR code and show it at the event to gain entry.
      </Text>
      <VStack w="full">
        <Button variant="outline" w="full" onClick={handleDownloadQrCode}>
          Download QR code
        </Button>
        <VStack spacing="1" w="full">
          <Button
            variant="outline"
            w="full"
            onClick={() => {
              navigate(`/gallery/${funderId}:${eventId}#secretKey=${qrValue}`);
            }}
          >
            Sell Ticket
          </Button>
          <Heading
            fontFamily="body"
            fontSize={{ base: 'xs', md: 'xs' }}
            fontWeight="500"
            textAlign="center"
          >
            Can be sold through:
          </Heading>
          <Heading fontSize={{ base: 'xs', md: 'xs' }} fontWeight="500" textAlign="center">
            {ticketInfoExtra && dateAndTimeToText(ticketInfoExtra?.salesValidThrough)}
          </Heading>
        </VStack>
      </VStack>
    </Flex>
  );
};
