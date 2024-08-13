import React, { useRef } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { type FunderEventMetadata, type TicketInfoMetadata } from '@/lib/eventsHelpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

interface QrDetailsProps {
  qrValue: string;
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
}

export const QrDetails = ({ qrValue, eventInfo, ticketInfo }: QrDetailsProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // const downloadQRCode = () => {
  //   const svg = svgRef.current;

  //   if (svg) {
  //     const svgData = new XMLSerializer().serializeToString(svg);
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');

  //     if (ctx) {
  //       const img = new Image();

  //       img.onload = () => {
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);
  //         const pngFile = canvas.toDataURL('image/png');
  //         const downloadLink = document.createElement('a');
  //         downloadLink.download = `${ticketInfo?.title}_Ticket_QR_CODE`;
  //         downloadLink.href = pngFile;
  //         downloadLink.click();
  //       };
  //       img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  //     } else {
  //       console.error('ctx is null');
  //     }
  //   } else {
  //     console.error('QR code is not found on document.');
  //   }
  // };

  return (
    <Flex align="center" flexDir="column" p={{ base: '6', md: '8' }} pt={{ base: '12', md: '16' }}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="12px"
        mb={{ base: '2', md: '2' }}
        p="5"
      >
        <QRCode ref={svgRef} size={240} value={qrValue} />
      </Box>
      <Text
        color="event.h1"
        fontFamily="heading"
        fontWeight="600"
        mb="1"
        size={{ base: 'lg', md: '2xl' }}
        textAlign="center"
      >
        {dateAndTimeToText(eventInfo.date, '', false, true)}
      </Text>
      <Text
        color="event.h3"
        fontFamily="heading"
        fontSize="sm"
        mb="6"
        size={{ base: 'sm', md: 'sm' }}
        textAlign="center"
      >
        Keep this open after you're scanned into the event.
      </Text>
    </Flex>
  );
};
