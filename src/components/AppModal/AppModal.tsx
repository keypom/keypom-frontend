import { useState } from 'react';
import {
  Modal,
  ModalBody,
  Button,
  ButtonGroup,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Box,
  Center,
  Spinner,
  Text,
  ModalCloseButton,
  ModalOverlay,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { useAppContext } from '@/contexts/AppContext';

import { RoundIcon } from '../IconBox/RoundIcon';

// TODO: enhance css after merging sushan's sign in modal branch
export const AppModal = () => {
  const { appModal, setAppModal } = useAppContext();

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const canClose = appModal.canClose !== undefined ? appModal.canClose : true;
  return (
    <Modal
      isCentered
      closeOnEsc={canClose}
      closeOnOverlayClick={canClose && (appModal.closeOnOverlayClick || false)}
      isOpen={appModal.isOpen}
      size={appModal.size || 'md'}
      onClose={() => {
        if (canClose) {
          setAppModal({ isOpen: false });
        }
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      {appModal.modalContent !== undefined ? (
        appModal.modalContent
      ) : (
        <ModalContent p={{ base: '4', md: '8' }} textAlign="center" top={'-5rem'}>
          <ModalHeader
            alignItems="center"
            display="flex"
            flexDir="column"
            fontSize={{ base: 'xl', md: '2xl' }}
            pb="0"
          >
            {appModal.header && <h4>{appModal.header}</h4>}
          </ModalHeader>
          {appModal.closeButtonVisible && <ModalCloseButton />}
          <ModalBody>
            {appModal.isLoading && (
              <Center>
                <Spinner
                  color="blue.400"
                  h={{ base: '16', md: '20' }}
                  mb="6"
                  w={{ base: '16', md: '20' }}
                />
              </Center>
            )}

            {appModal.isSuccess && (
              <Center>
                <RoundIcon icon={<CheckIcon color="blue.400" />} mb="6" />
              </Center>
            )}

            {appModal.isError && (
              <Center>
                <RoundIcon icon={<CloseIcon color="blue.400" />} mb="6" />
              </Center>
            )}

            {appModal.message && <Text my={2}>{appModal.message}</Text>}

            {appModal.bodyComponent !== undefined && <Box>{appModal.bodyComponent}</Box>}

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
              <ButtonGroup justifyContent="space-between" w="full">
                {appModal.options.map(({ label, func, buttonProps, lazy }, i) => (
                  <Button
                    key={i}
                    isLoading={loading}
                    onClick={async () => {
                      if (lazy) {
                        setAppModal({ isOpen: false });
                        if (func) {
                          await func(values);
                        }
                        return;
                      }
                      setLoading(true);
                      if (func) {
                        await func(values);
                      }
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
      )}
    </Modal>
  );
};
