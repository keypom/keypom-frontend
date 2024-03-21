import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { getPubFromSecret } from 'keypom-js';
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

import keypomInstance from '@/lib/keypom';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: object;
  eventId: string;
  accountId: string;
}

export const VerifyModal = ({ isOpen, onClose, event, eventId, accountId }: VerifyModalProps) => {
  // qr code input
  const [data, setData] = useState('No result');
  const [ticketData, setTicketData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setTicketData(null);
  }, [isOpen]);

  const checkData = async (answer) => {
    // answer = answer?.trim();

    if (keypomInstance == null || keypomInstance === undefined) {
      toast({
        title: 'loading...',
        description: `Try again in a moment`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // test answer
    // answer =
    //   'ed25519:AXSwjeNg8qS8sFPSCK2eYK7UoQ3Kyyqt9oeKiJRd8pUhhEirhL2qbrs7tLBYpoGE4Acn8JbFL7FVjgyT2aDJaJx';
    // answer =
    //   'ed25519:27HQjCztqJmAMHjkM6RpQCc7giQ5H8CTxFrqaScfejp1SbfHZp7oDjqn27CyLKWWLHfHTaqtWfVYa3BYqxjZ6TMp';
    try {
      const secretKey = answer;
      const publicKey: string = getPubFromSecret(secretKey);

      const keyinfo = await keypomInstance.getTicketKeyInformation({
        publicKey: String(publicKey),
      });

      // get drop info using the key info id

      const dropID = keyinfo.token_id.split(':')[0];

      const dropData = await keypomInstance.getTicketDropInformation({ dropID });

      // parse dropData's metadata to get eventId
      const meta: EventDropMetadata = JSON.parse(dropData.drop_config.metadata);

      const keyinfoEventId = meta.eventId;
      if (keyinfoEventId !== eventId) {
        throw new Error('The ticket is not for this event.');
      }
      const drop = await keypomInstance.getEventInfo({ accountId, eventId: keyinfoEventId });

      const meta2 = drop; // EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      let dateString = '';
      if (meta2?.date?.date != null && meta2.date.date !== undefined) {
        dateString =
          typeof meta2.date.date === 'string'
            ? meta2.date.date
            : `${meta2.date.date.from} to ${meta2.date.date.to}`;
      }
      setTicketData({
        name: meta2.name || 'Untitled',
        artwork: meta2.artwork || 'loading',
        questions: meta2.questions || [],
        location: meta2.location || 'loading',
        date: dateString,
        description: meta2.description || 'loading',
      });
      toast({
        title: 'Ticket verified!',
        description: `Details shown in the modal`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return;
    } catch (error) {
      toast({
        title: 'Invalid',
        description: 'Your ticket is invalid',
        status: 'error',
        duration: 1000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
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

          {ticketData != null ? (
            <>
              <Text
                as="h2"
                color="black.800"
                fontSize="xl"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                {ticketData?.name}
              </Text>
              <Image
                alt={'ticketimage'}
                height="300"
                objectFit="cover"
                src={ticketData?.artwork}
                width="100%"
              />
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
              <Text textAlign="left">{ticketData?.description}</Text>
              <Text
                as="h2"
                color="black.800"
                fontSize="l"
                fontWeight="medium"
                my="4px"
                textAlign="left"
              >
                Ticket Date
              </Text>
              <Text textAlign="left">{ticketData?.passValidThrough}</Text>
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
              <Text textAlign="left">{ticketData.location}</Text>
            </>
          ) : null}

          <ModalFooter>
            {/* <Button variant={'secondary'} w="100%" onClick={checkData}>
              test
            </Button> */}
            <Button variant={'secondary'} w="100%" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};
