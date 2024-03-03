import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Form } from 'react-router-dom';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export const VerifyModal = ({ isOpen, onClose, event }: VerifyModalProps) => {
  // qr code input
  const [data, setData] = useState('No result');
  const toast = useToast();

  const checkData = (answer) => {
    console.log('answer: ' + answer);
    answer = answer?.trim();
    if (answer === 'No result') {
      toast({
        title: 'No QR Code Found',
        description: `Your code wasnt read properly, please try again`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    //check if its cool
    if (answer === 'http://en.m.wikipedia.org') {
      toast({
        title: 'Valid',
        description: `Your code is a valid for this event`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Invalid',
      description: 'Your ticket is invalid',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <Image src={event.img} alt={event.title} /> */}

        <ModalHeader>
          <Flex justifyContent="space-between">
            <Box />
            <Flex justifyContent="center" flex="1">
              <div>Verify Modal</div>
            </Flex>
            <Tooltip
              label="Enable your camera when asked, then hold your QR code up to the camera and wait for a popup."
              placement="top-end"
            >
              <Icon as={InfoOutlineIcon} />
            </Tooltip>
          </Flex>
        </ModalHeader>

        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
              checkData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: '100%' }}
        />
        <p>{data}</p>

        <Text color="gray" textAlign={'left'}>
          VerifyModal {event.date}
        </Text>
        <Text color="gray" textAlign={'left'}>
          Verify Modal {event.location}
        </Text>
        <Text my="2" textAlign={'left'}>
          {event.description} LVerifyModalet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitaVerifyModalyModalecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </Text>

        <Button variant={'secondary'} onClick={onClose}>
          Cancel
        </Button>

        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
