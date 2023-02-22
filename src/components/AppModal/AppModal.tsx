import { useState } from 'react';
import {
  Modal,
  ModalBody,
  Button,
  ButtonGroup,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
} from '@chakra-ui/react';

import { useAppContext } from '@/contexts/AppContext';

// TODO: enhance css after merging sushan's sign in modal branch
export const AppModal = () => {
  const { appModal, setAppModal } = useAppContext();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      isOpen={appModal.isOpen}
      onClose={() => {
        setAppModal({
          isOpen: false,
        });
      }}
    >
      <ModalOverlay />
      <ModalContent p={{ base: '8', md: '16' }} textAlign="center">
        <ModalHeader
          alignItems="center"
          display="flex"
          flexDir="column"
          fontSize={{ base: 'xl', md: '2xl' }}
          pb="0"
        >
          {appModal.header && <h4>{appModal.header}</h4>}
        </ModalHeader>
        <ModalBody>
          {appModal.message && <p>{appModal.message}</p>}

          {appModal.inputs && appModal.inputs.length > 0 && (
            <>
              {appModal.inputs.map(({ placeholder, valueKey }, i) => (
                <Input
                  key={i}
                  placeholder={placeholder}
                  type="text"
                  onChange={(e) => {
                    setValues({
                      ...values,
                      ...{ [valueKey]: e.target.value },
                    });
                  }}
                />
              ))}
            </>
          )}
        </ModalBody>

        {appModal.options && appModal.options.length > 0 && (
          <ModalFooter>
            <ButtonGroup>
              {appModal.options.map(({ label, func, buttonProps }, i) => (
                <Button
                  key={i}
                  isLoading={loading}
                  onClick={async () => {
                    setLoading(true);
                    await func(values);
                    setLoading(false);
                    setAppModal({ isOpen: false });
                  }}
                  {...buttonProps}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
