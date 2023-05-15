import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Flex, FormLabel, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';

import { type TicketSchema } from '@/features/create-drop/contexts/CreateEventDropsContext';
import { CreateTicketModal } from '@/features/create-drop/components/event/CreateTicketModal';
import { DataTable } from '@/components/Table';
import { type ColumnItem } from '@/components/Table/types';
import { DeleteIcon } from '@/components/Icons';

const COLUMNS: ColumnItem[] = [
  {
    id: 'name',
    title: 'Name',
    selector: (row) => row.name,
  },
  {
    id: 'count',
    title: 'Count',
    selector: (row) => row.numberOfTickets,
  },
  {
    id: 'price',
    title: 'Price (NEAR)',
    selector: (row) => row.nearPricePerTicket,
  },
  {
    id: 'action',
    title: 'Action',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
  },
];

const defaultTicketValues: TicketSchema = {
  name: '',
  description: '',
  salesStartDate: new Date().toISOString(),
  salesEndDate: new Date().toISOString(),
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

  const { eventName } = getValues();

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

  const ticketsData = ticketFields.map((ticket, index) => {
    console.log(ticket);
    return {
      id: ticket.id,
      name: (
        <Text color="gray.400" display="flex">
          {ticket.name}
        </Text>
      ),
      numberOfTickets: ticket.numberOfTickets,
      nearPricePerTicket: ticket.nearPricePerTicket,
      action: (
        <>
          <Button
            mr="1"
            size="sm"
            variant="icon"
            onClick={() => {
              removeTicket(index);
            }}
          >
            <DeleteIcon color="red" />
          </Button>
          <Button
            size="sm"
            variant="icon"
            onClick={async () => {
              // edit
            }}
          >
            <EditIcon />
          </Button>
        </>
      ),
    };
  });

  return (
    <Box mt="8">
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <FormLabel>Create tickets*</FormLabel>
          <Text textAlign="left">Create custom tickets for {eventName}.</Text>
        </Box>
        <Button
          leftIcon={<AddIcon h="3" />}
          onClick={() => {
            setModalAction('create');
            onOpen();
          }}
        >
          Create ticket
        </Button>
      </Flex>
      <Box mt="3">
        <FormLabel>Your tickets</FormLabel>
        {ticketsData.length > 0 && <DataTable showColumns columns={COLUMNS} data={ticketsData} />}
        {/* <Box mt="10">
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
        </Box> */}
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
    </Box>
  );
};
