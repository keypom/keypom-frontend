import { Button, IconButton, Modal, ModalContent, ModalOverlay, VStack } from '@chakra-ui/react';

import { EyeIcon } from '@/components/Icons/EyeIcon';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';
import { DynamicTicketPreview } from './DynamicTicketPreview';

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
        // console.log('close');
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
        <VStack spacing="4" w="full">
          <DynamicTicketPreview currentTicket={currentTicket} />
          <Button
            variant="secondary"
            w="full"
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
