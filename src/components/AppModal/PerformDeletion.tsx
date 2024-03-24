import { type Wallet } from '@near-wallet-selector/core';
import { Button, ModalContent, Text, VStack } from '@chakra-ui/react';

import keypomInstance from '@/lib/keypom';
import { KEYPOM_EVENTS_CONTRACT } from '@/constants/common';
import { type EventDrop, type TicketInfoMetadata } from '@/lib/eventsHelpers';

import ProgressModalContent from './ProgessModalContent';
import CompletionModalContent from './CompletionModal';

export const performDeletionLogic = async ({
  wallet,
  accountId,
  deleteAll,
  eventId,
  ticketData,
  setAppModal,
}: {
  wallet: Wallet;
  deleteAll: boolean;
  accountId: string;
  eventId: string;
  ticketData: any;
  setAppModal: any;
}) => {
  if (!wallet) return;

  try {
    let totalSupplyTickets = 0;
    const ticketSupplies: number[] = [];
    for (let i = 0; i < ticketData.length; i++) {
      const dropId = ticketData[i].drop_id;
      const supplyForTicket: number = await keypomInstance.getKeySupplyForTicket(dropId);

      ticketSupplies.push(supplyForTicket);
      totalSupplyTickets += supplyForTicket;
    }

    let totalDeleted = 0;
    for (let i = 0; i < ticketData.length; i++) {
      const curTicketData: EventDrop = ticketData[i];
      const dropId = curTicketData.drop_id;
      const supplyForTicket = ticketSupplies[i];
      const meta: TicketInfoMetadata = curTicketData.drop_config.nft_keys_config.token_metadata;

      let deletedForTicket = 0;
      const deleteLimit = 50;

      if (supplyForTicket === 0) {
        // Update Progress Modal
        setAppModal({
          isOpen: true,
          size: 'xl',
          canClose: false,
          modalContent: (
            <ProgressModalContent
              message={`Deleting Ticket`}
              progress={(totalDeleted / totalSupplyTickets) * 100}
              title={`Deleting: ${meta.title || 'Ticket'} (${
                ticketData.length - (i + 1)
              } Tickets Types Left)`}
            />
          ),
        });
        await wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: KEYPOM_EVENTS_CONTRACT,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'delete_keys',
                args: { drop_id: dropId },
                gas: '300000000000000',
                deposit: '0',
              },
            },
          ],
        });
      }

      for (let j = 0; j < supplyForTicket; j += deleteLimit) {
        const toDelete = Math.min(deleteLimit, supplyForTicket - deletedForTicket);

        // Update Progress Modal
        setAppModal({
          isOpen: true,
          size: 'xl',
          canClose: false,
          modalContent: (
            <ProgressModalContent
              message={`Deleting ${supplyForTicket.toString()} Purchased ${meta.title} Tickets`}
              progress={(totalDeleted / totalSupplyTickets) * 100}
              title={`Deleting: ${meta.title || 'Ticket'} (${
                ticketData.length - (i + 1)
              } Tickets Types Left)`}
            />
          ),
        });

        await wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: KEYPOM_EVENTS_CONTRACT,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'delete_keys',
                args: { drop_id: dropId, limit: toDelete },
                gas: '300000000000000',
                deposit: '0',
              },
            },
          ],
        });

        totalDeleted += toDelete;
        deletedForTicket += toDelete;
      }

      keypomInstance.deleteTicketFromCache({ dropId });
    }

    if (deleteAll) {
      setAppModal({
        isOpen: true,
        size: 'xl',
        canClose: false,
        modalContent: (
          <ProgressModalContent
            message={`All Tickets Deleted. Clearing Event Data.`}
            progress={0}
            title={`Deleting Event Data`}
          />
        ),
      });
      await keypomInstance.deleteEventFromFunderMetadata({
        accountId,
        eventId,
        wallet,
      });
      keypomInstance.deleteEventFromCache({ eventId });
    }

    // Completion Modal
    setAppModal({
      isOpen: true,
      size: 'xl',
      modalContent: (
        <CompletionModalContent
          completionMessage={
            ticketData.length === 0
              ? `Event successfully deleted!`
              : `${String(ticketData.length)} Ticket(s) deleted successfully!`
          }
          onClose={() => {
            setAppModal({ isOpen: false });
          }}
        />
      ),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during deletion:', error);
    // Error Modal
    setAppModal({
      isOpen: true,
      size: 'xl',
      modalContent: (
        <ModalContent padding={6}>
          <VStack align="stretch" spacing={4}>
            <Text color="red.500" fontSize="lg" fontWeight="semibold">
              Error
            </Text>
            <Text>There was an error deleting the Tickets. Please try again.</Text>
            <Button
              autoFocus={false}
              variant="secondary"
              width="full"
              onClick={() => {
                setAppModal({ isOpen: false });
              }}
            >
              Close
            </Button>
          </VStack>
        </ModalContent>
      ),
    });
  }
};
