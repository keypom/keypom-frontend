import {
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

import { EyeIcon } from '@/components/Icons/EyeIcon';
import { PlusButtonIcon } from '@/components/Icons/PlusButtonIcon';
import { MinusButtonIcon } from '@/components/Icons/MinusButtonIcon';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';
import { eventDateToPlaceholder } from './EventInfoForm';

interface PreviewTicketModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentTicket: TicketInfoFormMetadata;
}

export const PreviewTicketModal = ({
  isOpen,
  setIsOpen,
  currentTicket,
}: PreviewTicketModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      onClose={() => {
        console.log('close');
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent
        maxH="90vh"
        overflow="visible !important"
        overflowY="auto"
        paddingBottom="6"
        paddingTop="12"
        position="relative"
        px="6"
      >
        <IconButton
          aria-label="Ticket Icon"
          bgColor="#DDF4FA" // Or any color that matches the modal background
          border="2px solid transparent"
          borderColor="blue.200"
          borderRadius="full"
          height="60px"
          icon={<EyeIcon h="28px" />} // replace with your actual icon
          left="50%"
          overflow="visible !important"
          position="absolute"
          top={-6} // Half of the icon size to make it center on the edge
          transform="translateX(-50%) translateY(-10%)"
          variant="outline"
          width="60px"
          zIndex={1500} // Higher than ModalContent to overlap
        />
        <VStack align="stretch" spacing={6} w="full">
          <VStack
            align="stretch"
            bg="border.box"
            border="2px solid transparent"
            borderRadius="7xl"
            borderWidth="2px"
            overflow="hidden"
            p={6}
          >
            <Image
              alt="Event Artwork"
              borderRadius="5xl"
              height="40%"
              left="0"
              objectFit="cover" // This ensures the image covers the allotted area
              right="0"
              src={currentTicket.artwork && URL.createObjectURL(currentTicket.artwork[0])}
              top="0"
              width="100%"
              zIndex={2} // The zIndex ensures the image is above the gradient layer
            />
            <VStack align="left" spacing="2" textAlign="left">
              <Heading color="gray.900" fontSize="2xl" fontWeight="500">
                {currentTicket.name || 'Ticket name'}
              </Heading>
              <Heading color="gray.400" fontFamily="body" fontSize="xs" fontWeight="400">
                {eventDateToPlaceholder('', currentTicket.passValidThrough)}
              </Heading>
              <Heading color="gray.600" fontFamily="body" fontSize="xs" fontWeight="400">
                {currentTicket.description || 'Ticket description'}
              </Heading>
            </VStack>
            <HStack marginTop="5 !important">
              <IconButton
                aria-label="plus-button-icon"
                icon={<MinusButtonIcon color="gray.600" h="3px" w="10px" />} // replace with your actual icon
                variant="outline"
              />
              <Button
                border="1px solid transparent"
                borderColor="gray.200"
                borderRadius="6xl"
                color="gray.600"
                h="40px"
                variant="secondary"
                w="30px"
              >
                1
              </Button>
              <IconButton
                aria-label="plus-button-icon"
                icon={<PlusButtonIcon h="28px" />} // replace with your actual icon
                variant="outline"
              />
            </HStack>

            <Button borderRadius="6xl" marginTop="5 !important" variant="primary" w="full">
              {currentTicket.price === '0' ? `Get for free` : `Buy for ${currentTicket.price} NEAR`}
            </Button>
          </VStack>
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Close preview
          </Button>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
