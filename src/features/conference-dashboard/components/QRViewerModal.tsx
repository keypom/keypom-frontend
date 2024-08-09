import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  onDownload: () => void;
}

const QRViewerModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, qrCodeUrl, onDownload }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>QR Code</ModalHeader>
      <ModalBody>
        <Box display="flex" justifyContent="center" mb={4}>
          <img src={qrCodeUrl} alt="QR Code" />
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onDownload}>
          Download
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default QRViewerModal;
