import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  type UseDisclosureProps,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { RoundIcon } from '@/components/IconBox/RoundIcon';

interface DropSummaryModalProps extends UseDisclosureProps {
  confirmationText: string;
  isConfirmed?: boolean;
}

// TODO: enhance css after merging sushan's sign in modal branch
export const DropSummaryModal = ({
  isOpen,
  onClose,
  isConfirmed,
  confirmationText,
}: DropSummaryModalProps) => (
  <Modal isOpen={isOpen as boolean} onClose={() => onClose?.()}>
    <ModalOverlay />
    <ModalContent p={{ base: '8', md: '16' }} textAlign="center">
      <ModalHeader
        alignItems="center"
        display="flex"
        flexDir="column"
        fontSize={{ base: 'xl', md: '2xl' }}
        pb="0"
      >
        {isConfirmed ? (
          <>
            <RoundIcon icon={<CheckIcon color="blue.400" />} mb="6" /> Confirmed
          </>
        ) : (
          <>
            <Spinner
              color="blue.400"
              h={{ base: '16', md: '20' }}
              mb="6"
              w={{ base: '16', md: '20' }}
            />
            Waiting for Confirmation
          </>
        )}
      </ModalHeader>
      <ModalBody>{!isConfirmed && confirmationText}</ModalBody>
    </ModalContent>
  </Modal>
);
