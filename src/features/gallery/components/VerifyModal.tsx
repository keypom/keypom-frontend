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
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

import keypomInstance from '@/lib/keypom';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const accountId = 'benjiman.testnet';

export const VerifyModal = ({ isOpen, onClose, event }: VerifyModalProps) => {
  // qr code input
  const [data, setData] = useState('No result');
  const [ticketData, setTicketData] = useState({});
  const toast = useToast();

  const checkData = async (answer) => {
    // answer = answer?.trim();

    if (!keypomInstance || !accountId) {
      console.error('not ready yet');
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
    try {
      const secretKey = answer;
      const publicKey: string = getPubFromSecret(secretKey);

      const keyinfo = await keypomInstance.getTicketKeyInformation({
        publicKey: String(publicKey),
      });

      console.log('keyinfo: ', keyinfo);

      // get drop info using the key info id

      const dropID = keyinfo.token_id.split(':')[0];

      console.log('dropID: ', dropID);

      const dropData = await keypomInstance.getTicketDropInformation({ dropID });

      console.log('dropData: ', dropData);

      // parse dropData's metadata to get eventId
      const meta: EventDropMetadata = JSON.parse(dropData.drop_config.metadata);

      const keyinfoEventId = meta.ticketInfo?.eventId;
      if (keyinfoEventId !== eventId) {
        console.error('Event ID mismatch', keyinfoEventId, eventId);
      }
      console.log('keyinfoeventID: ', keyinfoEventId);
      const drop = await keypomInstance.getEventDrop({ accountId, eventId: keyinfoEventId });

      console.log('drop: ', drop);
      const meta2: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      let dateString = '';
      if (meta2.eventInfo?.date) {
        dateString =
          typeof meta2.eventInfo?.date.date === 'string'
            ? meta2.eventInfo?.date.date
            : `${meta2.eventInfo?.date.date.from} to ${meta2.eventInfo?.date.date.to}`;
      }

      setTicketData({
        name: meta2.eventInfo?.name || 'Untitled',
        artwork: meta2.eventInfo?.artwork || 'loading',
        questions: meta2.eventInfo?.questions || [],
        location: meta2.eventInfo?.location || 'loading',
        date: dateString,
        description: meta2.eventInfo?.description || 'loading',
        ticketInfo: meta2.ticketInfo,
      });
      return;
    } catch (error) {
      console.error('Invalid ticket sale');
      toast({
        title: 'Sale request failure',
        description: `This item may not be put for sale at this time since ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
                {ticketData?.ticketInfo?.name}
              </Text>
              <Image
                alt={'ticketimage'}
                height="300"
                objectFit="cover"
                src={ticketData?.ticketInfo?.artwork}
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
              <Text textAlign="left">{ticketData?.ticketInfo?.description}</Text>
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
              <Text textAlign="left">{ticketData?.ticketInfo?.passValidThrough}</Text>
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
