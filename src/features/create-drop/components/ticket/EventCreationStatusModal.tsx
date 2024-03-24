import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TicketIcon } from '@/components/Icons';
import { EVENTS_WORKER_BASE } from '@/constants/common';

interface EventCreationStatusModalProps {
  isSuccess: boolean;
  setIsOpen: () => void;
  isOpen: boolean;
  prevEventData?: {
    priceByDropId?: Record<string, number>;
    eventId: string;
    stripeAccountId?: string;
  };
}

export const EventCreationStatusModal = ({
  isOpen,
  setIsOpen,
  isSuccess,
  prevEventData,
}: EventCreationStatusModalProps) => {
  const [isSetting, setIsSetting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePostEventCreation = async () => {
    if (isSuccess) {
      setIsSetting(true);

      if (prevEventData?.stripeAccountId !== undefined) {
        let response: Response | undefined;
        try {
          const url = `${EVENTS_WORKER_BASE}/stripe/create-event`;
          const body = {
            priceByDropId: prevEventData.priceByDropId,
            stripeAccountId: prevEventData.stripeAccountId,
            eventId: prevEventData.eventId,
          };
          response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
          });
        } catch (error) {
          return;
        }

        if (!response?.ok) {
          toast({
            title: 'Unable to upload event to stripe',
            description: `Please delete the event and try again later. If the error persists, contact support.`,
            status: 'error',
            duration: 10000,
            isClosable: true,
          });
        } else {
          localStorage.removeItem('EVENT_INFO_SUCCESS_DATA');
        }
      } else {
        localStorage.removeItem('EVENT_INFO_SUCCESS_DATA');
      }
      setIsSetting(false);
      navigate('/events');
    } else {
      localStorage.removeItem('EVENT_INFO_SUCCESS_DATA');
    }
    setIsOpen();
  };

  const bodyMessage = () => {
    if (!isSuccess) {
      return 'Please try again later. If the error persists, contact support.';
    }

    if (prevEventData?.stripeAccountId !== undefined) {
      return 'The last step is to upload the event details to stripe so that you can receive funds.';
    }

    return `You're all set! Your event has been created and you can view it in the events page.`;
  };

  const buttonMessage = () => {
    if (!isSuccess) {
      return 'Close';
    }

    if (prevEventData?.stripeAccountId !== undefined) {
      return 'Upload to Stripe';
    }

    return 'View Event';
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
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
          icon={<TicketIcon h="28px" w="28px" />} // replace with your actual icon
          left="50%"
          overflow="visible !important"
          position="absolute"
          top={-6} // Half of the icon size to make it center on the edge
          transform="translateX(-50%) translateY(-10%)"
          variant="outline"
          width="60px"
          zIndex={1500} // Higher than ModalContent to overlap
        />
        <ModalHeader fontSize="lg" fontWeight="semibold">
          {isSuccess ? 'Event Created Successfully' : 'Event Creation Failed'}
        </ModalHeader>
        <VStack align="start" spacing={4} textAlign="left">
          <ModalBody pb={6}>
            <Text color="gray.600" fontSize="md">
              {bodyMessage()}
            </Text>
          </ModalBody>
          <ModalFooter width="100%">
            <Button
              colorScheme="blue"
              isLoading={isSetting}
              width="100%"
              onClick={handlePostEventCreation}
            >
              {buttonMessage()}
            </Button>
          </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
