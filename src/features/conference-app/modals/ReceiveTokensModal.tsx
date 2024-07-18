import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  VStack,
  Flex,
  Box,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import QRCode from 'react-qr-code';

import { useConferenceContext } from '@/contexts/ConferenceContext';

interface ReceiveTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiveTokensModal = ({ isOpen, onClose }: ReceiveTokensModalProps) => {
  const { eventInfo, accountId: curAccountId } = useConferenceContext();

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} p="0" position="relative" textAlign="center">
        <ModalHeader>
          <Box>
            <VStack p={modalPadding} pb="4" spacing="1">
              <Text
                color="event.h1"
                fontFamily="heading"
                fontSize="3xl"
                fontWeight="600"
                textAlign="center"
              >
                Receive Tokens
              </Text>
            </VStack>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Box p={modalPadding} pt="0">
            <VStack spacing="4">
              <Box textAlign="left" w="full">
                <VStack align="left" spacing="0" textAlign="left" w="full">
                  <Text
                    color="event.h2"
                    fontFamily="heading"
                    fontSize="xl"
                    fontWeight="500"
                  >
                    A. By QR Code
                  </Text>
                  <Text
                    color="event.h3"
                    fontFamily="heading"
                    fontSize="sm"
                    fontWeight="400"
                  >
                    Get scanned by someone:
                  </Text>
                </VStack>
                <Flex justifyContent="center" mt="2">
                  <Box border="1px solid" borderColor="gray.300" borderRadius="12px" p="5">
                    <QRCode id="QRCode" size={180} value={`profile:${curAccountId}`} />
                  </Box>
                </Flex>
              </Box>

              <Divider />

              <Box textAlign="left" w="full">
                <VStack align="left" spacing="0" textAlign="left" w="full">
                  <Text
                    color="event.h2"
              fontFamily="heading"
                    fontSize="xl"
                    fontWeight="500"
                  >
                    B. By Username
                  </Text>
                  <Text
                    color="event.h3"
                    fontFamily="heading"
                    fontSize="sm"
                    fontWeight="400"
                  >
                    Have others enter your username:
                  </Text>
                </VStack>
                <Flex
                  align="center"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="12px"
                  mt="2"
                  p="3"
                  verticalAlign="center"
                >
                  <Avatar bg="blue.800" color="white" mr="3" name={curAccountId} size="sm" />
                  <Text
                    color="event.h2"
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="500"
                  >
                    {curAccountId.split('.')[0]}
                  </Text>
                </Flex>
              </Box>
            </VStack>

            <Button
              backgroundColor="gray.800"
              color="event.button.primary.color"
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="500"
              h="48px"
              sx={{
                "_hover": {
                    "backgroundColor": "event.button.primary.hover"
                }
            }}
              mt="6"
              variant="outline"
              w="full"
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveTokensModal;
