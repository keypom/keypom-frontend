import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';

import { type TicketSchema } from '@/features/create-drop/contexts/CreateEventDropsContext';
import { CreateTicketModal } from '@/features/create-drop/components/event/CreateTicketModal';
import { TicketCard } from '@/features/create-drop/components/TicketCard/TicketCard';

const defaultTicketValues: TicketSchema = {
  name: '',
  description: '',
  salesStartDate: '',
  salesEndDate: '',
  nearPricePerTicket: undefined,
  numberOfTickets: undefined,
};

export const EventTicketsForm = () => {
  const [modalAction, setModalAction] = useState('create');
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();

  const {
    fields: ticketFields,
    append: appendTicket,
    update: updateTicket,
    remove: removeTicket,
  } = useFieldArray({
    control,
    name: 'tickets',
  });

  const handleConfirmTicket = (ticketData) => {
    if (modalAction === 'create') {
      appendTicket(ticketData);
      return;
    }

    updateTicket(currentTicketIndex, ticketData);
  };

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        w="full"
        onClick={() => {
          setModalAction('create');
          onOpen();
        }}
      >
        Add a ticket
      </Button>
      <Box mt="10">
        {ticketFields.map((ticket, index) => (
          <TicketCard
            key={ticketFields?.[index]?.id}
            id={ticketFields?.[index]?.id}
            ticket={ticket}
            onEditClick={() => {
              setModalAction('update');
              setCurrentTicketIndex(index);
              window.setTimeout(() => {
                onOpen();
              }, 0);
            }}
            onRemoveClick={() => {
              removeTicket(index);
            }}
          />
        ))}
      </Box>
      <CreateTicketModal
        confirmText={modalAction === 'create' ? 'Add ticket' : 'Save changes'}
        isOpen={isOpen}
        values={modalAction === 'create' ? defaultTicketValues : ticketFields[currentTicketIndex]}
        onCancel={() => {
          if (modalAction === 'create') {
            removeTicket(ticketFields.length);
          }
          window.setTimeout(() => {
            onClose();
          }, 0);
        }}
        onClose={onClose}
        onConfirm={handleConfirmTicket}
      />
    </>
  );
};
