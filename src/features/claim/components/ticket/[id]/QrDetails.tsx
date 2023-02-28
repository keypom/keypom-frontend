import { Box, Button, Flex, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

interface QrDetailsProps {
  qrValue: string;
  ticketName: string;
}

export const QrDetails = ({ qrValue, ticketName }: QrDetailsProps) => {
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
        Save this QR code and show it at the event to gain entry.
      </Text>
      <Button variant="outline" w="full" onClick={handleDownloadQrCode}>
        Download QR code
      </Button>
    </Flex>
  );
};
