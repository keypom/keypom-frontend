import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  ModalContent,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';

import { FormControlComponent } from '@/components/FormControl';
import { type ColumnItem } from '@/components/Table/types';
import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DataTable } from '@/components/Table';
import { useAppContext } from '@/contexts/AppContext';

import {
  type TicketDropFormData,
  type EventStepFormProps,
  type EventDate,
} from '../../routes/CreateTicketDropPage';

import { ModifyTicketModal } from './ModifyTicketModal';

import { eventDateToPlaceholder } from '.';

const columns: ColumnItem[] = [
  {
    id: 'ticket',
    title: 'Ticket',
    selector: (row) => row.name,
    loadingElement: <Skeleton height="" />,
  },
  {
    id: 'previewTicket',
    title: '',
    selector: (row) => row.previewTicket,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numTickets',
    title: '# tickets',
    selector: (row) => row.numTickets,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'priceNEAR',
    title: 'Price (NEAR)',
    selector: (row) => row.price,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

export const CollectInfoFormValidation = (formData: TicketDropFormData) => {
  const newFormData = { ...formData };
  const isErr = false;

  return { isErr, newFormData };
};

const defaultTicket = {
  name: '',
  description: '',
  artwork: undefined,
  price: '0',
  salesValidThrough: {
    startDate: null,
    endDate: null,
  },
  passValidThrough: {
    startDate: null,
    endDate: null,
  },
  maxSupply: 0,
};

export interface TicketInfoFormMetadata {
  name: string;
  description: string;
  artwork: File | undefined;
  price: string;
  salesValidThrough: EventDate;
  passValidThrough: EventDate;
  maxSupply: number;
}

const CreateTicketsForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInfoFormMetadata>(defaultTicket);
  const [editedTicket, setEditedTicket] = useState<TicketInfoFormMetadata | undefined>();
  const { setAppModal } = useAppContext();

  const handleDeleteClick = (id) => {
    const newTickets = formData.tickets.filter((item) => item.name !== id);
    setFormData({ ...formData, tickets: newTickets });
  };

  const handleCopyItem = (id) => {
    const ticket = formData.tickets.find((item) => item.name === id);
    if (!ticket) return;
    const newTicket = { ...ticket, name: `${ticket.name} (copy)` };
    setFormData({ ...formData, tickets: [...formData.tickets, newTicket] });
  };

  const handleModalClose = (shouldAdd: boolean, editedQuestion?: TicketInfoFormMetadata) => {
    console.log('editedQuestion', editedQuestion);
    console.log('shouldAdd', shouldAdd);
    if (shouldAdd) {
      let newTickets = formData.tickets;
      if (editedQuestion) {
        newTickets = newTickets.map((item) => {
          if (item.name === editedQuestion.name) {
            return editedQuestion;
          }
          return item;
        });
      } else {
        newTickets.push(currentTicket);
      }

      setFormData({ ...formData, tickets: newTickets });
    }

    setIsModalOpen(false);
  };

  const openPreviewModal = (item: TicketInfoFormMetadata) => {
    setAppModal({
      isOpen: true,
      size: 'xl',
      modalContent: (
        <ModalContent maxH="90vh" overflowY="auto" padding={6}>
          <VStack
            align="stretch"
            bg="border.box"
            border="2px solid transparent"
            borderRadius="xl"
            borderWidth="1px"
            overflow="hidden"
            p={2}
            w="130px"
          >
            <Box
              alignSelf="stretch"
              bgGradient="linear(to right bottom, rgba(255, 255, 255, 0), rgba(115, 214, 243, 0.2))"
              borderRadius="xl"
              height="75px"
              left="0"
              right="0"
              top="0"
              width="100%"
            />
            <VStack align="left" spacing="3px">
              <Box bg="gray.100" borderRadius="100px" h="13px" w="70%" />
              <Box bg="gray.100" borderRadius="100px" h="5px" w="100%" />
              <Box bg="gray.100" borderRadius="3px" h="50px" w="100%" />
            </VStack>
            <Box bg="gray.800" borderRadius="3px" h="12px" w="100%" />
          </VStack>
        </ModalContent>
      ),
    });
  };

  const getTableRows = (data) => {
    if (data === undefined) return [];

    return data.map((item: TicketInfoFormMetadata) => ({
      id: item.name,
      name: (
        <HStack spacing={4}>
          <Image
            alt={`Event image for ${item.name}`}
            borderRadius="12px"
            boxSize="48px"
            objectFit="contain"
            src={item.artwork && URL.createObjectURL(item.artwork[0])}
          />
          <VStack align="left">
            <Heading fontFamily="body" fontSize={{ md: 'lg' }} fontWeight="bold">
              {item.name}
            </Heading>
            <Heading fontFamily="body" fontSize={{ md: 'md' }} fontWeight="light">
              {item.description}
            </Heading>
            <VStack align="left" spacing={0}>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ md: 'md' }}
                fontWeight="light"
              >
                Purchase through: {eventDateToPlaceholder('Error?', item.salesValidThrough)}
              </Heading>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ md: 'md' }}
                fontWeight="light"
              >
                Valid through: {eventDateToPlaceholder('Error?', item.passValidThrough)}
              </Heading>
            </VStack>
          </VStack>
        </HStack>
      ),
      previewTicket: (
        <Heading
          _hover={{
            textDecoration: 'underline', // If you want underline on hover
            color: 'blue.600', // A darker color on hover
          }}
          color="blue.500"
          cursor="pointer"
          fontFamily="body"
          fontSize="sm"
          fontWeight="medium"
          onClick={() => {
            openPreviewModal(item);
          }}
        >
          View details
        </Heading>
      ),
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              handleDeleteClick(item.name); // Pass the correct id here
            }}
          >
            <DeleteIcon color="red.400" />
          </Button>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              handleCopyItem(item.name); // Pass the correct id here
            }}
          >
            <CopyIcon />
          </Button>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              setEditedTicket(item);
              setCurrentTicket(item);
              setIsModalOpen(true);
            }}
          >
            <EditIcon />
          </Button>
        </HStack>
      ),
    }));
  };

  const data = useMemo(() => getTableRows(formData.tickets), [getTableRows, formData.tickets]);

  return (
    <>
      <ModifyTicketModal
        currentTicket={currentTicket}
        editedTicket={editedTicket}
        isOpen={isModalOpen}
        setCurrentTicket={setCurrentTicket}
        onClose={handleModalClose}
      />
      <VStack align="top" justifyContent="space-between">
        <FormControlComponent
          helperText={`Create custom tickets for ${formData.eventName.value}.`}
          label="Create tickets*"
        >
          <DataTable
            columns={columns}
            data={data}
            excludeMobileColumns={[]}
            mt={{ base: '6', md: '4' }}
            showColumns={true}
            showMobileTitles={['isRequired']}
            type="create-tickets"
          />
        </FormControlComponent>
        <Button
          borderRadius="12px"
          fontSize="sm"
          padding="7px 16px 8px 16px"
          size="md"
          w="168px"
          onClick={() => {
            setEditedTicket(undefined);
            setCurrentTicket(defaultTicket);
            setIsModalOpen(true);
          }}
        >
          + Create ticket
        </Button>
      </VStack>
    </>
  );
};

export { CreateTicketsForm };
