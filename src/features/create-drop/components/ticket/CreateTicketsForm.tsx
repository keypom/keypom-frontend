import {
  Button,
  Show,
  Heading,
  Hide,
  HStack,
  Image,
  Skeleton,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';

import { FormControlComponent } from '@/components/FormControl';
import { type ColumnItem } from '@/components/Table/types';
import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DataTable } from '@/components/Table';
import { truncateAddress } from '@/utils/truncateAddress';
import { type DateAndTimeInfo } from '@/lib/eventsHelpers';

import {
  type TicketDropFormData,
  type EventStepFormProps,
} from '../../routes/CreateTicketDropPage';

import { ModifyTicketModal } from './ModifyTicketModal';
import { PreviewTicketModal } from './PreviewTicketModal';

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

export const defaultTicket = {
  name: '',
  description: '',
  artwork: undefined,
  priceNear: '0',
  salesValidThrough: {
    startDate: 0,
  },
  passValidThrough: {
    startDate: 0,
  },
  maxSupply: 0,
  maxPurchases: 0,
};

export interface TicketInfoFormMetadata {
  name: string;
  description: string;
  artwork: File | undefined;
  priceNear: string;
  salesValidThrough: DateAndTimeInfo;
  passValidThrough: DateAndTimeInfo;
  maxSupply: number;
  maxPurchases: number;
}

const CreateTicketsForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;
  const [isModifyTicketModalOpen, setIsModifyTicketModalOpen] = useState(false);
  const [isPreviewTicketModalOpen, setIsPreviewTicketModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInfoFormMetadata>(defaultTicket);
  const [editedTicket, setEditedTicket] = useState<TicketInfoFormMetadata | undefined>();

  const handleDeleteClick = (id) => {
    const newTickets = formData.tickets.filter((item) => item.name !== id);
    setFormData({ ...formData, tickets: newTickets });
  };

  const handleCopyItem = (id) => {
    const ticket = formData.tickets.find((item) => item.name === id);
    if (!ticket) return;

    // Function to generate a new unique ticket name
    const generateNewTicketName = (baseName: string) => {
      let copyNumber = 1;
      let newTicketName = `${baseName} (${copyNumber})`;
      // As long as the new ticket name already exists, increase the number
      while (formData.tickets.some((item) => item.name === newTicketName)) {
        copyNumber += 1;
        newTicketName = `${baseName} (${copyNumber})`;
      }
      return newTicketName;
    };

    // Generate a unique name for the new copied ticket
    const newTicketName = generateNewTicketName(ticket.name);
    const newTicket = { ...ticket, name: newTicketName };
    // Add the new unique ticket to the list of tickets
    setFormData({ ...formData, tickets: [...formData.tickets, newTicket] });
  };

  const handleModalClose = (shouldAdd: boolean, editedQuestion?: TicketInfoFormMetadata) => {
    if (shouldAdd) {
      let newTickets = formData.tickets;
      if (editedQuestion) {
        newTickets = newTickets.map((item) => {
          if (item.name === editedQuestion.name) {
            return currentTicket;
          }
          return item;
        });
      } else {
        newTickets.push(currentTicket);
      }

      setFormData({ ...formData, tickets: newTickets });
    }

    setIsModifyTicketModalOpen(false);
  };

  const openPreviewModal = (item: TicketInfoFormMetadata) => {
    setCurrentTicket(item);
    setIsPreviewTicketModalOpen(true);
  };

  const getTableRows = (data) => {
    if (data === undefined) return [];

    return data.map((item: TicketInfoFormMetadata) => ({
      id: item.name,
      price: item.priceNear === '0' ? 'Free' : item.priceNear,
      numTickets: item.maxSupply,
      name: (
        <>
          <Show above="md">
            <HStack spacing={4}>
              <Image
                alt={`Event image for ${item.name}`}
                borderRadius="12px"
                boxSize="48px"
                objectFit="contain"
                src={item.artwork && URL.createObjectURL(item.artwork)}
              />
              <VStack align="left">
                <Heading
                  fontFamily="body"
                  fontSize={{ md: 'lg' }}
                  fontWeight="bold"
                  overflowX="auto"
                >
                  {truncateAddress(item.name, 'end', 35)}
                </Heading>
                <Text fontFamily="body" fontSize={{ md: 'md' }} fontWeight="light">
                  {truncateAddress(item.description, 'end', 35)}
                </Text>
              </VStack>
            </HStack>
          </Show>
          <Hide above="md">
            <VStack spacing={4}>
              <Image
                alt={`Event image for ${item.name}`}
                borderRadius="12px"
                boxSize="48px"
                objectFit="contain"
                src={item.artwork && URL.createObjectURL(item.artwork)}
              />
              <VStack align="left">
                <Heading fontFamily="body" fontSize={{ md: 'lg' }} fontWeight="bold">
                  {truncateAddress(item.name, 'end', 35)}
                </Heading>
                <Text fontFamily="body" fontSize={{ md: 'md' }} fontWeight="light" noOfLines={1}>
                  {truncateAddress(item.description, 'end', 35)}
                </Text>
              </VStack>
            </VStack>
          </Hide>
        </>
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
          Preview ticket
        </Heading>
      ),
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
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
              setIsModifyTicketModalOpen(true);
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
        allTickets={formData.tickets}
        currentTicket={currentTicket}
        editedTicket={editedTicket}
        eventDate={formData.date.value}
        formData={formData}
        isOpen={isModifyTicketModalOpen}
        setCurrentTicket={setCurrentTicket}
        onClose={handleModalClose}
      />
      <PreviewTicketModal
        currentTicket={currentTicket}
        isOpen={isPreviewTicketModalOpen}
        setIsOpen={setIsPreviewTicketModalOpen}
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
            showMobileTitles={[]}
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
            setIsModifyTicketModalOpen(true);
          }}
        >
          + Create ticket
        </Button>
      </VStack>
    </>
  );
};

export { CreateTicketsForm };
