import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Box,
  Center,
} from '@chakra-ui/react';
import Confetti from 'react-confetti';

import { type FunderEventMetadata } from '@/lib/eventsHelpers';
import { conferenceFooterMenuIndexes, useConferenceContext } from '@/contexts/ConferenceContext';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAmount: string;
  image: string;
  name: string;
  eventInfo: FunderEventMetadata;
}

const TokenModal = ({ isOpen, onClose, tokenAmount, image, name, eventInfo }: TokenModalProps) => {
  const { onSelectTab } = useConferenceContext();
  const imageUrl = `/assets/demos/consensus/${image}`;
  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };
  const imageBoxSize = { base: '70%', md: '50%', lg: '40%' }; // Responsive image sizing

  const title = 'Tokens Claimed';
  const subtitle = `Successfully claimed ${tokenAmount} tokens.`;
  const showConfetti = true;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} mx={3} p={modalPadding} textAlign="center">
        {showConfetti && <Confetti />}
        <ModalHeader pb={2} pt={6}>
          <VStack pb="2" spacing="0">
            <Text
              color="event.h1"
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="600"
              textAlign="center"
            >
              {title}
            </Text>

            <Text
              color="event.h3"
              fontFamily="heading"
              fontSize="md"
              fontWeight="400"
              textAlign="center"
            >
              {subtitle}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={5}>
            <Center>
              <VStack>
                <Box mx="auto" w={imageBoxSize}>
                  <Image
                    alt={name}
                    borderRadius="md"
                    maxH={32} // Set a maximum height for the image
                    maxW="full"
                    objectFit="contain" // Keep the image's aspect ratio
                    src={imageUrl}
                  />
                </Box>

                <Text
                  color="black"
                  fontFamily="heading"
                  fontSize="sm"
                  fontWeight="400"
                  textAlign="left"
                >
                  {name}
                </Text>
              </VStack>
            </Center>
          </VStack>
        </ModalBody>
        <ModalFooter flexDirection="column" pb={6} pt={0}>
          <VStack spacing="3" w="full">
            <Button
              backgroundColor="event.button.primary.bg"
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
              variant="outline"
              w="full"
              onClick={() => {
                onSelectTab(conferenceFooterMenuIndexes.assets);
              }}
            >
              MY ASSETS
            </Button>
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
              variant="outline"
              w="full"
              onClick={onClose}
            >
              CLOSE
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TokenModal;
