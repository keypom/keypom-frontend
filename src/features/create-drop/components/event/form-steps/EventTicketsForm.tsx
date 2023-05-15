import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Flex, FormLabel, Text, useDisclosure, VStack } from '@chakra-ui/react';
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
    thProps: {
      width: '47%',
      pl: '4',
    },
  },
  {
    id: 'count',
    title: 'Count',
    selector: (row) => row.numberOfTickets,
    tdProps: {
      textAlign: 'center',
    },
    thProps: {
      textAlign: 'center',
      width: '12%',
    },
  },
  {
    id: 'price',
    title: 'Price (NEAR)',
    selector: (row) => row.nearPricePerTicket,
    thProps: {
      width: '18%',
      textAlign: 'center',
    },
    tdProps: {
      textAlign: 'center',
    },
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    tdProps: {
      display: 'table-cell',
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
    return {
      id: ticket.id,
      name: (
        <VStack alignItems="left">
          <Text
            color="gray.900"
            fontWeight="medium"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {ticket.name}
          </Text>
          <Text fontSize="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {ticket.description}
          </Text>
          <Text color="gray.400" fontSize="xs">
            {new Date(ticket.salesStartDate).toLocaleDateString()} -{' '}
            {new Date(ticket.salesEndDate).toLocaleDateString()}
          </Text>
        </VStack>
      ),
      numberOfTickets: ticket.numberOfTickets,
      nearPricePerTicket: ticket.nearPricePerTicket,
      action: (
        <Box>
          <Button
            borderRadius="5xl"
            height="40px"
            mr="1"
            p="14px"
            size="sm"
            variant="icon"
            onClick={() => {
              removeTicket(index);
            }}
          >
            <DeleteIcon color="red" />
          </Button>
          <Button
            borderRadius="5xl"
            height="40px"
            mr="1"
            p="14px"
            size="sm"
            variant="icon"
            onClick={async () => {
              setCurrentTicketIndex(index);
              setModalAction('edit');
              onOpen();
            }}
          >
            <EditIcon />
          </Button>
        </Box>
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
      {ticketsData.length > 0 && (
        <Box mt="5">
          <FormLabel>Your tickets</FormLabel>
          <DataTable
            showColumns
            columns={COLUMNS}
            data={ticketsData}
            layout="fixed"
            size="sm"
            variant="tertiary"
          />
        </Box>
      )}
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
