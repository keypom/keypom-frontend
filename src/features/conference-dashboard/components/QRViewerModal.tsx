import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { ModalWrapper } from './CreateDropModal/ModalWrapper';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrls: string[]; // Array of QR code URLs
  onDownload: (url: string) => void;
  onDownloadAll: (urls: string[]) => void;
}

const QRViewerModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeUrls,
  onDownload,
  onDownloadAll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQrCodes = qrCodeUrls.length;

  const handlePrevious = () => {
    if (totalQrCodes > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalQrCodes) % totalQrCodes);
    }
  };

  const handleNext = () => {
    if (totalQrCodes > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalQrCodes);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        QR Code{totalQrCodes > 1 ? ` (${currentIndex + 1} of ${totalQrCodes})` : ''}
      </ModalHeader>
      <ModalBody>
        {totalQrCodes > 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            {totalQrCodes > 1 ? (
              <Box display="flex" justifyContent="center" mb={4}>
                <IconButton
                  aria-label="Previous QR Code"
                  icon={<ChevronLeftIcon />}
                  onClick={handlePrevious}
                  isDisabled={totalQrCodes <= 1}
                  mr={2}
                />
                <img src={qrCodeUrls[currentIndex]} alt={`QR Code ${currentIndex + 1}`} />
                <IconButton
                  aria-label="Next QR Code"
                  icon={<ChevronRightIcon />}
                  onClick={handleNext}
                  isDisabled={totalQrCodes <= 1}
                  ml={2}
                />
              </Box>
            ) : (
              <img src={qrCodeUrls[0]} alt={`QR Code`} />
            )}
            {totalQrCodes === 1 && <Text mb={4}>Scan this QR code to get the rewards.</Text>}
            {totalQrCodes > 1 && (
              <Text mb={4}>This is a scavenger hunt. Scan all QR codes to get the rewards.</Text>
            )}
          </Box>
        ) : (
          <Text>No QR codes available.</Text>
        )}
      </ModalBody>
      <ModalFooter>
        {totalQrCodes > 1 && (
          <Button colorScheme="blue" mr={3} onClick={() => onDownloadAll(qrCodeUrls)}>
            Download All
          </Button>
        )}
        {totalQrCodes > 0 && (
          <Button colorScheme="blue" mr={3} onClick={() => onDownload(qrCodeUrls[currentIndex])}>
            Download
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};

export default QRViewerModal;
