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
  ModalFooter,
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
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    //check if its cool
    if (answer === 'http://en.m.wikipedia.org') {
      toast({
        title: 'Valid',
        description: `Your ticket is valid for this event`,
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Invalid',
      description: 'Your ticket is invalid',
      status: 'error',
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Text textAlign="left" color="black">
          Ticket Name
        </Text>
        <Text textAlign="left">{event.name}</Text>
        <Text textAlign="left" mt="4" color="black">
          Description
        </Text>
        <Text textAlign="left">{event.description}</Text>
        <Text textAlign="left" mt="4" color="black">
          Date
        </Text>
        <Text textAlign="left">{event.date}</Text>
        <Text textAlign="left" mt="4" color="black">
          Location
        </Text>
        <Text textAlign="left">{event.location}</Text>
        <HStack>
          <Text textAlign="left" mt="4" color="black">
            Scan QR Code
            <Tooltip label="Enable your camera when asked, then hold your QR code up to the camera and wait for a popup.">
              <Icon mx="2" as={InfoOutlineIcon} />
            </Tooltip>
          </Text>
        </HStack>

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

        <Text textAlign="left" mt="4" color="black">
          Ticket Information
        </Text>
        <Text textAlign="left">{data}</Text>

        <ModalFooter>
          <Button w="100%" variant={'secondary'} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
