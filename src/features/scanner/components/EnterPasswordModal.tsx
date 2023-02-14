import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { TextInput } from '@/components/TextInput';

interface EnterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalErrorText: string;
  passwordOnChange: (val: string) => void;
  handleOkClick: () => void;
  handleCancelClick: () => void;
}

export const EnterPasswordModal = ({
  isOpen,
  onClose,
  modalErrorText = '',
  passwordOnChange,
  handleOkClick,
  handleCancelClick,
}: EnterPasswordModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          {modalErrorText !== '' && <Text variant="error">{modalErrorText}</Text>}
          <TextInput
            label="Enter password"
            onChange={(e) => {
              passwordOnChange(e.target.value);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={handleOkClick}>
            Ok
          </Button>
          <Button variant="ghost" onClick={handleCancelClick}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
