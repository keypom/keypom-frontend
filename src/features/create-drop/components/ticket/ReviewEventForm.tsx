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
  Grid,
  Flex,
  GridItem,
  Divider,
  Box,
} from '@chakra-ui/react';
import { Fragment, useMemo, useState } from 'react';

import keypomInstance from '@/lib/keypom';
import { type ColumnItem } from '@/components/Table/types';
import { DeleteIcon } from '@/components/Icons';
import { DataTable } from '@/components/Table';
import { truncateAddress } from '@/utils/truncateAddress';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

import { type EventStepFormProps } from '../../routes/CreateTicketDropPage';

import { PreviewTicketModal } from './PreviewTicketModal';
import { defaultTicket, type TicketInfoFormMetadata } from './CreateTicketsForm';

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
    title: 'Count',
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

const ReviewEventForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;
  const [isPreviewTicketModalOpen, setIsPreviewTicketModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<TicketInfoFormMetadata>();

  const handleDeleteClick = (id) => {
    const newTickets = formData.tickets.filter((item) => item.name !== id);
    setFormData({ ...formData, tickets: newTickets });
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
        </HStack>
      ),
    }));
  };

  const data = useMemo(() => getTableRows(formData.tickets), [getTableRows, formData.tickets]);

  return (
    <>
      <PreviewTicketModal
        currentTicket={currentTicket || defaultTicket}
        isOpen={isPreviewTicketModalOpen}
        setIsOpen={setIsPreviewTicketModalOpen}
      />

      <VStack
        align="top"
        justifyContent="space-between"
        paddingTop="5"
        spacing="4"
        textAlign="left"
        width="full"
      >
        <Heading fontFamily="body" fontSize="lg" fontWeight="500" textColor="gray.900">
          Let's make sure all your details are correct
        </Heading>
        <Image
          alt={`Event image for ${formData.eventName.value}`}
          borderRadius="12px"
          height="120px"
          objectFit="cover"
          src={URL.createObjectURL(formData.eventArtwork.value!)}
          width="full"
        />
        <HStack align="top" justifyContent="space-between" minW="0" spacing="6" w="full">
          <Grid alignItems="start" gap={6} templateColumns="2fr 1fr" w="full">
            <VStack align="left" spacing="2" textAlign="left">
              <Heading fontFamily="body" fontSize="md" fontWeight="500" textColor="gray.900">
                Event name
              </Heading>
              <Heading fontFamily="body" fontSize="md" fontWeight="400" textColor="gray.600">
                {formData.eventName.value}
              </Heading>
            </VStack>

            <VStack align="left" spacing="2" textAlign="left">
              <Heading fontFamily="body" fontSize="md" fontWeight="500" textColor="gray.900">
                Event date
              </Heading>
              <Heading fontFamily="body" fontSize="md" fontWeight="400" textColor="gray.600">
                {dateAndTimeToText(formData.date.value)}
              </Heading>
            </VStack>

            <VStack align="left" spacing="2" textAlign="left">
              <Heading fontFamily="body" fontSize="md" fontWeight="500" textColor="gray.900">
                Event description
              </Heading>
              <Heading fontFamily="body" fontSize="md" fontWeight="400" textColor="gray.600">
                {formData.eventDescription.value}
              </Heading>
            </VStack>

            <VStack align="left" spacing="2" textAlign="left">
              <Heading fontFamily="body" fontSize="md" fontWeight="500" textColor="gray.900">
                Event location
              </Heading>
              <Heading fontFamily="body" fontSize="md" fontWeight="400" textColor="gray.600">
                {formData.eventLocation.value}
              </Heading>
            </VStack>
          </Grid>
        </HStack>

        <DataTable
          columns={columns}
          data={data}
          excludeMobileColumns={[]}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          showMobileTitles={['numTickets', 'priceNEAR']}
          type="create-tickets"
        />
        <Flex alignItems="flex-end" justifyContent="flex-end" w="full">
          <Grid alignItems="top" columnGap={4} rowGap={2} templateColumns="1fr auto">
            <GridItem>
              <Text fontWeight="bold">Event Setup</Text>
            </GridItem>
            <GridItem justifySelf="end">
              <Text>{keypomInstance.yoctoToNear(formData.costBreakdown.perEvent)} NEAR</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold">Market Listing</Text>
            </GridItem>
            <GridItem justifySelf="end">
              <Text>{keypomInstance.yoctoToNear(formData.costBreakdown.marketListing)} NEAR</Text>
            </GridItem>
            {formData.tickets.map((item, index) => (
              <Fragment key={item.name || index}>
                <GridItem>
                  <Text fontWeight="bold">{item.name}</Text>
                </GridItem>
                <GridItem justifySelf="end">
                  <Text>{keypomInstance.yoctoToNear(formData.costBreakdown.perDrop)} NEAR</Text>
                </GridItem>
              </Fragment>
            ))}

            {/* Divider with small margin top and larger margin bottom */}
            <GridItem colSpan={2}>
              <Box mb={4} mt={2}>
                <Divider />
              </Box>
            </GridItem>

            {/* Total with more space above */}
            <GridItem justifySelf="top" pt={0}>
              <Text fontWeight="bold">Total</Text>
            </GridItem>
            <GridItem justifySelf="end" pt={0}>
              <HStack justifyContent="space-between" width="full">
                <Box> {/* Empty box to take up space and allow the text to align right */} </Box>
                <VStack align="end" spacing="0">
                  {' '}
                  {/* Ensure VStack is aligning items to the end */}
                  <Text fontWeight="bold">
                    {`${keypomInstance.yoctoToNear(formData.costBreakdown.total)} NEAR`}
                  </Text>
                  {formData.nearPrice && (
                    <Text fontWeight="normal">
                      {`($${(
                        parseFloat(keypomInstance.yoctoToNear(formData.costBreakdown.total)) *
                        formData.nearPrice
                      ).toFixed(2)})`}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </GridItem>
          </Grid>
        </Flex>
      </VStack>
    </>
  );
};

export { ReviewEventForm };
