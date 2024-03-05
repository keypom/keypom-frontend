import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

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
    // check if its cool
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
      <ModalContent maxH="90vh" p="8">
        <Box maxH="90vh" overflowY="auto" p="0">
          <ModalCloseButton />
          <HStack>
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="medium"
              my="4px"
              textAlign="left"
            >
              Scan QR Code
              <Tooltip label="Enable your camera when asked, then hold your QR code up to the camera and wait for a popup.">
                <Icon as={InfoOutlineIcon} mx="2" />
              </Tooltip>
            </Text>
          </HStack>

          <QrReader
            style={{ width: '100%' }}
            onResult={(result, error) => {
              if (result) {
                setData(result?.text);
                checkData(result?.text);
              }

              if (error) {
                console.info(error);
              }
            }}
          />

          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            my="4px"
            textAlign="left"
          >
            Ticket Information
          </Text>
          <Text textAlign="left">{data}</Text>

          {data != 'No result' ? (
            <>
              <Text
                as="h2"
                color="black.800"
                fontSize="xl"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                Ticket Name TODO: get this data
              </Text>
              <Text textAlign="left">{event.name}</Text>
              <Text
                as="h2"
                color="black.800"
                fontSize="l"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                Description
              </Text>
              <Text textAlign="left">{event.description}</Text>
              <Text
                as="h2"
                color="black.800"
                fontSize="l"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                Date
              </Text>
              <Text textAlign="left">{event.date}</Text>
              <Text
                as="h2"
                color="black.800"
                fontSize="l"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                Location
              </Text>
              <Text textAlign="left">{event.location}</Text>
            </>
          ) : null}

          <ModalFooter>
            <Button variant={'secondary'} w="100%" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};
